import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { closeOutcome } from "@/lib/pricing";
import { capturePayment, refundPayment } from "@/lib/razorpay";
import { broadcastBatchUpdate } from "@/lib/realtime";
import { creditWallet } from "@/lib/wallet";
import { dispatchNotification } from "@/lib/notifications";

/** Credit the referrer ₹10 BulkCash for the referred user's first ever order. */
async function maybeRewardReferrer(userId) {
  try {
    const referral = await prisma.referral.findFirst({
      where: { referredId: userId, rewarded: false },
    });
    if (!referral) return;
    const orderCount = await prisma.order.count({ where: { userId } });
    if (orderCount !== 1) return; // Only on first order
    await prisma.referral.update({ where: { id: referral.id }, data: { rewarded: true } });
    await creditWallet(
      referral.referrerId,
      referral.rewardAmount,
      `Referral reward for bringing user ${userId}`,
      `referral-reward-${referral.id}`
    );
    await dispatchNotification(referral.referrerId, {
      channel: "PUSH",
      title: "You earned BulkCash! 🎉",
      body: `₹${referral.rewardAmount} credited for your referral's first order.`,
      link: "/wallet",
    });
  } catch (e) {
    console.warn("referral reward failed:", e?.message);
  }
}

// POST /api/batches/:id/close
// Internal endpoint (cron / admin). Locks the final tier, captures or refunds.
// Protected by CRON_SECRET (Bearer) in production.
function authorized(request) {
  if (process.env.NODE_ENV !== "production") return true;
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function POST(request, { params }) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id: batchId } = await params;

  const outcome = await prisma.$transaction(async (tx) => {
    const rows = await tx.$queryRaw`
      SELECT "currentSlots", "moq", "status" FROM "Batch" WHERE id = ${batchId} FOR UPDATE`;
    if (!rows?.length) return { notFound: true };
    const b = rows[0];
    if (b.status !== "LIVE") return { alreadyClosed: true, status: b.status };

    const tiers = await tx.tierSchedule.findMany({ where: { batchId } });
    const { fulfilled, finalPrice } = closeOutcome({
      tiers,
      currentSlots: Number(b.currentSlots),
      moq: Number(b.moq),
    });

    await tx.batch.update({
      where: { id: batchId },
      data: {
        status: fulfilled ? "CLOSED" : "CANCELLED",
        finalPrice: fulfilled ? finalPrice : null,
        closedAt: new Date(),
      },
    });

    const reservations = await tx.slotReservation.findMany({
      where: { batchId, status: "PENDING" },
    });
    return { fulfilled, finalPrice, reservations };
  });

  if (outcome?.notFound) return NextResponse.json({ error: "Batch not found" }, { status: 404 });
  if (outcome?.alreadyClosed) {
    return NextResponse.json({ ok: true, skipped: true, status: outcome.status });
  }

  const { fulfilled, finalPrice, reservations } = outcome;
  let confirmed = 0;
  let refunded = 0;

  for (const r of reservations) {
    try {
      if (fulfilled) {
        const total = finalPrice * r.quantity;
        if (r.paymentHoldId) {
          await capturePayment({ paymentId: r.paymentHoldId, amountPaise: Math.round(total * 100) });
        }
        await prisma.order.create({
          data: {
            batchId,
            userId: r.userId,
            quantity: r.quantity,
            pricePerUnit: finalPrice,
            totalAmount: total,
            paymentCaptureId: r.paymentHoldId || null,
            status: "CONFIRMED",
          },
        });
        await prisma.slotReservation.update({ where: { id: r.id }, data: { status: "CONFIRMED" } });
        await maybeRewardReferrer(r.userId);
        await dispatchNotification(r.userId, {
          channel: "WHATSAPP",
          title: "Batch confirmed!",
          body: `Your order is locked at ₹${finalPrice}/unit.`,
          link: `/orders`,
        });
        confirmed++;
      } else {
        // MOQ not met → void hold / refund and credit BulkCash.
        if (r.paymentHoldId) {
          await refundPayment({ paymentId: r.paymentHoldId, amountPaise: Math.round((r.holdAmount || 0) * 100) });
        }
        await prisma.slotReservation.update({ where: { id: r.id }, data: { status: "CANCELLED" } });
        await dispatchNotification(r.userId, {
          channel: "WHATSAPP",
          title: "Batch did not fill",
          body: "Your hold was released. No charge was made.",
          link: `/wallet`,
        });
        refunded++;
      }
    } catch (e) {
      console.error(`close: reservation ${r.id} failed:`, e?.message);
    }
  }

  await broadcastBatchUpdate(batchId, {
    type: "BATCH_CLOSED",
    payload: { fulfilled, finalPrice },
  });

  return NextResponse.json({ ok: true, fulfilled, finalPrice, confirmed, refunded });
}
