import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { otpVerifySchema, parseBody } from "@/lib/validation";
import { supabaseAuthClient, allowSandbox, ACCESS_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function genReferralCode() {
  return "BB" + crypto.randomBytes(3).toString("hex").toUpperCase();
}

/** Find-or-create the Prisma user, applying referral attribution once. */
async function upsertUser({ phone, email, name, referralCode }) {
  let user = await prisma.user.findUnique({ where: { phone } });
  if (user) return user;

  // New user — resolve referrer (if a valid code was supplied).
  let referredById = null;
  if (referralCode) {
    const referrer = await prisma.user.findUnique({ where: { referralCode } });
    if (referrer) referredById = referrer.id;
  }

  user = await prisma.user.create({
    data: {
      phone,
      email: email || null,
      name: name || `User ${phone.slice(-4)}`,
      referralCode: genReferralCode(),
      referredById,
    },
  });

  // Record the referral row (reward credited later when they transact).
  if (referredById) {
    await prisma.referral.create({
      data: { referrerId: referredById, referredId: user.id, rewardAmount: 10 },
    }).catch(() => {});
  }
  return user;
}

export async function POST(request) {
  const { data, error } = await parseBody(request, otpVerifySchema);
  if (error) return error;

  const client = supabaseAuthClient();
  const cookieStore = await cookies();

  // --- Sandbox / dev path (no Supabase) ---
  if (!client) {
    if (!allowSandbox) {
      return NextResponse.json({ error: "Auth provider not configured" }, { status: 503 });
    }
    if (data.token !== "123456") {
      return NextResponse.json({ error: "Invalid code" }, { status: 401 });
    }
    const user = await upsertUser({
      phone: data.phone,
      name: data.name,
      referralCode: data.referralCode,
    });
    // Dev session marker (not a real JWT). middleware only enforces in prod.
    cookieStore.set(ACCESS_COOKIE, `sandbox.${user.id}`, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, role: user.role }, sandbox: true });
  }

  // --- Real Supabase verification ---
  const { data: vData, error: vErr } = await client.auth.verifyOtp({
    phone: `+91${data.phone}`,
    token: data.token,
    type: "sms",
  });
  if (vErr || !vData?.session) {
    return NextResponse.json({ error: vErr?.message || "Invalid code" }, { status: 401 });
  }

  const user = await upsertUser({
    phone: data.phone,
    email: vData.user?.email,
    name: data.name,
    referralCode: data.referralCode,
  });

  const { access_token, expires_in } = vData.session;
  cookieStore.set(ACCESS_COOKIE, access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: expires_in || 3600,
  });

  return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, role: user.role } });
}
