import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const batch = await prisma.batch.findUnique({
      where: { id },
      include: { manufacturer: true, tiers: { orderBy: { minSlots: "asc" } } },
    });
    if (!batch) return { title: "Batch not found — BulkBlitz" };
    const minPrice = batch.tiers.length ? Math.min(...batch.tiers.map((t) => t.price)) : null;
    const maxPrice = batch.tiers.length ? batch.tiers[0].price : null;
    const desc = `Join ${batch.manufacturer?.businessName}'s batch. Price drops from ₹${maxPrice} to ₹${minPrice}/unit as more buyers join.`;
    return {
      title: `${batch.title} — BulkBlitz`,
      description: desc,
      openGraph: {
        title: `${batch.title} — BulkBlitz`,
        description: desc,
        images: batch.images?.[0] ? [{ url: batch.images[0] }] : [],
      },
      twitter: { card: "summary_large_image", title: `${batch.title} — BulkBlitz`, description: desc },
    };
  } catch {
    return { title: "BulkBlitz" };
  }
}

export { default } from "./page";
