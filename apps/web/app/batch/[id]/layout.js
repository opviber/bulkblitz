import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const batch = await prisma.batch.findUnique({
      where: { id },
      include: {
        tiers: {
          orderBy: {
            minSlots: "asc",
          },
        },
      },
    });

    if (!batch) {
      return {
        title: "Batch Not Found — BulkBlitz",
      };
    }

    // Calculate the current active price tier based on slots
    let currentPrice = batch.tiers[0]?.price || 0;
    for (const tier of batch.tiers) {
      if (batch.currentSlots >= tier.minSlots) {
        currentPrice = tier.price;
      }
    }

    const title = `🔥 Pool Buy: ${batch.title} for ₹${currentPrice.toLocaleString("en-IN")} — BulkBlitz`;
    const description = `Join the batch! Pool with other buyers on BulkBlitz. Current Price: ₹${currentPrice.toLocaleString("en-IN")}/unit. Target price drops further as more join. India's first dynamic group-buy marketplace.`;
    const shareImage = batch.images && batch.images[0] ? batch.images[0] : "https://bulkblitz.in/images/og-default.png";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        locale: "en_IN",
        siteName: "BulkBlitz",
        images: [
          {
            url: shareImage,
            width: 1200,
            height: 630,
            alt: batch.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [shareImage],
      },
    };
  } catch (error) {
    console.error("Error generating dynamic metadata:", error);
    return {
      title: "BulkBlitz Batch Offer",
      description: "Join batches, pool together, and unlock bulk pricing from manufacturers in real time.",
    };
  }
}

export default function BatchLayout({ children }) {
  return <>{children}</>;
}
