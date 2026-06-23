import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionUser, ACCESS_COOKIE } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ user: null }, { status: 200 });
  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      walletBalance: user.walletBalance,
      referralCode: user.referralCode,
    },
  });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE);
  return NextResponse.json({ ok: true });
}
