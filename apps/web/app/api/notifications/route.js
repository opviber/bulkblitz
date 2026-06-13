import { NextResponse } from "next/server";
import { sendWhatsAppNotification, sendPushNotification, sendEmailNotification } from "@/lib/notifications";

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, recipient, title, message, subject } = body;

    let result = null;

    if (type === "whatsapp") {
      result = await sendWhatsAppNotification(
        recipient || "+919999999999",
        message || "⚡ Price Drop Alert! The Organic Chana Dal batch just hit the ₹55/kg tier (25% savings). Invite friends to drop it to ₹48!"
      );
    } else if (type === "push") {
      result = await sendPushNotification(
        recipient || "user-buyer-123",
        title || "Price Drop Celebration! 🎉",
        message || "Organic Chana Dal batch price just dropped to ₹55/kg!"
      );
    } else if (type === "email") {
      result = await sendEmailNotification(
        recipient || "buyer@bulkblitz.in",
        subject || "Batch Price Drop Alert: Organic Chana Dal",
        message || "Hi Ashish,\n\nExciting news! A batch you are participating in has just dropped in price.\n\nProduct: Organic Chana Dal\nNew Price Tier Reached: ₹55/kg\n\nInvite others to join and help push the price to the final ₹48/kg tier!\n\nCheers,\nTeam BulkBlitz"
      );
    } else {
      // Send a sequence of all 3 notifications representing a price drop event
      const whatsapp = await sendWhatsAppNotification(
        "+919999999999",
        "⚡ Price Drop Alert! The Organic Chana Dal batch just hit the ₹55/kg tier (25% savings). Invite friends to drop it to ₹48!"
      );
      const push = await sendPushNotification(
        "buyer-id-ashish",
        "Price Drop Celebration! 🎉",
        "Organic Chana Dal batch price just dropped to ₹55/kg!"
      );
      const email = await sendEmailNotification(
        "ashish@bulkblitz.in",
        "Batch Price Drop Alert: Organic Chana Dal",
        "Hi Ashish,\n\nExciting news! A batch you are participating in has just dropped in price.\n\nProduct: Organic Chana Dal\nNew Price Tier Reached: ₹55/kg\n\nInvite others to join and help push the price to the final ₹48/kg tier!\n\nCheers,\nTeam BulkBlitz"
      );
      
      return NextResponse.json({
        success: true,
        message: "Triggered standard price drop notification sequence successfully.",
        deliveries: { whatsapp, push, email }
      });
    }

    return NextResponse.json({
      success: true,
      message: `Triggered ${type} notification successfully.`,
      delivery: result
    });
  } catch (error) {
    console.error("Error triggering notifications test:", error);
    return NextResponse.json(
      { error: "Internal Server Error triggering notifications" },
      { status: 500 }
    );
  }
}
