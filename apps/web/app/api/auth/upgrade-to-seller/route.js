// =============================================================================
// POST /api/auth/upgrade-to-seller
//
// An existing BUYER opts in to become a MANUFACTURER. Creates a Manufacturer
// row + KYC shell linked to the current user, and flips role to MANUFACTURER.
// A user who already has a manufacturer record can also call this endpoint to
// idempotently refresh business info.
// =============================================================================
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, handleAuthError } from "@/lib/auth";
import { upgradeToSellerSchema, parseBody } from "@/lib/validation";
import { slugifyBusinessName } from "@/lib/utils";

export async function POST(request) {
  try {
    const user = await requireUser();
    const { data, error } = await parseBody(request, upgradeToSellerSchema);
    if (error) return error;

    const existing = await prisma.manufacturer.findUnique({ where: { userId: user.id } });

    const manufacturer = existing
      ? await prisma.manufacturer.update({
          where: { id: existing.id },
          data: {
            businessName: data.businessName.trim(),
            city: data.city.trim(),
            state: data.state.trim(),
          },
        })
      : await prisma.manufacturer.create({
          data: {
            userId: user.id,
            businessName: data.businessName.trim(),
            slug: slugifyBusinessName(data.businessName),
            city: data.city.trim(),
            state: data.state.trim(),
          },
        });

    if (!existing) {
      await prisma.manufacturerKyc
        .create({ data: { manufacturerId: manufacturer.id, status: "UNSUBMITTED" } })
        .catch(() => {});
    }

    // Flip role to MANUFACTURER. They keep buyer privileges in the UI because
    // buyer pages do not require role === "BUYER" — they only require auth.
    if (user.role !== "ADMIN" && user.role !== "MANUFACTURER") {
      await prisma.user.update({ where: { id: user.id }, data: { role: "MANUFACTURER" } });
    }

    await prisma.auditLog
      .create({
        data: {
          actorId: user.id,
          action: existing ? "manufacturer.update" : "manufacturer.create",
          entity: "Manufacturer",
          entityId: manufacturer.id,
          metadata: { source: "upgrade-to-seller" },
        },
      })
      .catch(() => {});

    return NextResponse.json({
      ok: true,
      manufacturer: { id: manufacturer.id, slug: manufacturer.slug, businessName: manufacturer.businessName },
      redirectTo: "/manufacturer",
    });
  } catch (err) {
    if (err?.status) return handleAuthError(err);
    console.error("upgrade-to-seller failed", err);
    return NextResponse.json({ error: "Failed to upgrade account" }, { status: 500 });
  }
}
