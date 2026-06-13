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

    const transactions = await prisma.bulkCashTransaction.findMany({
      where: { userId: user.id },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json({
      balance: user.walletBalance,
      transactions: transactions.map((tx) => ({
        id: tx.id,
        type: tx.type, // CREDIT or DEBIT
        amount: tx.type === "DEBIT" ? -Math.abs(tx.amount) : Math.abs(tx.amount),
        description: tx.description,
        date: tx.date.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Error fetching wallet data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { amount } = body;

    if (!amount) {
      return NextResponse.json(
        { error: "Missing amount parameter" },
        { status: 400 }
      );
    }

    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
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

    // Run transaction: Update user's walletBalance + create transaction ledger entry
    const result = await prisma.$transaction(async (tx) => {
      // Re-fetch user inside transaction with lock to prevent race updates on balance
      const freshUser = await tx.user.findUnique({
        where: { id: user.id }
      });
      if (!freshUser) {
        throw new Error("User profile not found");
      }

      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          walletBalance: freshUser.walletBalance + value,
        },
      });

      const txLedger = await tx.bulkCashTransaction.create({
        data: {
          userId: user.id,
          amount: value,
          type: "CREDIT",
          description: "Fund load via UPI (Sandbox)",
        },
      });

      return {
        balance: updatedUser.walletBalance,
        transaction: txLedger,
      };
    });

    return NextResponse.json({
      success: true,
      balance: result.balance,
      transaction: {
        id: result.transaction.id,
        type: result.transaction.type,
        amount: result.transaction.amount,
        description: result.transaction.description,
        date: result.transaction.date.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error adding funds to wallet:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
