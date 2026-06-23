import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, handleAuthError } from "@/lib/auth";
import { disputeSchema, parseBody } from "@/lib/validation";

// GET /api/disputes — current user's disputes
export async function GET() {
  try {
    const user = await requireUser();
    const disputes = await prisma.dispute.findMany({
      where: { userId: user.id },
      include: { order: { include: { batch: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ disputes });
  } catch (err) {
    if (err?.status) return handleAuthError(err);
    return NextResponse.json({ error: "Failed to load disputes" }, { status: 500 });
  }
}

// POST /api/disputes — raise a "not as described" claim (within 7 days of delivery)
export async function POST(request) {
  try {
    const user = await requireUser();
    const { data, error } = await parseBody(request, disputeSchema);
    if (error) return error;

    const order = await prisma.order.findFirst({
      where: { id: data.orderId, userId: user.id },
    });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    if (order.status === "DELIVERED" && Date.now() - new Date(order.updatedAt).getTime() > sevenDays) {
      return NextResponse.json(
        { error: "Dispute window (7 days) has passed" },
        { status: 409 }
      );
    }

    const dispute = await prisma.dispute.create({
      data: {
        orderId: data.orderId,
        userId: user.id,
        reason: data.reason,
        description: data.description || null,
        evidence: data.evidence || [],
      },
    });
    return NextResponse.json({ dispute });
  } catch (err) {
    if (err?.status) return handleAuthError(err);
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "A dispute already exists for this order" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to raise dispute" }, { status: 500 });
  }
}
