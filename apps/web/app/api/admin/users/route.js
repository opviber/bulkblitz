import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, handleAuthError } from "@/lib/auth";

// GET /api/admin/users?role=&q=
export async function GET(request) {
  try {
    await requireUser(["ADMIN"]);
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const q = searchParams.get("q") || "";

    const where = {};
    if (role) where.role = role;
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { phone: { contains: q } },
        { email: { contains: q, mode: "insensitive" } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true, name: true, phone: true, email: true, role: true,
        walletBalance: true, trustScore: true, createdAt: true,
        _count: { select: { orders: true, referralsMade: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return NextResponse.json({ users });
  } catch (err) {
    if (err?.status) return handleAuthError(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
