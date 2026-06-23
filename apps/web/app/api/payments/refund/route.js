import { NextResponse } from "next/server";
import { requireUser, handleAuthError } from "@/lib/auth";
import { refundSchema, parseBody } from "@/lib/validation";
import { refundPayment } from "@/lib/razorpay";

// POST /api/payments/refund  (ADMIN only)
export async function POST(request) {
  try {
    await requireUser(["ADMIN"]);
    const { data, error } = await parseBody(request, refundSchema);
    if (error) return error;

    const refund = await refundPayment({
      paymentId: data.paymentId,
      amountPaise: data.amount ? Math.round(data.amount * 100) : undefined,
    });
    return NextResponse.json({ ok: true, refund });
  } catch (err) {
    if (err?.status) return handleAuthError(err);
    console.error("refund error:", err);
    return NextResponse.json({ error: "Refund failed" }, { status: 500 });
  }
}
