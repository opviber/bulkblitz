// =============================================================================
// BulkBlitz — BulkCash wallet ledger (transactional, idempotent)
// =============================================================================
import { prisma } from "./prisma";

/**
 * Credit BulkCash to a user. Idempotent when an idempotencyKey is supplied.
 * Updates User.walletBalance and writes a BulkCashTransaction in one transaction.
 */
export async function creditWallet(userId, amount, description, idempotencyKey = null) {
  if (amount <= 0) return null;
  return prisma.$transaction(async (tx) => {
    if (idempotencyKey) {
      const existing = await tx.bulkCashTransaction.findUnique({ where: { idempotencyKey } });
      if (existing) return existing;
    }
    const txn = await tx.bulkCashTransaction.create({
      data: { userId, amount, type: "CREDIT", description, idempotencyKey },
    });
    await tx.user.update({
      where: { id: userId },
      data: { walletBalance: { increment: amount } },
    });
    return txn;
  });
}

/**
 * Debit BulkCash from a user. Fails if insufficient balance.
 */
export async function debitWallet(userId, amount, description, idempotencyKey = null) {
  if (amount <= 0) return null;
  return prisma.$transaction(async (tx) => {
    if (idempotencyKey) {
      const existing = await tx.bulkCashTransaction.findUnique({ where: { idempotencyKey } });
      if (existing) return existing;
    }
    const user = await tx.user.findUnique({ where: { id: userId } });
    if (!user || user.walletBalance < amount) {
      throw new Error("Insufficient BulkCash balance");
    }
    const txn = await tx.bulkCashTransaction.create({
      data: { userId, amount, type: "DEBIT", description, idempotencyKey },
    });
    await tx.user.update({
      where: { id: userId },
      data: { walletBalance: { decrement: amount } },
    });
    return txn;
  });
}
