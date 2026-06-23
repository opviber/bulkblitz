import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dispatchNotification } from "@/lib/notifications";

// GET /api/cron/drop-alerts
// Fires for every active Wishlist entry whose batch has crossed a new tier since
// the user was last notified (tracked via AuditLog so we need no schema change).
// Cron schedule: every 5 minutes (see vercel.json).
export async function GET(request) {
  if (process.env.NODE_ENV === "production") {
    const secret = process.env.CRON_SECRET;
    if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Fetch all wishlist entries for LIVE batches, with tiers
  const wishlists = await prisma.wishlist.findMany({
    where: { batch: { status: "LIVE" } },
    include: {
      batch: { include: { tiers: true } },
    },
    take: 500,
  });

  let alerted = 0;
  for (const w of wishlists) {
    const b = w.batch;
    const sortedTiers = [...b.tiers].sort((a, b) => a.minSlots - b.minSlots);
    // Active tier: highest tier whose minSlots <= currentSlots
    const activeTier =
      sortedTiers.reduce((best, t) => (b.currentSlots >= t.minSlots ? t : best), sortedTiers[0]);
    if (!activeTier) continue;

    // Check if we already sent an alert for this tier
    const dedupeKey = `drop-alert:${w.userId}:${b.id}:${activeTier.minSlots}`;
    const already = await prisma.auditLog.findFirst({
      where: { entity: "drop_alert", entityId: dedupeKey },
    });
    if (already) continue;

    // Compute slotsToNext for the message
    const nextTier = sortedTiers.find((t) => t.minSlots > b.currentSlots);
    const slotsToNext = nextTier ? nextTier.minSlots - b.currentSlots : 0;
    const msg = nextTier
      ? `Price is ₹${activeTier.price}/unit now. ${slotsToNext} more buyers drops it to ₹${nextTier.price}!`
      : `It's at the best price: ₹${activeTier.price}/unit. Don't miss out!`;

    await dispatchNotification(w.userId, {
      channel: "PUSH",
      title: `📉 ${b.title} dropped!`,
      body: msg,
      link: `/batch/${b.id}`,
    });
    await prisma.auditLog.create({
      data: { action: "drop_alert_sent", entity: "drop_alert", entityId: dedupeKey },
    });
    alerted++;
  }

  return NextResponse.json({ checked: wishlists.length, alerted });
}
