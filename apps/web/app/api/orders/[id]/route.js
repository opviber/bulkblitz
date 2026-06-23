import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, handleAuthError, getSessionManufacturer } from "@/lib/auth";
import { trackingSchema, parseBody } from "@/lib/validation";
import { dispatchNotification } from "@/lib/notifications";

// GET /api/orders/:id — buyer (owner) or manufacturer (of the batch) or admin
export async function GET(request, { params }) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        batch: { include: { manufacturer: true } },
        dispute: true,
        user: { select: { name: true, phone: true } },
      },
    });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const isOwner = order.userId === user.id;
    const isAdmin = user.role === "ADMIN";
    const mfr = await getSessionManufacturer();
    const isMfr = mfr && order.batch.manufacturerId === mfr.id;
    if (!isOwner && !isAdmin && !isMfr) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (err) {
    if (err?.status) return handleAuthError(err);
    return NextResponse.json({ error: "Failed to load order" }, { status: 500 });
  }
}

// PUT /api/orders/:id — manufacturer/admin updates shipping tracking
export async function PUT(request, { params }) {
  try {
    const user = await requireUser(["MANUFACTURER", "ADMIN"]);
    const { id } = await params;
    const { data, error } = await parseBody(request, trackingSchema);
    if (error) return error;

    const order = await prisma.order.findUnique({ where: { id }, include: { batch: true } });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    if (user.role !== "ADMIN") {
      const mfr = await getSessionManufacturer();
      if (!mfr || order.batch.manufacturerId !== mfr.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { trackingNumber: data.trackingNumber, carrier: data.carrier, status: "SHIPPED" },
    });
    await dispatchNotification(order.userId, {
      channel: "WHATSAPP",
      title: "Your order has shipped",
      body: `${data.carrier} • AWB ${data.trackingNumber}`,
      link: `/orders/${id}`,
    });
    return NextResponse.json({ order: updated });
  } catch (err) {
    if (err?.status) return handleAuthError(err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
