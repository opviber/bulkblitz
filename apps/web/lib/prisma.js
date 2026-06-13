import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function getScopedUser(request) {
  if (!request) return null;
  const headerUserId = request.headers.get("x-user-id");
  if (headerUserId) {
    const user = await prisma.user.findUnique({
      where: { id: headerUserId },
    });
    if (user) return user;
  }
  return await prisma.user.findFirst({
    where: { role: "BUYER" },
  });
}

export async function getScopedManufacturer(request) {
  if (!request) return null;
  const headerUserId = request.headers.get("x-user-id");
  if (headerUserId) {
    const manufacturer = await prisma.manufacturer.findFirst({
      where: { userId: headerUserId },
    });
    if (manufacturer) return manufacturer;
  }
  return await prisma.manufacturer.findFirst();
}
