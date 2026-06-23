"use client";

// =============================================================================
// TierDropBurst — celebratory micro-confetti for when a batch crosses into a
// new (cheaper) tier. Pure framer-motion; no canvas, no extra deps. Fires
// once per `triggerKey` change. Auto-skipped on prefers-reduced-motion.
//
// Usage:
//   <TierDropBurst triggerKey={tierIndex} />
//
// Place once near the top of the batch detail page and bump triggerKey
// whenever a new tier unlocks.
// =============================================================================

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const BRAND_COLORS = ["#FF6A00", "#FF8C24", "#FFB85C", "#1DB954", "#FFFFFF"];

function rand(min, max) { return Math.random() * (max - min) + min; }

export default function TierDropBurst({ triggerKey, particles = 18, message = "Tier unlocked" }) {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduced) return;
    if (triggerKey === undefined || triggerKey === null) return;
    setVisible(true);
    setTick((t) => t + 1);
    const id = setTimeout(() => setVisible(false), 1700);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerKey, reduced]);

  // Pre-compute particle physics so we don't recalc on each frame
  const items = useMemo(() => {
    return Array.from({ length: particles }).map((_, i) => ({
      id: i,
      // Spawn from origin and shoot outward at a random angle/distance
      tx: rand(-180, 180),
      ty: rand(-220, -60),
      rot: rand(-180, 180),
      size: rand(6, 12),
      color: BRAND_COLORS[i % BRAND_COLORS.length],
      delay: rand(0, 0.08),
      duration: rand(0.9, 1.4),
    }));
    // Re-roll on each tick so successive bursts look different
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, particles]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={tick}
          className="pointer-events-none fixed inset-0 z-[1100] flex items-start justify-center pt-[18vh]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Particle field */}
          <div className="relative">
            {items.map((p) => (
              <motion.span
                key={p.id}
                className="absolute left-0 top-0 block rounded-[2px]"
                initial={{ x: 0, y: 0, rotate: 0, opacity: 0 }}
                animate={{
                  x: p.tx,
                  y: p.ty,
                  rotate: p.rot,
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  ease: [0.16, 1, 0.3, 1],
                  times: [0, 0.1, 0.7, 1],
                }}
                style={{
                  width: p.size,
                  height: p.size * 0.7,
                  background: p.color,
                  boxShadow: `0 0 12px ${p.color}55`,
                }}
              />
            ))}

            {/* Banner */}
            <motion.div
              initial={{ y: -10, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.18em]
                bg-[var(--primary)] text-white shadow-[0_18px_50px_rgba(255,106,0,0.45)]"
            >
              ✦ {message}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
