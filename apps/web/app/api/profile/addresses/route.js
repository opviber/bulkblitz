import { NextResponse } from "next/server";
import { prisma, getScopedUser } from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, street, city, state, pin } = body;

    if (!type || !street || !city || !state || !pin) {
      return NextResponse.json(
        { error: "Missing required fields for address" },
        { status: 400 }
      );
    }

    // Fetch default buyer user
    const user = await getScopedUser(request);

    if (!user) {
      return NextResponse.json(
        { error: "User profile not found. Please seed the database." },
        { status: 404 }
      );
    }

    const addresses = await prisma.address.findMany({
      where: { userId: user.id }
    });

    // If there are no addresses, the new address should be default
    const isDefault = addresses.length === 0;

    const newAddress = await prisma.address.create({
      data: {
        userId: user.id,
        type,
        street,
        city,
        state,
        pin,
        isDefault,
      },
    });

    return NextResponse.json(newAddress, { status: 201 });
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing address ID parameter" },
        { status: 400 }
      );
    }

    // Fetch default buyer user
    const user = await getScopedUser(request);

    if (!user) {
      return NextResponse.json(
        { error: "User profile not found." },
        { status: 404 }
      );
    }

    // Verify the address belongs to the scoped user
    const address = await prisma.address.findFirst({
      where: { id, userId: user.id }
    });

    if (!address) {
      return NextResponse.json(
        { error: "Address not found or unauthorized access." },
        { status: 404 }
      );
    }

    // Execute in a transaction: set all default to false, then target to true
    const result = await prisma.$transaction(async (tx) => {
      await tx.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });

      const updatedAddress = await tx.address.update({
        where: { id },
        data: { isDefault: true },
      });

      return updatedAddress;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error setting default address:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing address ID parameter" },
        { status: 400 }
      );
    }

    // Fetch default buyer user
    const user = await getScopedUser(request);

    if (!user) {
      return NextResponse.json(
        { error: "User profile not found." },
        { status: 404 }
      );
    }

    // Check if the address to delete is default
    const targetAddress = await prisma.address.findFirst({
      where: { id, userId: user.id }
    });
    
    if (!targetAddress) {
      return NextResponse.json(
        { error: "Address not found." },
        { status: 404 }
      );
    }

    const wasDefault = targetAddress.isDefault;

    // Delete the address
    await prisma.address.delete({
      where: { id },
    });

    // If it was default, assign default to another address if any exist
    if (wasDefault) {
      const remaining = await prisma.address.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "asc" }
      });
      if (remaining.length > 0) {
        await prisma.address.update({
          where: { id: remaining[0].id },
          data: { isDefault: true },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
