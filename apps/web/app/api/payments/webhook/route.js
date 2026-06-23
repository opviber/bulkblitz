import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/razorpay";

// POST /api/payments/webhook
// Razorpay webhook receiver. Verifies signature against the raw body, then
// reconciles reservation/order state. Idempotent by event id.
export async function POST(request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Idempotency: skip already-processed events.
  const eventId = request.headers.get("x-razorpay-event-id") || event?.id;
  if (eventId) {
    const seen = await prisma.auditLog.findFirst({
      where: { entity: "razorpay_event", entityId: eventId },
    });
    if (seen) return NextResponse.json({ ok: true, duplicate: true });
  }

  const type = event?.event;
  const payment = event?.payload?.payment?.entity;

  try {
    if (type === "payment.authorized" && payment) {
      // Link the authorization id to the reservation (receipt carries reservation id).
      const reservationId = payment?.notes?.reservationId || payment?.receipt;
      if (reservationId) {
        await prisma.slotReservation.updateMany({
          where: { id: reservationId },
          data: { paymentHoldId: payment.id },
        });
      }
    } else if (type === "payment.captured" && payment) {
      await prisma.order.updateMany({
        where: { paymentCaptureId: payment.id },
        data: { status: "CONFIRMED" },
      });
    } else if (type === "refund.processed" && event?.payload?.refund?.entity) {
      // No-op beyond audit; refunds are initiated server-side at close.
    }

    if (eventId) {
      await prisma.auditLog.create({
        data: { action: type || "unknown", entity: "razorpay_event", entityId: eventId },
      });
    }
  } catch (e) {
    console.error("webhook processing error:", e?.message);
    return NextResponse.json({ error: "processing failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
