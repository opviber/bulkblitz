// =============================================================================
// BulkBlitz — Razorpay integration (authorize → capture → refund)
//
// Real implementation when RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are set.
// In non-production without keys, a sandbox stub keeps local flows working.
// =============================================================================
import crypto from "crypto";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

export const razorpayConfigured = Boolean(keyId && keySecret);
export const allowSandbox = process.env.NODE_ENV !== "production";

let _client = null;
export function razorpayClient() {
  if (!razorpayConfigured) return null;
  if (_client) return _client;
  // Lazy require so the dep isn't pulled into the edge/runtime unnecessarily.
  const Razorpay = require("razorpay");
  _client = new Razorpay({ key_id: keyId, key_secret: keySecret });
  return _client;
}

/**
 * Create an order with manual capture (authorize-only hold).
 * amountPaise must be an integer (paise).
 */
export async function createAuthOrder({ amountPaise, receipt, notes }) {
  const client = razorpayClient();
  if (client) {
    return client.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt,
      payment_capture: 0, // authorize only; capture at batch close
      notes,
    });
  }
  if (allowSandbox) {
    return {
      id: `order_sandbox_${crypto.randomBytes(8).toString("hex")}`,
      amount: amountPaise,
      currency: "INR",
      receipt,
      status: "created",
      sandbox: true,
    };
  }
  throw new Error("Razorpay not configured");
}

/** Verify the client-side checkout signature. */
export function verifyCheckoutSignature({ orderId, paymentId, signature }) {
  if (!keySecret) return allowSandbox; // sandbox: accept
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature || ""));
}

/** Verify a Razorpay webhook signature (X-Razorpay-Signature). */
export function verifyWebhookSignature(rawBody, signature) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return allowSandbox;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature || ""));
  } catch {
    return false;
  }
}

/** Capture a previously authorized payment at the final amount. */
export async function capturePayment({ paymentId, amountPaise }) {
  const client = razorpayClient();
  if (client) {
    return client.payments.capture(paymentId, amountPaise, "INR");
  }
  if (allowSandbox) {
    return { id: paymentId, status: "captured", amount: amountPaise, sandbox: true };
  }
  throw new Error("Razorpay not configured");
}

/** Refund a captured (or authorized) payment. */
export async function refundPayment({ paymentId, amountPaise }) {
  const client = razorpayClient();
  if (client) {
    return client.payments.refund(paymentId, amountPaise ? { amount: amountPaise } : {});
  }
  if (allowSandbox) {
    return {
      id: `rfnd_sandbox_${crypto.randomBytes(6).toString("hex")}`,
      payment_id: paymentId,
      status: "processed",
      amount: amountPaise,
      sandbox: true,
    };
  }
  throw new Error("Razorpay not configured");
}
