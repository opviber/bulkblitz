import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// -----------------------------------------------------------------------------
// Backwards-compatible scoping helpers.
//
// These now delegate to the verified session (lib/auth.js) instead of trusting
// a spoofable `x-user-id` header. The `request` argument is kept for call-site
// compatibility but is no longer used for identity.
// -----------------------------------------------------------------------------
export async function getScopedUser(/* request */) {
  const { getSessionUser } = await import("./auth");
  return getSessionUser();
}

export async function getScopedManufacturer(/* request */) {
  const { getSessionManufacturer } = await import("./auth");
  return getSessionManufacturer();
}
