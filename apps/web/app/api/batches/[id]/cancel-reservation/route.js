import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, handleAuthError } from "@/lib/auth";
import { broadcastBatchUpdate } from "@/lib/realtime";

// POST /api/batches/:id/cancel-reservation  { reservationId }
// Releases the user's slots while the batch is still LIVE.
export async function POST(request, { params }) {
  try {
    const user = await requireUser();
    const { id: batchId } = await params;
    const body = await request.json().catch(() => ({}));
    const reservationId = body?.reservationId;
    if (!reservationId) {
      return NextResponse.json({ error: "reservationId required" }, { status: 400 });
    }

    const newFilled = await prisma.$transaction(async (tx) => {
      const rows = await tx.$queryRaw`
        SELECT "currentSlots", "status" FROM "Batch" WHERE id = ${batchId} FOR UPDATE`;
      if (!rows?.length) return { httpError: NextResponse.json({ error: "Batch not found" }, { status: 404 }) };
      if (rows[0].status !== "LIVE") {
        return { httpError: NextResponse.json({ error: "Batch is locked; cannot cancel" }, { status: 409 }) };
      }

      const reservation = await tx.slotReservation.findFirst({
        where: { id: reservationId, batchId, userId: user.id, status: "PENDING" },
      });
      if (!reservation) {
        return { httpError: NextResponse.json({ error: "Reservation not found" }, { status: 404 }) };
      }

      await tx.slotReservation.update({
        where: { id: reservation.id },
        data: { status: "CANCELLED" },
      });
      const updated = await tx.batch.update({
        where: { id: batchId },
        data: { currentSlots: { decrement: reservation.quantity } },
      });
      return updated.currentSlots;
    });

    if (newFilled?.httpError) return newFilled.httpError;

    await broadcastBatchUpdate(batchId, {
      type: "SLOT_FILLED",
      payload: { currentSlots: newFilled },
    });

    return NextResponse.json({ ok: true, currentSlots: newFilled });
  } catch (err) {
    if (err?.status) return handleAuthError(err);
    console.error("cancel-reservation error:", err);
    return NextResponse.json({ error: "Failed to cancel reservation" }, { status: 500 });
  }
}
