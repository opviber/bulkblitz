import { NextResponse } from "next/server";
import { prisma, getScopedManufacturer } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    const where = {};
    if (category && category !== "all") {
      where.category = category;
    }
    if (status) {
      where.status = status;
    } else {
      // By default, exclude draft and cancelled batches for buyers
      where.status = { in: ["LIVE", "CLOSED"] };
    }

    const batches = await prisma.batch.findMany({
      where,
      include: {
        tiers: {
          orderBy: {
            minSlots: "asc",
          },
        },
        manufacturer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(batches);
  } catch (error) {
    console.error("Error fetching batches:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      category,
      moq,
      maxSlots,
      endTime,
      tiers,
      images,
    } = body;

    // Validate inputs
    if (!title || !description || !category || !moq || !maxSlots || !endTime || !tiers || !tiers.length) {
      return NextResponse.json(
        { error: "Missing required fields or pricing tiers" },
        { status: 400 }
      );
    }

    const manufacturer = await getScopedManufacturer(request);
    if (!manufacturer) {
      return NextResponse.json(
        { error: "No manufacturer profiles found. Please seed the database first." },
        { status: 404 }
      );
    }

    // Create batch and related tiers schedule
    const batch = await prisma.batch.create({
      data: {
        manufacturerId: manufacturer.id,
        title,
        description,
        category,
        // New batches always start as PENDING_APPROVAL; admin approves → LIVE.
        // In dev/sandbox without an admin, you can manually update via prisma studio.
        status: "PENDING_APPROVAL",
        moq: parseInt(moq),
        maxSlots: parseInt(maxSlots),
        currentSlots: 0,
        endTime: new Date(endTime),
        images: Array.isArray(images) && images.length > 0 ? images : ["/placeholder-product.jpg"],
        tiers: {
          create: tiers.map((tier) => ({
            minSlots: parseInt(tier.minSlots),
            maxSlots: parseInt(tier.maxSlots),
            price: parseFloat(tier.price),
          })),
        },
      },
      include: {
        tiers: true,
      },
    });

    return NextResponse.json(batch, { status: 201 });
  } catch (error) {
    console.error("Error creating batch:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
