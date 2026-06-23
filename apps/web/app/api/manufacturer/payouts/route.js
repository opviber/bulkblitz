import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, handleAuthError, getSessionManufacturer } from "@/lib/auth";

// GET /api/manufacturer/payouts — current manufacturer's payout history
export async function GET() {
  try {
    await requireUser(["MANUFACTURER", "ADMIN"]);
    const mfr = await getSessionManufacturer();
    if (!mfr) return NextResponse.json({ error: "No manufacturer profile" }, { status: 404 });

    const payouts = await prisma.payout.findMany({
      where: { manufacturerId: mfr.id },
      orderBy: { createdAt: "desc" },
    });
    const pending = payouts
      .filter((p) => p.status === "PENDING")
      .reduce((s, p) => s + p.amount, 0);
    const paid = payouts.filter((p) => p.status === "PAID").reduce((s, p) => s + p.amount, 0);

    return NextResponse.json({ payouts, summary: { pending, paid } });
  } catch (err) {
    if (err?.status) return handleAuthError(err);
    return NextResponse.json({ error: "Failed to load payouts" }, { status: 500 });
  }
}
