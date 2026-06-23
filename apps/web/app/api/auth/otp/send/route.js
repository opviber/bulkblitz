import { NextResponse } from "next/server";
import { otpSendSchema, parseBody } from "@/lib/validation";
import { supabaseAuthClient, allowSandbox } from "@/lib/auth";
import { rateLimit, clientId } from "@/lib/ratelimit";

export async function POST(request) {
  const rl = await rateLimit(`otp-send:${clientId(request)}`, { limit: 5, windowMs: 60_000 });
  if (!rl.success) {
    return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
  }

  const { data, error } = await parseBody(request, otpSendSchema);
  if (error) return error;

  const client = supabaseAuthClient();
  if (!client) {
    if (allowSandbox) {
      // Local/dev without Supabase: pretend OTP was sent (code logged server-side).
      console.log(`[sandbox] OTP for +91${data.phone} = 123456 (intent: ${data.intent || "buyer"})`);
      return NextResponse.json({ ok: true, sandbox: true });
    }
    return NextResponse.json({ error: "Auth provider not configured" }, { status: 503 });
  }

  const { error: sErr } = await client.auth.signInWithOtp({
    phone: `+91${data.phone}`,
  });
  if (sErr) {
    return NextResponse.json({ error: sErr.message }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
