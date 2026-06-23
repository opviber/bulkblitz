import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionUser, ACCESS_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ user: null }, { status: 200 });

  // Tag the session with whether the user also has a Manufacturer profile —
  // this drives the role switcher in the header.
  const manufacturer = await prisma.manufacturer.findUnique({
    where: { userId: user.id },
    select: { id: true, slug: true, businessName: true, city: true, state: true, gstVerified: true, blacklisted: true },
  });

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      walletBalance: user.walletBalance,
      referralCode: user.referralCode,
      trustScore: user.trustScore,
      isSeller: Boolean(manufacturer),
      isAdmin: user.role === "ADMIN",
    },
    manufacturer,
  });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE);
  return NextResponse.json({ ok: true });
}
