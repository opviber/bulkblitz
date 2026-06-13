import { NextResponse } from "next/server";
import { prisma, getScopedUser } from "@/lib/prisma";

export async function GET(request) {
  try {
    const user = await getScopedUser(request);

    if (!user) {
      return NextResponse.json(
        { error: "No buyer profile found. Please seed the database." },
        { status: 404 }
      );
    }

    const userWithAddresses = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        addresses: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return NextResponse.json(userWithAddresses);
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

    const user = await getScopedUser(request);

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
