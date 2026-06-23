import { describe, it, expect } from "vitest";
import {
  resolveTier,
  priceAtFill,
  nextTier,
  slotsToNextTier,
  closeOutcome,
} from "./pricing";

const tiers = [
  { minSlots: 1, maxSlots: 49, price: 20 },
  { minSlots: 50, maxSlots: 99, price: 15 },
  { minSlots: 100, maxSlots: 199, price: 12 },
  { minSlots: 200, maxSlots: 100000, price: 10 },
];

describe("pricing engine", () => {
  it("resolves the active tier by fill level", () => {
    expect(resolveTier(tiers, 1).price).toBe(20);
    expect(resolveTier(tiers, 49).price).toBe(20);
    expect(resolveTier(tiers, 50).price).toBe(15);
    expect(resolveTier(tiers, 150).price).toBe(12);
    expect(resolveTier(tiers, 250).price).toBe(10);
  });

  it("returns the unit price at a fill", () => {
    expect(priceAtFill(tiers, 0)).toBe(20);
    expect(priceAtFill(tiers, 100)).toBe(12);
  });

  it("finds the next tier and slots remaining", () => {
    expect(nextTier(tiers, 40).price).toBe(15);
    expect(slotsToNextTier(tiers, 40)).toBe(10);
    expect(nextTier(tiers, 250)).toBeNull();
    expect(slotsToNextTier(tiers, 250)).toBe(0);
  });

  it("closes fulfilled when MOQ met, price at closing fill", () => {
    const out = closeOutcome({ tiers, currentSlots: 87, moq: 50 });
    expect(out.fulfilled).toBe(true);
    expect(out.finalPrice).toBe(15);
  });

  it("cancels when MOQ not met", () => {
    const out = closeOutcome({ tiers, currentSlots: 30, moq: 50 });
    expect(out.fulfilled).toBe(false);
    expect(out.finalPrice).toBeNull();
  });

  it("handles empty tiers safely", () => {
    expect(resolveTier([], 10)).toBeNull();
    expect(priceAtFill(undefined, 10)).toBeNull();
  });
});
