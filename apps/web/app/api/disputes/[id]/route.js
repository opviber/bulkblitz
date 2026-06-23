import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, handleAuthError } from "@/lib/auth";
import { disputeResolveSchema, parseBody } from "@/lib/validation";
import { refundPayment } from "@/lib/razorpay";
import { creditWallet } from "@/lib/wallet";
import { dispatchNotification } from "@/lib/notifications";

// PUT /api/disputes/:id — admin mediation (resolve/reject, optional refund + bonus)
export async function PUT(request, { params }) {
  try {
    await requireUser(["ADMIN"]);
    const { id } = await params;
    const { data, error } = await parseBody(request, disputeResolveSchema);
    if (error) return error;

    const dispute = await prisma.dispute.findUnique({
      where: { id },
      include: { order: true },
    });
    if (!dispute) return NextResponse.json({ error: "Dispute not found" }, { status: 404 });

    if (data.status === "RESOLVED" && data.refund) {
      // Refund guarantee: refund the payment + credit a 5% BulkCash goodwill bonus.
      if (dispute.order.paymentCaptureId) {
        await refundPayment({
          paymentId: dispute.order.paymentCaptureId,
          amountPaise: Math.round(dispute.order.totalAmount * 100),
        });
      }
      await creditWallet(
        dispute.userId,
        Math.round(dispute.order.totalAmount * 0.05),
        `Dispute goodwill bonus for order ${dispute.orderId}`,
        `dispute-bonus-${dispute.id}`
      );
      await prisma.order.update({ where: { id: dispute.orderId }, data: { status: "CANCELLED" } });
    }

    const updated = await prisma.dispute.update({
      where: { id },
      data: {
        status: data.status,
        resolution: data.resolution || null,
        resolvedAt: ["RESOLVED", "REJECTED"].includes(data.status) ? new Date() : null,
      },
    });

    await dispatchNotification(dispute.userId, {
      channel: "EMAIL",
      title: `Dispute ${data.status.toLowerCase()}`,
      body: data.resolution || "Your dispute status was updated.",
      link: `/orders/${dispute.orderId}`,
    });

    return NextResponse.json({ dispute: updated });
  } catch (err) {
    if (err?.status) return handleAuthError(err);
    return NextResponse.json({ error: "Failed to update dispute" }, { status: 500 });
  }
}
