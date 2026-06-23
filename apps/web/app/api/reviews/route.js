import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, handleAuthError } from "@/lib/auth";
import { reviewSchema, parseBody } from "@/lib/validation";

// GET /api/reviews?manufacturerId=
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const manufacturerId = searchParams.get("manufacturerId");
  if (!manufacturerId) {
    return NextResponse.json({ error: "manufacturerId required" }, { status: 400 });
  }
  const reviews = await prisma.review.findMany({
    where: { manufacturerId },
    include: { user: { select: { name: true } } },
    orderBy: { date: "desc" },
    take: 50,
  });
  return NextResponse.json({ reviews });
}

// POST /api/reviews  — only for delivered orders, one review per order
export async function POST(request) {
  try {
    const user = await requireUser();
    const { data, error } = await parseBody(request, reviewSchema);
    if (error) return error;

    if (data.orderId) {
      const order = await prisma.order.findFirst({
        where: { id: data.orderId, userId: user.id, status: "DELIVERED" },
      });
      if (!order) {
        return NextResponse.json(
          { error: "You can only review delivered orders" },
          { status: 403 }
        );
      }
    }

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        manufacturerId: data.manufacturerId,
        orderId: data.orderId || null,
        rating: data.rating,
        comment: data.comment || null,
      },
    });

    // Recompute manufacturer rating.
    const agg = await prisma.review.aggregate({
      where: { manufacturerId: data.manufacturerId },
      _avg: { rating: true },
    });
    await prisma.manufacturer.update({
      where: { id: data.manufacturerId },
      data: { rating: agg._avg.rating || 5 },
    });

    return NextResponse.json({ review });
  } catch (err) {
    if (err?.status) return handleAuthError(err);
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "You already reviewed this order" }, { status: 409 });
    }
    console.error("review error:", err);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
