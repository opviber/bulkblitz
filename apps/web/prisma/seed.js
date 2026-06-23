const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Clean existing records (in reverse dependency order)
  await prisma.review.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.slotReservation.deleteMany({});
  await prisma.tierSchedule.deleteMany({});
  await prisma.batch.deleteMany({});
  await prisma.manufacturer.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.bulkCashTransaction.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("🧹 Cleared existing database records.");

  // 2. Create Users (Buyers and Manufacturers)
  const userBuyer = await prisma.user.create({
    data: {
      phone: "+91 9876543210",
      email: "ashish@sharma.in",
      name: "Ashish Sharma",
      role: "BUYER",
      walletBalance: 2475.0,
      trustScore: 98,
      addresses: {
        create: [
          {
            type: "Home",
            street: "Flat 402, Block A, Green Meadows",
            city: "Nagpur",
            state: "Maharashtra",
            pin: "440015",
            isDefault: true,
          },
        ],
      },
    },
  });

  const userMfr = await prisma.user.create({
    data: {
      phone: "+91 9999988888",
      email: "sharma.ind@gmail.com",
      name: "Sharma Industries",
      role: "MANUFACTURER",
    },
  });

  // Create Manufacturer Profile
  const manufacturer = await prisma.manufacturer.create({
    data: {
      userId: userMfr.id,
      businessName: "Sharma Industries",
      slug: "sharma-industries",
      city: "Nagpur",
      state: "Maharashtra",
      gstNumber: "27AAAAA1111A1Z1",
      gstVerified: true,
      rating: 4.8,
      yearsInBusiness: 12,
    },
  });

  console.log("👤 Users & Manufacturer profiles established.");

  // 3. Create Batches with Tiers
  // Batch 1: FMCG Chana Dal
  await prisma.batch.create({
    data: {
      id: "batch-001",
      manufacturerId: manufacturer.id,
      title: "Organic Chana Dal (Premium, 1kg)",
      description: "100% certified organic unpolished Chana Dal. High in fiber and protein, sourced from organic farms in Nagpur, Maharashtra.",
      category: "fmcg",
      status: "LIVE",
      moq: 10,
      maxSlots: 150,
      currentSlots: 45,
      images: ["/placeholder-product.jpg"],
      endTime: new Date(Date.now() + 3 * 24 * 3600 * 1000), // 3 days from now
      tiers: {
        create: [
          { minSlots: 1, maxSlots: 20, price: 75 },
          { minSlots: 21, maxSlots: 50, price: 68 },
          { minSlots: 51, maxSlots: 100, price: 62 },
          { minSlots: 101, maxSlots: 150, price: 55 },
        ],
      },
    },
  });

  // Batch 2: Electronics USB-C Cables
  await prisma.batch.create({
    data: {
      id: "batch-002",
      manufacturerId: manufacturer.id,
      title: "Braided USB-C Fast Charging Cable (1.5m)",
      description: "Heavy-duty nylon braided USB-C cable supporting 65W Power Delivery. Reinforced strain relief connectors, 10,000+ bend lifespan.",
      category: "electronics",
      status: "LIVE",
      moq: 15,
      maxSlots: 200,
      currentSlots: 85,
      images: ["/placeholder-product.jpg"],
      endTime: new Date(Date.now() + 5 * 24 * 3600 * 1000), // 5 days from now
      tiers: {
        create: [
          { minSlots: 1, maxSlots: 50, price: 199 },
          { minSlots: 51, maxSlots: 100, price: 175 },
          { minSlots: 101, maxSlots: 150, price: 150 },
          { minSlots: 151, maxSlots: 200, price: 129 },
        ],
      },
    },
  });

  // Batch 3: Personal Care Handmade Soap
  await prisma.batch.create({
    data: {
      id: "batch-003",
      manufacturerId: manufacturer.id,
      title: "Handmade Organic Neem & Aloe Vera Soap (Pack of 3)",
      description: "100% natural, cold-pressed soaps with organic neem oil and fresh aloe vera gel. Free from parabens, sulfates, and artificial fragrances.",
      category: "personal-care",
      status: "LIVE",
      moq: 5,
      maxSlots: 100,
      currentSlots: 12,
      images: ["/placeholder-product.jpg"],
      endTime: new Date(Date.now() + 2 * 24 * 3600 * 1000), // 2 days from now
      tiers: {
        create: [
          { minSlots: 1, maxSlots: 25, price: 299 },
          { minSlots: 26, maxSlots: 50, price: 265 },
          { minSlots: 51, maxSlots: 75, price: 235 },
          { minSlots: 76, maxSlots: 100, price: 199 },
        ],
      },
    },
  });

  // 4. Create Mock Wallet Transactions
  await prisma.bulkCashTransaction.createMany({
    data: [
      {
        userId: userBuyer.id,
        amount: 50.0,
        type: "CREDIT",
        description: "Welcome Referral Bonus",
      },
      {
        userId: userBuyer.id,
        amount: 2425.0,
        type: "CREDIT",
        description: "Added funds via UPI",
      },
    ],
  });

  console.log("📦 Batches, price tiers, and transactions created.");
  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
