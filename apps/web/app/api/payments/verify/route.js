import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma, getScopedUser } from "@/lib/prisma";
import { sendWhatsAppNotification, sendPushNotification } from "@/lib/notifications";

const keySecret = process.env.RAZORPAY_KEY_SECRET;

export async function POST(request) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, mock } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !amount) {
      return NextResponse.json(
        { error: "Missing required parameters for verification" },
        { status: 400 }
      );
    }

    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      return NextResponse.json(
        { error: "Invalid amount value" },
        { status: 400 }
      );
    }

    // 1. Verify Payment Signature (enforced in production, mock bypass only allowed in non-production)
    const isMockBypassAllowed = process.env.NODE_ENV !== "production" && mock;

    if (!isMockBypassAllowed) {
      if (!keySecret) {
        return NextResponse.json(
          { error: "Payment gateway credentials not configured on the server" },
          { status: 500 }
        );
      }

      if (!razorpay_signature) {
        return NextResponse.json(
          { error: "Missing signature for verification" },
          { status: 400 }
        );
      }

      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        console.error("Signature verification failed.");
        return NextResponse.json(
          { error: "Payment verification signature check failed" },
          { status: 400 }
        );
      }
    } else {
      console.log(`ℹ️ Sandbox verification: skipping HMAC checks for mock payment (ID: ${razorpay_payment_id}).`);
    }

    // 2. Fetch scoped user based on headers
    const user = await getScopedUser(request);

    if (!user) {
      return NextResponse.json(
        { error: "User profile not found. Please seed the database." },
        { status: 404 }
      );
    }

    // 3. Database transaction to load funds
    const result = await prisma.$transaction(async (tx) => {
      // Re-fetch user inside transaction with lock to prevent race updates on balance
      const freshUser = await tx.user.findUnique({
        where: { id: user.id }
      });
      if (!freshUser) {
        throw new Error("User profile not found");
      }

      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          walletBalance: {
            increment: value,
          },
        },
      });

      const description = mock
        ? `Fund load via Razorpay (Sandbox Mock: ${razorpay_payment_id})`
        : `Fund load via Razorpay (Payment: ${razorpay_payment_id})`;

      const txLedger = await tx.bulkCashTransaction.create({
        data: {
          userId: user.id,
          amount: value,
          type: "CREDIT",
          description,
        },
      });

      return {
        balance: updatedUser.walletBalance,
        transaction: txLedger,
      };
    });

    // 4. Trigger notification stubs
    try {
      const message = `🎉 Success! ₹${value.toLocaleString("en-IN")} credited to your BulkCash wallet. New Balance: ₹${result.balance.toLocaleString("en-IN")}. Ref: ${razorpay_payment_id}`;
      await sendWhatsAppNotification(user.phone, message);
      await sendPushNotification(user.id, "Wallet Credited", `₹${value} added successfully.`);
    } catch (notifErr) {
      console.error("Notification stub warning:", notifErr);
    }

    return NextResponse.json({
      success: true,
      balance: result.balance,
      transactionId: result.transaction.id,
    });
  } catch (error) {
    console.error("Error verifying payment signature:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error during verification" },
      { status: 500 }
    );
  }
}
