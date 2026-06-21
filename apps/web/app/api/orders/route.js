import { NextResponse } from "next/server";
import { prisma, getScopedUser } from "@/lib/prisma";
import { sendWhatsAppNotification, sendPushNotification, sendEmailNotification } from "@/lib/notifications";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mfrId = searchParams.get("manufacturerId");

    const where = {};
    if (mfrId) {
      where.batch = { manufacturerId: mfrId };
    } else {
      const user = await getScopedUser(request);

      if (!user) {
        return NextResponse.json(
          { error: "No buyer profile found. Please seed the database." },
          { status: 404 }
        );
      }
      where.userId = user.id;
    }

    const orders = await prisma.order.findMany({
      where,
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

    // Input validation: Must be an integer, positive, and within limit
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty <= 0 || qty > 100) {
      return NextResponse.json(
        { error: "Quantity must be a positive integer (maximum 100 per transaction)" },
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

    // Start a transaction to ensure database consistency
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch batch details with pessimistic row-level lock (FOR UPDATE)
      const batches = await tx.$queryRaw`
        SELECT * FROM "Batch" WHERE id = ${batchId} FOR UPDATE
      `;
      const batch = batches[0];

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

      // Query tiers separately
      const tiers = await tx.tierSchedule.findMany({
        where: { batchId },
        orderBy: { minSlots: "asc" }
      });
      batch.tiers = tiers;

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

    // Trigger notification stubs
    try {
      const message = `🛍️ Order Confirmed! You have reserved ${result.quantity} slots for "${result.batch.title}" at ₹${result.pricePerUnit}/unit (Total: ₹${result.totalAmount}).\nAs more buyers join, the final price will drop even lower! Share with friends to save more: http://localhost:3000/batch/${result.batchId}`;
      
      await sendWhatsAppNotification(user.phone, message);
      await sendPushNotification(user.id, "Batch Joined", `Reserved ${result.quantity} units of ${result.batch.title}`);
      if (user.email) {
        await sendEmailNotification(
          user.email,
          `Order Confirmed: ${result.batch.title}`,
          `Hi ${user.name},\n\nThank you for participating! Your slot reservation has been placed successfully.\n\nProduct: ${result.batch.title}\nQuantity: ${result.quantity}\nPrice: ₹${result.pricePerUnit}/unit\nTotal Hold: ₹${result.totalAmount}\n\nWe will notify you as soon as the price drops further or when the batch completes.\n\nCheers,\nTeam BulkBlitz`
        );
      }
    } catch (notifErr) {
      console.error("Failed to trigger order confirmation notification:", notifErr);
    }

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

export async function PUT(request) {
  try {
    const body = await request.json();
    const { orderId, status, trackingNumber } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing orderId parameter" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status || order.status,
        trackingNumber: trackingNumber !== undefined ? trackingNumber : order.trackingNumber,
      },
      include: {
        batch: {
          include: {
            manufacturer: true
          }
        }
      }
    });

    // Format response to match frontend expects
    const formatted = {
      id: updated.id,
      batchId: updated.batchId,
      batchTitle: updated.batch.title,
      quantity: updated.quantity,
      pricePerUnit: updated.pricePerUnit,
      totalAmount: updated.totalAmount,
      status: updated.status,
      orderedAt: updated.orderedAt.toISOString(),
      trackingNumber: updated.trackingNumber,
      manufacturer: {
        name: updated.batch.manufacturer.businessName,
        city: updated.batch.manufacturer.city,
        state: updated.batch.manufacturer.state,
      },
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
