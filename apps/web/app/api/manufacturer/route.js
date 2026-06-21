import { NextResponse } from "next/server";
import { prisma, getScopedManufacturer } from "@/lib/prisma";

export async function GET(request) {
  try {
    const manufacturer = await getScopedManufacturer(request);
    if (!manufacturer) {
      return NextResponse.json(
        { error: "No manufacturer profile found. Please seed the database first." },
        { status: 404 }
      );
    }
    return NextResponse.json(manufacturer);
  } catch (error) {
    console.error("Error fetching manufacturer profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { businessName, city, state, gstNumber, yearsInBusiness } = body;
    
    const manufacturer = await getScopedManufacturer(request);
    if (!manufacturer) {
      return NextResponse.json(
        { error: "No manufacturer profile found." },
        { status: 404 }
      );
    }

    const updated = await prisma.manufacturer.update({
      where: { id: manufacturer.id },
      data: {
        businessName: businessName || manufacturer.businessName,
        city: city || manufacturer.city,
        state: state || manufacturer.state,
        gstNumber: gstNumber || manufacturer.gstNumber,
        yearsInBusiness: yearsInBusiness !== undefined ? parseInt(yearsInBusiness) : manufacturer.yearsInBusiness,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating manufacturer profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
