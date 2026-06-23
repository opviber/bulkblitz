"use client";

// =============================================================================
// HeroSection — replaces the old 3D-cube hero with a kinetic, brand-aligned
// landing surface. Two columns on desktop:
//   LEFT  — kinetic typography ("Bulk up. Price down.") with role-aware CTAs
//   RIGHT — a self-contained mini batch card that demonstrates the live
//           tier-drop mechanic in motion (no 3D scene — feels grounded, not
//           AI-generic). Kicks off the story that HyperframeExplainer tells.
//
// Engineering notes:
//   - Pure framer-motion (already in deps). No GSAP needed.
//   - The mini demo loops a 5-tier price drop on a 14-second cycle.
//   - prefers-reduced-motion is respected (animations resolve to final state).
//   - CTAs use the real session: a signed-in seller jumps to "Create batch";
//     a signed-in buyer scrolls to the live feed; everyone else goes to /auth.
// =============================================================================

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, ShieldCheck, Zap, Users, TrendingDown, Factory, PlayCircle,
} from "lucide-react";
import { useSession } from "@/lib/useSession";

const HEADLINE_LINE_1 = ["Bulk", "up."];
const HEADLINE_LINE_2 = ["Price", "down."];

const word = {
  hidden: { y: "110%", opacity: 0 },
  show: (i) => ({
    y: 0,
    opacity: 1,
    transition: { delay: 0.08 * i, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function HeroSection({ stats }) {
  const { user, isAuthed, isSeller } = useSession();
  const reduced = useReducedMotion();

  const primaryCta = isSeller
    ? { label: "Create a batch", href: "/manufacturer/batch/new", icon: Factory }
    : isAuthed
    ? { label: "Browse live batches", href: "#live-feed", icon: ArrowRight }
    : { label: "Get started — it's free", href: "/auth", icon: ArrowRight };

  const secondaryCta = isAuthed && !isSeller
    ? { label: "Become a seller", href: "/become-a-seller", icon: Factory }
    : { label: "See how it works", href: "#how-it-works", icon: PlayCircle };

  return (
    <section className="relative pt-24 sm:pt-28 pb-16 sm:pb-24 overflow-hidden">
      {/* Background — subtle, brand-aligned */}
      <BackgroundLayer />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Trust pill */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mb-7"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold
            bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-secondary)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
            India's first crowd-powered manufacturing marketplace
          </span>
        </motion.div>

        {/* Headline */}
        <div className="text-center mb-7 sm:mb-9">
          <h1 className="font-black tracking-tight leading-[0.92] text-[40px] sm:text-[64px] md:text-[88px] lg:text-[112px]">
            <KineticLine words={HEADLINE_LINE_1} reduced={reduced} />
            <span className="block">
              <KineticLine
                words={HEADLINE_LINE_2}
                reduced={reduced}
                offset={HEADLINE_LINE_1.length}
                accent
              />
            </span>
          </h1>
        </div>

        {/* Subhead */}
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="text-center text-base sm:text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed mb-9"
        >
          Pool together with other buyers. Unlock the factory's volume pricing in real time.
          When the batch closes, everyone pays the lowest tier the crowd reached.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center mb-12"
        >
          <Link
            href={primaryCta.href}
            className="group inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-[var(--primary)] text-white font-semibold text-[15px] shadow-[0_10px_30px_rgba(255,106,0,0.30)] hover:bg-[var(--accent)] hover:-translate-y-0.5 transition-all"
          >
            {primaryCta.label}
            <primaryCta.icon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href={secondaryCta.href}
            className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold text-[15px] hover:bg-[var(--bg-elevated)] hover:border-[var(--text-tertiary)] transition-all"
          >
            <secondaryCta.icon className="w-4 h-4" />
            {secondaryCta.label}
          </Link>
        </motion.div>

        {/* Live demo strip */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto"
        >
          <LiveDemoCard reduced={reduced} />
        </motion.div>

        {/* Trust strip */}
        <div className="mt-12 grid grid-cols-3 gap-2 sm:gap-6 max-w-3xl mx-auto">
          {[
            { icon: ShieldCheck, label: "Card hold, not charge" },
            { icon: TrendingDown, label: "Pay the final tier" },
            { icon: Users, label: "No fill = no charge" },
          ].map((t, i) => (
            <motion.div
              key={t.label}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 + i * 0.08 }}
              className="flex items-center gap-2 justify-center text-xs sm:text-sm text-[var(--text-secondary)]"
            >
              <t.icon className="w-4 h-4 text-[var(--primary)] shrink-0" />
              <span>{t.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Kinetic line: each word slides up into view ───────────────────────────────
function KineticLine({ words, reduced, offset = 0, accent = false }) {
  return (
    <span className="block overflow-hidden">
      <span className="inline-flex flex-wrap gap-x-[0.18em] justify-center">
        {words.map((w, i) => (
          <span key={`${w}-${i}`} className="inline-block overflow-hidden align-bottom">
            <motion.span
              initial={reduced ? false : "hidden"}
              animate="show"
              variants={word}
              custom={i + offset}
              className={`inline-block ${accent ? "bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent" : ""}`}
            >
              {w}
            </motion.span>
          </span>
        ))}
      </span>
    </span>
  );
}

// ── Live mini batch card demonstrating tier drops in real time ───────────────
const TIERS = [
  { slots: 12, price: 500, label: "1–49" },
  { slots: 62, price: 420, label: "50–99" },
  { slots: 118, price: 360, label: "100–149" },
  { slots: 167, price: 310, label: "150–199" },
  { slots: 214, price: 260, label: "200+" },
];

function LiveDemoCard({ reduced }) {
  // Cycle through the tier index every 2.6s for the live demo.
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (reduced) {
      setIdx(TIERS.length - 1);
      return;
    }
    const id = setInterval(() => setIdx((v) => (v + 1) % TIERS.length), 2600);
    return () => clearInterval(id);
  }, [reduced]);

  const current = TIERS[idx];
  const original = TIERS[0].price;
  const savings = Math.round(((original - current.price) / original) * 100);
  const fillPct = Math.min(100, Math.round((current.slots / 220) * 100));

  return (
    <div className="relative rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] overflow-hidden shadow-[0_24px_80px_-12px_rgba(0,0,0,0.45)]">
      {/* Subtle live shimmer along the top edge */}
      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent"
          animate={reduced ? {} : { x: ["-100%", "300%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="p-5 sm:p-6">
        {/* Top row — meta */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--success)]/12 text-[var(--success)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
              Live
            </span>
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">
              Sample batch · Pulses 1kg
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--text-secondary)]">
            <Zap className="w-3.5 h-3.5 text-[var(--primary)]" />
            {current.slots} buyers
          </div>
        </div>

        {/* Price reveal */}
        <div className="flex items-end justify-between mb-4 gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[var(--text-tertiary)] mb-1">
              Current price · per unit
            </p>
            <div className="flex items-baseline gap-3">
              <motion.span
                key={current.price}
                initial={reduced ? false : { y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent"
                style={{ fontFamily: "ui-monospace, SFMono-Regular, monospace" }}
              >
                ₹{current.price}
              </motion.span>
              <span className="text-base text-[var(--text-tertiary)] line-through mb-1.5">₹{original}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[var(--text-tertiary)] mb-1">Savings</p>
            <motion.span
              key={savings}
              initial={reduced ? false : { y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.45 }}
              className="inline-block text-xl sm:text-2xl font-black text-[var(--success)]"
              style={{ fontFamily: "ui-monospace, SFMono-Regular, monospace" }}
            >
              −{savings}%
            </motion.span>
          </div>
        </div>

        {/* Fill bar with tick marks */}
        <div className="relative h-2 mb-3 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent-2)]"
            initial={false}
            animate={{ width: `${fillPct}%` }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* Tier ticks */}
          {[50, 100, 150, 200].map((t) => (
            <span
              key={t}
              className="absolute top-1/2 -translate-y-1/2 w-px h-2 bg-[var(--bg-primary)]"
              style={{ left: `${(t / 220) * 100}%` }}
            />
          ))}
        </div>

        {/* Tier strip — current tier label + next tier teaser */}
        <div className="flex items-center justify-between text-[11px] text-[var(--text-tertiary)]">
          <span>Tier <span className="text-[var(--text-secondary)] font-semibold">{current.label}</span> unlocked</span>
          {idx < TIERS.length - 1 ? (
            <span>
              {TIERS[idx + 1].slots - current.slots} more to drop to{" "}
              <span className="text-[var(--primary)] font-semibold">₹{TIERS[idx + 1].price}</span>
            </span>
          ) : (
            <span className="text-[var(--success)] font-semibold">Final tier reached</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Background — refined, brand-aligned, never generic ───────────────────────
function BackgroundLayer() {
  return (
    <>
      {/* Soft, asymmetric brand glow */}
      <div className="pointer-events-none absolute -top-32 -right-24 w-[560px] h-[560px] rounded-full bg-[var(--primary)]/14 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 w-[480px] h-[480px] rounded-full bg-[var(--accent)]/8 blur-[160px]" />

      {/* Premium industrial grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 industrial-grid opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"
      />
    </>
  );
}
