// =============================================================================
// BulkBlitz — Shared Zod validation schemas + helpers
// =============================================================================
import { z } from "zod";
import { NextResponse } from "next/server";

export const phoneSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number");

export const otpSendSchema = z.object({
  phone: phoneSchema,
});

export const otpVerifySchema = z.object({
  phone: phoneSchema,
  token: z.string().min(4).max(8),
  name: z.string().min(1).max(80).optional(),
  referralCode: z.string().min(4).max(16).optional(),
});

export const joinBatchSchema = z.object({
  quantity: z.coerce.number().int().min(1).max(10000),
  idempotencyKey: z.string().min(8).max(100),
});

export const reviewSchema = z.object({
  manufacturerId: z.string().uuid(),
  orderId: z.string().uuid().optional(),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export const disputeSchema = z.object({
  orderId: z.string().uuid(),
  reason: z.string().min(3).max(120),
  description: z.string().max(2000).optional(),
  evidence: z.array(z.string().url()).max(10).optional(),
});

export const wishlistSchema = z.object({
  batchId: z.string().uuid(),
});

export const searchSchema = z.object({
  q: z.string().max(120).optional(),
  category: z.string().max(40).optional(),
  city: z.string().max(60).optional(),
  pin: z.string().max(6).optional(),
  sort: z.enum(["velocity", "ending", "new", "price"]).optional(),
  page: z.coerce.number().int().min(1).max(500).optional(),
});

export const refundSchema = z.object({
  paymentId: z.string().min(3),
  amount: z.coerce.number().positive().optional(),
  reason: z.string().max(200).optional(),
});

export const onboardingSchema = z.object({
  gstNumber: z
    .string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN"),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN").optional(),
  bankAccount: z.string().min(6).max(24),
  bankIfsc: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC"),
});

export const uploadSchema = z.object({
  fileName: z.string().min(1).max(200),
  contentType: z.string().min(3).max(100),
});

export const trackingSchema = z.object({
  trackingNumber: z.string().min(3).max(60),
  carrier: z.string().min(2).max(40),
});

export const disputeResolveSchema = z.object({
  status: z.enum(["UNDER_REVIEW", "RESOLVED", "REJECTED"]),
  resolution: z.string().max(2000).optional(),
  refund: z.boolean().optional(),
});

export const adminBatchActionSchema = z.object({
  batchId: z.string().uuid(),
  action: z.enum(["approve", "reject", "feature", "unfeature"]),
});

export const adminManufacturerActionSchema = z.object({
  manufacturerId: z.string().uuid(),
  action: z.enum(["verify", "unverify", "blacklist", "unblacklist", "kyc_verify", "kyc_reject"]),
  note: z.string().max(500).optional(),
});

/**
 * Parse a request body against a schema. Returns { data } or { error: NextResponse }.
 */
export async function parseBody(request, schema) {
  let raw;
  try {
    raw = await request.json();
  } catch {
    return { error: NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }) };
  }
  const result = schema.safeParse(raw);
  if (!result.success) {
    return {
      error: NextResponse.json(
        { error: "Validation failed", issues: result.error.flatten() },
        { status: 422 }
      ),
    };
  }
  return { data: result.data };
}

/** Parse URL search params against a schema. */
export function parseQuery(request, schema) {
  const { searchParams } = new URL(request.url);
  const obj = Object.fromEntries(searchParams.entries());
  const result = schema.safeParse(obj);
  if (!result.success) {
    return {
      error: NextResponse.json(
        { error: "Invalid query", issues: result.error.flatten() },
        { status: 422 }
      ),
    };
  }
  return { data: result.data };
}
