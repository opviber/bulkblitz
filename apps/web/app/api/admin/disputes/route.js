import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, handleAuthError } from "@/lib/auth";

// GET /api/admin/disputes — moderation queue
export async function GET() {
  try {
    await requireUser(["ADMIN"]);
    const disputes = await prisma.dispute.findMany({
      include: {
        order: { include: { batch: { include: { manufacturer: true } } } },
        user: { select: { name: true, phone: true } },
      },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      take: 200,
    });
    return NextResponse.json({ disputes });
  } catch (err) {
    if (err?.status) return handleAuthError(err);
    return NextResponse.json({ error: "Failed to load disputes" }, { status: 500 });
  }
}
