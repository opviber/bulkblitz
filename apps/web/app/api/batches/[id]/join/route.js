import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, handleAuthError } from "@/lib/auth";
import { joinBatchSchema, parseBody } from "@/lib/validation";
import { priceAtFill, resolveTier } from "@/lib/pricing";
import { createAuthOrder } from "@/lib/razorpay";
import { broadcastBatchUpdate } from "@/lib/realtime";
import { rateLimit, clientId } from "@/lib/ratelimit";

// POST /api/batches/:id/join
// Atomically reserves slots (row-locked) and creates a payment authorization hold.
export async function POST(request, { params }) {
  try {
    const user = await requireUser();
    const { id: batchId } = await params;

    const rl = await rateLimit(`join:${user.id}:${clientId(request)}`, {
      limit: 10,
      windowMs: 60_000,
    });
    if (!rl.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { data, error } = await parseBody(request, joinBatchSchema);
    if (error) return error;
    const { quantity, idempotencyKey } = data;

    // Idempotency: if we've already accepted this key, return the existing reservation.
    const existing = await prisma.slotReservation.findUnique({ where: { idempotencyKey } });
    if (existing) {
      return NextResponse.json({ reservation: existing, idempotent: true });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Lock the batch row to serialize concurrent joins at tier boundaries.
      const rows = await tx.$queryRaw`
        SELECT "currentSlots", "maxSlots", "moq", "status", "endTime"
        FROM "Batch" WHERE id = ${batchId} FOR UPDATE`;
      if (!rows || rows.length === 0) {
        return { httpError: NextResponse.json({ error: "Batch not found" }, { status: 404 }) };
      }
      const b = rows[0];
      if (b.status !== "LIVE") {
        return { httpError: NextResponse.json({ error: "Batch is not open" }, { status: 409 }) };
      }
      if (new Date(b.endTime) <= new Date()) {
        return { httpError: NextResponse.json({ error: "Batch has closed" }, { status: 409 }) };
      }
      const filled = Number(b.currentSlots);
      const max = Number(b.maxSlots);
      const newFilled = filled + quantity;
      if (newFilled > max) {
        return {
          httpError: NextResponse.json(
            { error: `Only ${max - filled} slots left` },
            { status: 409 }
          ),
        };
      }

      const tiers = await tx.tierSchedule.findMany({ where: { batchId } });
      const unitPrice = priceAtFill(tiers, newFilled);
      const holdAmount = unitPrice * quantity;

      const reservation = await tx.slotReservation.create({
        data: {
          batchId,
          userId: user.id,
          quantity,
          status: "PENDING",
          pricePerUnit: unitPrice,
          holdAmount,
          idempotencyKey,
        },
      });

      await tx.batch.update({
        where: { id: batchId },
        data: { currentSlots: newFilled },
      });

      const prevTier = resolveTier(tiers, filled);
      const newTier = resolveTier(tiers, newFilled);
      const priceDropped = prevTier && newTier && newTier.price < prevTier.price;

      return { reservation, newFilled, unitPrice, holdAmount, priceDropped };
    });

    if (result.httpError) return result.httpError;

    // Create the Razorpay authorization hold (authorize-only; captured at close).
    let razorpayOrder = null;
    try {
      razorpayOrder = await createAuthOrder({
        amountPaise: Math.round(result.holdAmount * 100),
        receipt: result.reservation.id,
        notes: { batchId, userId: user.id },
      });
    } catch (e) {
      console.warn("createAuthOrder failed:", e?.message);
    }

    // Broadcast live updates to all viewers (best-effort).
    await broadcastBatchUpdate(batchId, {
      type: result.priceDropped ? "PRICE_UPDATED" : "SLOT_FILLED",
      payload: { currentSlots: result.newFilled, pricePerUnit: result.unitPrice },
    });

    return NextResponse.json({
      reservation: result.reservation,
      currentSlots: result.newFilled,
      pricePerUnit: result.unitPrice,
      razorpayOrder,
    });
  } catch (err) {
    if (err?.status) return handleAuthError(err);
    console.error("join error:", err);
    return NextResponse.json({ error: "Failed to join batch" }, { status: 500 });
  }
}
