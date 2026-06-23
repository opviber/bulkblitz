import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, handleAuthError } from "@/lib/auth";
import { adminBatchActionSchema, parseBody } from "@/lib/validation";

// GET /api/admin/batches?status=PENDING_APPROVAL
export async function GET(request) {
  try {
    await requireUser(["ADMIN"]);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "PENDING_APPROVAL";
    const batches = await prisma.batch.findMany({
      where: { status },
      include: { manufacturer: true, tiers: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json({ batches });
  } catch (err) {
    if (err?.status) return handleAuthError(err);
    return NextResponse.json({ error: "Failed to load batches" }, { status: 500 });
  }
}

// PUT /api/admin/batches  { batchId, action }
export async function PUT(request) {
  try {
    const admin = await requireUser(["ADMIN"]);
    const { data, error } = await parseBody(request, adminBatchActionSchema);
    if (error) return error;

    const batch = await prisma.batch.findUnique({ where: { id: data.batchId } });
    if (!batch) return NextResponse.json({ error: "Batch not found" }, { status: 404 });

    let update = {};
    switch (data.action) {
      case "approve":
        update = { status: "LIVE", approvedAt: new Date() };
        break;
      case "reject":
        update = { status: "CANCELLED" };
        break;
      case "feature":
        update = { featured: true };
        break;
      case "unfeature":
        update = { featured: false };
        break;
    }

    const updated = await prisma.batch.update({ where: { id: data.batchId }, data: update });
    await prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: `batch.${data.action}`,
        entity: "batch",
        entityId: data.batchId,
      },
    });
    return NextResponse.json({ batch: updated });
  } catch (err) {
    if (err?.status) return handleAuthError(err);
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
