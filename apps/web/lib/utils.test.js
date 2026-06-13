import { describe, it, expect } from "vitest";
import {
  formatPrice,
  formatNumber,
  cn,
  getInitials,
  truncate,
  calculateFillPercent,
  getCurrentTier,
  getSavingsPercent,
  getSlotsToNextTier,
} from "./utils";

describe("utils.js unit tests", () => {
  describe("formatNumber", () => {
    it("should format numbers with Indian numbering style", () => {
      expect(formatNumber(100)).toBe("100");
      expect(formatNumber(1000)).toBe("1,000");
      expect(formatNumber(10000)).toBe("10,000");
      expect(formatNumber(100000)).toBe("1,00,000");
      expect(formatNumber(1000000)).toBe("10,00,000");
      expect(formatNumber(10000000)).toBe("1,00,00,000");
    });
  });

  describe("formatPrice", () => {
    it("should format price with Rupee symbol and Indian numbering system", () => {
      expect(formatPrice(100)).toBe("₹100.00");
      expect(formatPrice(100000.5)).toBe("₹1,00,000.50");
      expect(formatPrice(1000, false)).toBe("₹1,000");
    });
  });

  describe("cn", () => {
    it("should join active class names", () => {
      expect(cn("class1", "class2")).toBe("class1 class2");
      expect(cn("class1", false, "class2", null, undefined)).toBe("class1 class2");
    });
  });

  describe("getInitials", () => {
    it("should extract initials correctly", () => {
      expect(getInitials("Ashish Sharma")).toBe("AS");
      expect(getInitials("Sharma Industries Private Limited")).toBe("SI");
      expect(getInitials("")).toBe("");
    });
  });

  describe("truncate", () => {
    it("should truncate long strings", () => {
      expect(truncate("hello world", 5)).toBe("hello…");
      expect(truncate("hello", 10)).toBe("hello");
    });
  });

  describe("calculateFillPercent", () => {
    it("should calculate correct percentage", () => {
      expect(calculateFillPercent(50, 100)).toBe(50);
      expect(calculateFillPercent(120, 100)).toBe(100);
      expect(calculateFillPercent(0, 0)).toBe(0);
    });
  });

  describe("getCurrentTier", () => {
    const mockBatch = {
      currentSlots: 15,
      tiers: [
        { id: "t1", minSlots: 0, maxSlots: 9, price: 100 },
        { id: "t2", minSlots: 10, maxSlots: 19, price: 90 },
        { id: "t3", minSlots: 20, maxSlots: 30, price: 80 },
      ],
    };

    it("should return the correct pricing tier based on filled slots", () => {
      expect(getCurrentTier({ ...mockBatch, currentSlots: 5 })?.price).toBe(100);
      expect(getCurrentTier({ ...mockBatch, currentSlots: 10 })?.price).toBe(90);
      expect(getCurrentTier({ ...mockBatch, currentSlots: 15 })?.price).toBe(90);
      expect(getCurrentTier({ ...mockBatch, currentSlots: 20 })?.price).toBe(80);
      expect(getCurrentTier({ ...mockBatch, currentSlots: 25 })?.price).toBe(80);
    });
  });

  describe("getSavingsPercent", () => {
    const mockBatch = {
      currentSlots: 0,
      tiers: [
        { minSlots: 0, maxSlots: 9, price: 100 },
        { minSlots: 10, maxSlots: 19, price: 80 },
      ],
    };

    it("should calculate savings compared to the first tier", () => {
      expect(getSavingsPercent({ ...mockBatch, currentSlots: 5 })).toBe(0); // same tier
      expect(getSavingsPercent({ ...mockBatch, currentSlots: 12 })).toBe(20); // 100 vs 80 => 20%
    });
  });

  describe("getSlotsToNextTier", () => {
    const mockBatch = {
      currentSlots: 5,
      tiers: [
        { id: "t1", minSlots: 0, maxSlots: 9, price: 100 },
        { id: "t2", minSlots: 10, maxSlots: 19, price: 90 },
        { id: "t3", minSlots: 20, maxSlots: 30, price: 80 },
      ],
    };

    it("should calculate remaining slots needed to unlock next tier", () => {
      expect(getSlotsToNextTier({ ...mockBatch, currentSlots: 5 })).toBe(5);
      expect(getSlotsToNextTier({ ...mockBatch, currentSlots: 9 })).toBe(1);
      expect(getSlotsToNextTier({ ...mockBatch, currentSlots: 10 })).toBe(10); // next is 20, so 20-10=10
      expect(getSlotsToNextTier({ ...mockBatch, currentSlots: 25 })).toBeNull(); // already at highest tier
    });
  });
});
