import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, handleAuthError } from "@/lib/auth";
import { adminManufacturerActionSchema, parseBody } from "@/lib/validation";

// GET /api/admin/manufacturers
export async function GET() {
  try {
    await requireUser(["ADMIN"]);
    const manufacturers = await prisma.manufacturer.findMany({
      include: { kyc: true, user: { select: { name: true, phone: true } }, _count: { select: { batches: true } } },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return NextResponse.json({ manufacturers });
  } catch (err) {
    if (err?.status) return handleAuthError(err);
    return NextResponse.json({ error: "Failed to load manufacturers" }, { status: 500 });
  }
}

// PUT /api/admin/manufacturers  { manufacturerId, action, note }
export async function PUT(request) {
  try {
    const admin = await requireUser(["ADMIN"]);
    const { data, error } = await parseBody(request, adminManufacturerActionSchema);
    if (error) return error;

    const mfr = await prisma.manufacturer.findUnique({ where: { id: data.manufacturerId } });
    if (!mfr) return NextResponse.json({ error: "Manufacturer not found" }, { status: 404 });

    switch (data.action) {
      case "verify":
        await prisma.manufacturer.update({ where: { id: mfr.id }, data: { gstVerified: true } });
        break;
      case "unverify":
        await prisma.manufacturer.update({ where: { id: mfr.id }, data: { gstVerified: false } });
        break;
      case "blacklist":
        await prisma.manufacturer.update({ where: { id: mfr.id }, data: { blacklisted: true } });
        break;
      case "unblacklist":
        await prisma.manufacturer.update({ where: { id: mfr.id }, data: { blacklisted: false } });
        break;
      case "kyc_verify":
        await prisma.manufacturerKyc.updateMany({
          where: { manufacturerId: mfr.id },
          data: { status: "VERIFIED", reviewedAt: new Date(), reviewNote: data.note || null },
        });
        await prisma.manufacturer.update({ where: { id: mfr.id }, data: { gstVerified: true } });
        break;
      case "kyc_reject":
        await prisma.manufacturerKyc.updateMany({
          where: { manufacturerId: mfr.id },
          data: { status: "REJECTED", reviewedAt: new Date(), reviewNote: data.note || null },
        });
        break;
    }

    await prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: `manufacturer.${data.action}`,
        entity: "manufacturer",
        entityId: mfr.id,
        metadata: data.note ? { note: data.note } : undefined,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err?.status) return handleAuthError(err);
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
