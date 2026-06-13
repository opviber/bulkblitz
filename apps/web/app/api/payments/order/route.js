import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

let razorpay = null;
if (keyId && keySecret) {
  razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { amount } = body;

    if (!amount) {
      return NextResponse.json(
        { error: "Missing amount parameter" },
        { status: 400 }
      );
    }

    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    // Razorpay requires amounts in paise (multiply by 100)
    const amountInPaise = Math.round(value * 100);

    if (razorpay) {
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_wallet_${Date.now()}`,
      });

      return NextResponse.json({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        key: keyId, // Send keyId so client knows which key to open checkout with
        mock: false,
      });
    } else {
      // Sandbox fallback mode when keys are not configured
      console.warn("⚠️ Razorpay credentials not found in env. Falling back to Sandbox Mock mode.");
      const mockOrderId = `order_mock_${Math.random().toString(36).substring(2, 12)}`;
      
      return NextResponse.json({
        id: mockOrderId,
        amount: amountInPaise,
        currency: "INR",
        key: "rzp_test_mockKeyId123", // Sandbox client-side key placeholder
        mock: true,
      });
    }
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: "Internal Server Error creating order" },
      { status: 500 }
    );
  }
}
