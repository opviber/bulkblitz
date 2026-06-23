import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/manufacturers/:slug — public profile (verified badge, ratings, batches)
export async function GET(request, { params }) {
  const { slug } = await params;
  const manufacturer = await prisma.manufacturer.findUnique({
    where: { slug },
    include: {
      batches: {
        where: { status: { in: ["LIVE", "CLOSED"] } },
        include: { tiers: true },
        orderBy: { createdAt: "desc" },
        take: 24,
      },
    },
  });
  if (!manufacturer || manufacturer.blacklisted) {
    return NextResponse.json({ error: "Manufacturer not found" }, { status: 404 });
  }

  const reviews = await prisma.review.findMany({
    where: { manufacturerId: manufacturer.id },
    include: { user: { select: { name: true } } },
    orderBy: { date: "desc" },
    take: 20,
  });

  const { gstNumber, ...publicFields } = manufacturer;
  return NextResponse.json({ manufacturer: { ...publicFields, gstVerified: manufacturer.gstVerified }, reviews });
}
