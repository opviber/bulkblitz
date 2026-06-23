import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAuthClient, ACCESS_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function genReferralCode() {
  return "BB" + crypto.randomBytes(3).toString("hex").toUpperCase();
}

// POST /api/auth/callback  { accessToken, expiresIn }
// Sets the session cookie from a Supabase OAuth access token and ensures a
// matching Prisma user exists.
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const accessToken = body?.accessToken;
  if (!accessToken) {
    return NextResponse.json({ error: "Missing access token" }, { status: 400 });
  }

  const client = supabaseAuthClient();
  if (!client) {
    return NextResponse.json({ error: "Auth provider not configured" }, { status: 503 });
  }

  const { data, error } = await client.auth.getUser(accessToken);
  if (error || !data?.user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const su = data.user;
  const phone = (su.phone || "").replace(/^91/, "");
  const email = su.email || null;

  let user = await prisma.user.findFirst({
    where: { OR: [phone ? { phone } : undefined, email ? { email } : undefined].filter(Boolean) },
  });
  if (!user) {
    user = await prisma.user.create({
      data: {
        phone: phone || `g_${su.id.slice(0, 10)}`,
        email,
        name: su.user_metadata?.full_name || su.user_metadata?.name || email?.split("@")[0] || "User",
        referralCode: genReferralCode(),
      },
    });
  }

  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: Number(body?.expiresIn) || 3600,
  });

  return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, role: user.role } });
}
