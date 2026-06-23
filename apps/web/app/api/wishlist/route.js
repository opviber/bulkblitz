import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, handleAuthError } from "@/lib/auth";
import { wishlistSchema, parseBody } from "@/lib/validation";

// GET /api/wishlist — current user's watched batches
export async function GET() {
  try {
    const user = await requireUser();
    const items = await prisma.wishlist.findMany({
      where: { userId: user.id },
      include: { batch: { include: { tiers: true, manufacturer: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ items });
  } catch (err) {
    if (err?.status) return handleAuthError(err);
    return NextResponse.json({ error: "Failed to load wishlist" }, { status: 500 });
  }
}

// POST /api/wishlist  { batchId } — toggle watch
export async function POST(request) {
  try {
    const user = await requireUser();
    const { data, error } = await parseBody(request, wishlistSchema);
    if (error) return error;

    const existing = await prisma.wishlist.findUnique({
      where: { userId_batchId: { userId: user.id, batchId: data.batchId } },
    });
    if (existing) {
      await prisma.wishlist.delete({ where: { id: existing.id } });
      return NextResponse.json({ watching: false });
    }
    await prisma.wishlist.create({ data: { userId: user.id, batchId: data.batchId } });
    return NextResponse.json({ watching: true });
  } catch (err) {
    if (err?.status) return handleAuthError(err);
    return NextResponse.json({ error: "Failed to update wishlist" }, { status: 500 });
  }
}
