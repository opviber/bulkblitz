import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, handleAuthError } from "@/lib/auth";

// GET /api/referrals — current user's referral code + stats
export async function GET() {
  try {
    const user = await requireUser();
    const referrals = await prisma.referral.findMany({
      where: { referrerId: user.id },
      include: { referred: { select: { name: true, createdAt: true } } },
      orderBy: { createdAt: "desc" },
    });
    const earned = referrals
      .filter((r) => r.rewarded)
      .reduce((sum, r) => sum + r.rewardAmount, 0);

    return NextResponse.json({
      referralCode: user.referralCode,
      shareUrl: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/auth?ref=${user.referralCode}`,
      totalReferred: referrals.length,
      earned,
      referrals,
    });
  } catch (err) {
    if (err?.status) return handleAuthError(err);
    return NextResponse.json({ error: "Failed to load referrals" }, { status: 500 });
  }
}
