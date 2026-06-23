import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { otpVerifySchema, parseBody } from "@/lib/validation";
import { supabaseAuthClient, allowSandbox, ACCESS_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugifyBusinessName } from "@/lib/utils";

function genReferralCode() {
  return "BB" + crypto.randomBytes(3).toString(/* encoding */ "hex").toUpperCase();
}

/**
 * Find-or-create the Prisma user, applying referral attribution once.
 * If `intent === "seller"` on first sign-up, also creates a Manufacturer shell
 * and sets role = MANUFACTURER. Existing accounts are never silently escalated.
 *
 * Returns { user, manufacturer, isNew, becameSeller }
 */
async function upsertUser({ phone, email, name, referralCode, intent, businessName, city, state }) {
  const existing = await prisma.user.findUnique({
    where: { phone },
    include: { /* role is on user */ },
  });

  if (existing) {
    // Existing accounts keep their role. Upgrade happens via /api/auth/upgrade-to-seller.
    const mfr = await prisma.manufacturer.findUnique({ where: { userId: existing.id } });
    return { user: existing, manufacturer: mfr, isNew: false, becameSeller: false };
  }

  // New user
  let referredById = null;
  if (referralCode) {
    const referrer = await prisma.user.findUnique({ where: { referralCode } });
    if (referrer) referredById = referrer.id;
  }

  const wantsSeller = intent === "seller" && businessName && city && state;

  const user = await prisma.user.create({
    data: {
      phone,
      email: email || null,
      name: name || (wantsSeller ? businessName.slice(0, 60) : `User ${phone.slice(-4)}`),
      role: wantsSeller ? "MANUFACTURER" : "BUYER",
      referralCode: genReferralCode(),
      referredById,
    },
  });

  let manufacturer = null;
  if (wantsSeller) {
    manufacturer = await prisma.manufacturer.create({
      data: {
        userId: user.id,
        businessName: businessName.trim(),
        slug: slugifyBusinessName(businessName),
        city: city.trim(),
        state: state.trim(),
      },
    });
    // KYC shell (UNSUBMITTED) so the dashboard can prompt them to verify.
    await prisma.manufacturerKyc
      .create({ data: { manufacturerId: manufacturer.id, status: "UNSUBMITTED" } })
      .catch(() => {});
  }

  if (referredById) {
    await prisma.referral
      .create({ data: { referrerId: referredById, referredId: user.id, rewardAmount: 10 } })
      .catch(() => {});
  }

  return { user, manufacturer, isNew: true, becameSeller: wantsSeller };
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
    const result = await upsertUser({
      phone: data.phone,
      name: data.name,
      referralCode: data.referralCode,
      intent: data.intent,
      businessName: data.businessName,
      city: data.city,
      state: data.state,
    });
    cookieStore.set(ACCESS_COOKIE, `sandbox.${result.user.id}`, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return NextResponse.json({
      ok: true,
      user: { id: result.user.id, name: result.user.name, role: result.user.role },
      manufacturer: result.manufacturer ? { id: result.manufacturer.id, slug: result.manufacturer.slug } : null,
      isNew: result.isNew,
      becameSeller: result.becameSeller,
      redirectTo: result.user.role === "MANUFACTURER" ? "/manufacturer" : "/",
      sandbox: true,
    });
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

  const result = await upsertUser({
    phone: data.phone,
    email: vData.user?.email,
    name: data.name,
    referralCode: data.referralCode,
    intent: data.intent,
    businessName: data.businessName,
    city: data.city,
    state: data.state,
  });

  const { access_token, expires_in } = vData.session;
  cookieStore.set(ACCESS_COOKIE, access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: expires_in || 3600,
  });

  return NextResponse.json({
    ok: true,
    user: { id: result.user.id, name: result.user.name, role: result.user.role },
    manufacturer: result.manufacturer ? { id: result.manufacturer.id, slug: result.manufacturer.slug } : null,
    isNew: result.isNew,
    becameSeller: result.becameSeller,
    redirectTo: result.user.role === "MANUFACTURER" ? "/manufacturer" : "/",
  });
}
