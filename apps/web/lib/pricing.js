// =============================================================================
// BulkBlitz — Server-side pricing engine (single source of truth)
// =============================================================================

/**
 * Given a batch's tier schedule and a filled-slot count, return the active tier.
 * Tiers are [{ minSlots, maxSlots, price }]. The active tier is the highest
 * tier whose minSlots <= filled.
 */
export function resolveTier(tiers, filled) {
  if (!Array.isArray(tiers) || tiers.length === 0) return null;
  const sorted = [...tiers].sort((a, b) => a.minSlots - b.minSlots);
  let active = sorted[0];
  for (const t of sorted) {
    if (filled >= t.minSlots) active = t;
  }
  return active;
}

/** Price per unit at a given fill level. */
export function priceAtFill(tiers, filled) {
  const tier = resolveTier(tiers, filled);
  return tier ? tier.price : null;
}

/** The next tier above the current fill (or null if at final tier). */
export function nextTier(tiers, filled) {
  if (!Array.isArray(tiers)) return null;
  const sorted = [...tiers].sort((a, b) => a.minSlots - b.minSlots);
  return sorted.find((t) => t.minSlots > filled) || null;
}

/** Slots remaining until the next price drop (or 0 at final tier). */
export function slotsToNextTier(tiers, filled) {
  const nt = nextTier(tiers, filled);
  return nt ? Math.max(0, nt.minSlots - filled) : 0;
}

/**
 * Decide the outcome of closing a batch.
 * Returns { fulfilled: boolean, finalPrice: number|null }.
 * If filled < moq → cancelled (not fulfilled). Otherwise final price is the
 * tier price at the closing fill level.
 */
export function closeOutcome({ tiers, currentSlots, moq }) {
  if (currentSlots < moq) {
    return { fulfilled: false, finalPrice: null };
  }
  return { fulfilled: true, finalPrice: priceAtFill(tiers, currentSlots) };
}
