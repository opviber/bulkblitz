import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Default to the first buyer user (Ashish Sharma) for MVP simplicity
    const user = await prisma.user.findFirst({
      where: { role: "BUYER" },
      include: {
        addresses: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No buyer profile found. Please seed the database." },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name parameter is required" },
        { status: 400 }
      );
    }

    // Default to first buyer user (Ashish Sharma)
    const user = await prisma.user.findFirst({
      where: { role: "BUYER" },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User profile not found. Please seed the database." },
        { status: 404 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        email,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
