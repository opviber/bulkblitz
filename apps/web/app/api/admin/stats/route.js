import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, handleAuthError } from "@/lib/auth";

// GET /api/admin/stats — operator dashboard counters
export async function GET() {
  try {
    await requireUser(["ADMIN"]);
    const [pendingBatches, liveBatches, openDisputes, manufacturers, users, pendingKyc] =
      await Promise.all([
        prisma.batch.count({ where: { status: "PENDING_APPROVAL" } }),
        prisma.batch.count({ where: { status: "LIVE" } }),
        prisma.dispute.count({ where: { status: { in: ["OPEN", "UNDER_REVIEW"] } } }),
        prisma.manufacturer.count(),
        prisma.user.count(),
        prisma.manufacturerKyc.count({ where: { status: "PENDING" } }),
      ]);
    return NextResponse.json({
      pendingBatches,
      liveBatches,
      openDisputes,
      manufacturers,
      users,
      pendingKyc,
    });
  } catch (err) {
    if (err?.status) return handleAuthError(err);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
