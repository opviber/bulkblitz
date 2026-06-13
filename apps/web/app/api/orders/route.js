import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Default to the first buyer user (Ashish Sharma) for MVP simplicity
    const user = await prisma.user.findFirst({
      where: { role: "BUYER" },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No buyer profile found. Please seed the database." },
        { status: 404 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        batch: {
          include: {
            manufacturer: true,
          },
        },
      },
      orderBy: {
        orderedAt: "desc",
      },
    });

    // Format the response to match frontend expects
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      batchId: order.batchId,
      batchTitle: order.batch.title,
      quantity: order.quantity,
      pricePerUnit: order.pricePerUnit,
      totalAmount: order.totalAmount,
      status: order.status,
      orderedAt: order.orderedAt.toISOString(),
      trackingNumber: order.trackingNumber,
      manufacturer: {
        name: order.batch.manufacturer.businessName,
        city: order.batch.manufacturer.city,
        state: order.batch.manufacturer.state,
      },
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { batchId, quantity } = body;

    if (!batchId || !quantity) {
      return NextResponse.json(
        { error: "Missing batchId or quantity parameters" },
        { status: 400 }
      );
    }

    const qty = parseInt(quantity);
    if (qty <= 0) {
      return NextResponse.json(
        { error: "Quantity must be greater than zero" },
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

    // Start a transaction to ensure database consistency
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch batch details with lock
      const batch = await tx.batch.findUnique({
        where: { id: batchId },
        include: {
          tiers: {
            orderBy: {
              minSlots: "asc",
            },
          },
        },
      });

      if (!batch) {
        throw new Error("Batch listing not found");
      }

      if (batch.status !== "LIVE") {
        throw new Error("This batch is not currently accepting new reservations");
      }

      const newSlotsCount = batch.currentSlots + qty;
      if (newSlotsCount > batch.maxSlots) {
        throw new Error(`Insufficient slots remaining. Only ${batch.maxSlots - batch.currentSlots} slots left.`);
      }

      // 2. Create the slot reservation
      const reservation = await tx.slotReservation.create({
        data: {
          batchId,
          userId: user.id,
          quantity: qty,
          status: "CONFIRMED",
          paymentHoldId: `pay_hold_${Math.random().toString(36).substring(7)}`,
        },
      });

      // 3. Update the batch occupancy count
      await tx.batch.update({
        where: { id: batchId },
        data: {
          currentSlots: newSlotsCount,
        },
      });

      // 4. Calculate pricing: check which tier has been unlocked
      let currentPrice = batch.tiers[0]?.price || 0;
      for (const tier of batch.tiers) {
        if (newSlotsCount >= tier.minSlots) {
          currentPrice = tier.price;
        }
      }
      
      const totalAmount = qty * currentPrice;

      // 5. Escrow check: Verify user has sufficient wallet balance
      const currentUser = await tx.user.findUnique({
        where: { id: user.id },
      });

      if (!currentUser) {
        throw new Error("User profile not found");
      }

      if (currentUser.walletBalance < totalAmount) {
        throw new Error(`Insufficient wallet balance. Total amount: ₹${totalAmount.toFixed(2)}, available balance: ₹${currentUser.walletBalance.toFixed(2)}. Please load money to your wallet first.`);
      }

      // 6. Deduct from wallet and record transaction ledger
      await tx.user.update({
        where: { id: user.id },
        data: {
          walletBalance: {
            decrement: totalAmount,
          },
        },
      });

      await tx.bulkCashTransaction.create({
        data: {
          userId: user.id,
          amount: totalAmount,
          type: "DEBIT",
          description: `Escrow hold for ${qty} units of "${batch.title}"`,
        },
      });

      // 7. Create an order reference
      const order = await tx.order.create({
        data: {
          batchId,
          userId: user.id,
          quantity: qty,
          pricePerUnit: currentPrice,
          totalAmount: totalAmount,
          status: "CONFIRMED",
          trackingNumber: `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
        },
        include: {
          batch: {
            include: {
              manufacturer: true,
            },
          },
        },
      });

      return order;
    });

    // Format response to match front-end
    const formattedOrder = {
      id: result.id,
      batchId: result.batchId,
      batchTitle: result.batch.title,
      quantity: result.quantity,
      pricePerUnit: result.pricePerUnit,
      totalAmount: result.totalAmount,
      status: result.status,
      orderedAt: result.orderedAt.toISOString(),
      trackingNumber: result.trackingNumber,
      manufacturer: {
        name: result.batch.manufacturer.businessName,
        city: result.batch.manufacturer.city,
        state: result.batch.manufacturer.state,
      },
    };

    return NextResponse.json(formattedOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating reservation order:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
