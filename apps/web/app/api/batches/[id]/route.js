import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const batch = await prisma.batch.findUnique({
      where: { id },
      include: {
        tiers: {
          orderBy: {
            minSlots: "asc",
          },
        },
        manufacturer: true,
        reservations: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            joinedAt: "desc",
          },
        },
      },
    });

    if (!batch) {
      return NextResponse.json(
        { error: "Batch listing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(batch);
  } catch (error) {
    console.error(`Error fetching batch detail ${params?.id}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
