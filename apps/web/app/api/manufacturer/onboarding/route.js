import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, handleAuthError, getSessionManufacturer } from "@/lib/auth";
import { onboardingSchema, parseBody } from "@/lib/validation";

// GET /api/manufacturer/onboarding — current KYC status
export async function GET() {
  try {
    await requireUser(["MANUFACTURER", "ADMIN"]);
    const mfr = await getSessionManufacturer();
    if (!mfr) return NextResponse.json({ error: "No manufacturer profile" }, { status: 404 });
    const kyc = await prisma.manufacturerKyc.findUnique({ where: { manufacturerId: mfr.id } });
    return NextResponse.json({ manufacturer: mfr, kyc });
  } catch (err) {
    if (err?.status) return handleAuthError(err);
    return NextResponse.json({ error: "Failed to load KYC" }, { status: 500 });
  }
}

// POST /api/manufacturer/onboarding — submit GST + bank KYC for review
export async function POST(request) {
  try {
    await requireUser(["MANUFACTURER"]);
    const mfr = await getSessionManufacturer();
    if (!mfr) return NextResponse.json({ error: "No manufacturer profile" }, { status: 404 });

    const { data, error } = await parseBody(request, onboardingSchema);
    if (error) return error;

    // NOTE: real GST validation (GSTN API) and bank penny-drop happen here when
    // credentials are configured. For now we mark as PENDING for admin review.
    const kyc = await prisma.manufacturerKyc.upsert({
      where: { manufacturerId: mfr.id },
      update: {
        status: "PENDING",
        gstNumber: data.gstNumber,
        panNumber: data.panNumber || null,
        bankAccount: data.bankAccount,
        bankIfsc: data.bankIfsc,
        submittedAt: new Date(),
      },
      create: {
        manufacturerId: mfr.id,
        status: "PENDING",
        gstNumber: data.gstNumber,
        panNumber: data.panNumber || null,
        bankAccount: data.bankAccount,
        bankIfsc: data.bankIfsc,
        submittedAt: new Date(),
      },
    });
    await prisma.manufacturer.update({
      where: { id: mfr.id },
      data: { gstNumber: data.gstNumber },
    });

    return NextResponse.json({ kyc });
  } catch (err) {
    if (err?.status) return handleAuthError(err);
    return NextResponse.json({ error: "Failed to submit KYC" }, { status: 500 });
  }
}
