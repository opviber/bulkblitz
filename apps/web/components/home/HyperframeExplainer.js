"use client";

// =============================================================================
// HyperframeExplainer — a scroll-driven, 5-scene cinematic explainer of the
// BulkBlitz mechanic. Inspired by Apple-style "hyperframe" product pages: the
// section pins the visual stage to the viewport while the user scrolls
// through the narrative, and the illustrations advance frame by frame.
//
// Engineering notes:
//   - Container is 5 × 100vh tall to give each scene one viewport of scroll
//   - `useScroll({ target, offset: ["start start", "end end"] })` maps the
//     user's progress through THIS section to a 0..1 range
//   - Per-scene progress is derived in JS (cheap; no re-render storms)
//   - `prefers-reduced-motion` falls back to a static grid of the 5 scenes
// =============================================================================

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Scene1, Scene2, Scene3, Scene4, Scene5 } from "./scenes/SceneIllustrations";

const SCENES = [
  {
    id: 1,
    kicker: "01 · The reality",
    title: (
      <>
        Alone, you pay <span className="text-[var(--primary)]">retail.</span>
      </>
    ),
    body:
      "Walk into a store, you pay MRP. Buy direct from a factory? They want 200 units up front. Most buyers never get the manufacturer price.",
    Scene: Scene1,
  },
  {
    id: 2,
    kicker: "02 · The mechanic",
    title: (
      <>
        Pool together. <span className="text-[var(--primary)]">Watch the crowd grow.</span>
      </>
    ),
    body:
      "Every batch is a time-windowed pool. Each new buyer joins for the same product — and the manufacturer's volume pricing unlocks for everyone.",
    Scene: Scene2,
  },
  {
    id: 3,
    kicker: "03 · The price ladder",
    title: (
      <>
        Tiers collapse <span className="text-[var(--primary)]">in real time.</span>
      </>
    ),
    body:
      "₹500 at 1–49 units. ₹420 at 50–99. ₹360 at 100–149. The further the crowd goes, the steeper the drop — and every buyer in the batch pays the same final price.",
    Scene: Scene3,
  },
  {
    id: 4,
    kicker: "04 · The settle",
    title: (
      <>
        Cards captured at the <span className="text-[var(--primary)]">final tier.</span>
      </>
    ),
    body:
      "Your card was authorised at the entry price — never charged. When the batch closes, every authorisation captures at the lowest unlocked tier. If the batch fails MOQ, the hold is voided.",
    Scene: Scene4,
  },
  {
    id: 5,
    kicker: "05 · The win",
    title: (
      <>
        Everyone ships. <span className="text-[var(--primary)]">Everyone saves.</span>
      </>
    ),
    body:
      "Manufacturer ships the full crowd order. Platform fee is a flat 4%. Buyer pays factory price. Three winners, zero forced discounts.",
    Scene: Scene5,
  },
];

// ── reduced-motion fallback ──────────────────────────────────────────────────
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);
  return reduced;
}

export default function HyperframeExplainer() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const [globalP, setGlobalP] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setGlobalP(v));

  const reduced = usePrefersReducedMotion();
  const N = SCENES.length;

  // Per-scene local progress: each scene gets 1/N of the scroll
  function localProgress(i) {
    const start = i / N;
    const end = (i + 1) / N;
    const p = (globalP - start) / (end - start);
    return Math.max(0, Math.min(1, p));
  }

  // Pick the dominant scene (slightly biased forward so transitions feel snappy)
  const dominant = Math.min(N - 1, Math.floor(globalP * N + 0.08));

  // ─── Reduced-motion: render a static, scrollable grid of the 5 scenes ───
  if (reduced) {
    return (
      <section className="relative bg-[var(--bg-primary)] py-20">
        <SectionHeader />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid sm:grid-cols-2 gap-6">
          {SCENES.map((s) => (
            <article
              key={s.id}
              className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)]"
            >
              <p className="text-[10px] font-bold tracking-[0.18em] text-[var(--primary)] uppercase mb-2">{s.kicker}</p>
              <h3 className="text-xl font-black mb-2">{s.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">{s.body}</p>
              <div className="aspect-[3/2] flex items-center justify-center rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] overflow-hidden">
                <s.Scene progress={1} />
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="relative bg-[var(--bg-primary)]"
      style={{ height: `${N * 100}vh` }}
      aria-label="How BulkBlitz works"
    >
      {/* Sticky stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        {/* Decorative ambient orbs that drift on scroll */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-[var(--primary)]/15 blur-[120px]"
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -200]) }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full bg-[var(--accent)]/10 blur-[140px]"
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, 200]) }}
        />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6">
          {/* Inline section header — pinned above the scene */}
          <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.22em] text-[var(--primary)] uppercase mb-3 text-center">
            How it works
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 lg:gap-12">
            {/* LEFT — copy column. Crossfades between scenes. */}
            <div className="relative min-h-[280px] sm:min-h-[300px]">
              {SCENES.map((s, i) => {
                const lp = localProgress(i);
                const visible = i === dominant;
                return (
                  <motion.div
                    key={s.id}
                    initial={false}
                    animate={{
                      opacity: visible ? 1 : 0,
                      y: visible ? 0 : 16,
                      filter: visible ? "blur(0px)" : "blur(6px)",
                    }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 flex flex-col justify-center"
                    style={{ pointerEvents: visible ? "auto" : "none" }}
                  >
                    <p className="text-[10px] font-bold tracking-[0.18em] text-[var(--primary)] uppercase mb-3">
                      {s.kicker}
                    </p>
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.05] mb-5">
                      {s.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-md">
                      {s.body}
                    </p>
                    {/* Scene progress micro-bar */}
                    <div className="mt-7 h-[3px] w-28 rounded-full bg-[var(--border-default)] overflow-hidden">
                      <motion.div
                        className="h-full bg-[var(--primary)]"
                        animate={{ width: `${lp * 100}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* RIGHT — illustration stage. Each scene SVG fades / animates. */}
            <div className="relative h-[280px] sm:h-[340px] md:h-[420px] flex items-center justify-center">
              {SCENES.map((s, i) => {
                const lp = localProgress(i);
                const visible = i === dominant;
                return (
                  <motion.div
                    key={s.id}
                    initial={false}
                    animate={{
                      opacity: visible ? 1 : 0,
                      scale: visible ? 1 : 0.96,
                    }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <s.Scene progress={lp} />
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Scene dots — both indicator and quick-jump */}
          <SceneDots dominant={dominant} containerRef={containerRef} N={N} />
        </div>
      </div>
    </section>
  );
}

function SectionHeader() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center mb-10">
      <p className="text-[11px] font-bold tracking-[0.22em] text-[var(--primary)] uppercase mb-3">
        How it works
      </p>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
        From single buyer to factory price <span className="text-[var(--primary)]">in five frames.</span>
      </h2>
    </div>
  );
}

function SceneDots({ dominant, containerRef, N }) {
  const jumpTo = (i) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const totalScroll = el.offsetHeight - window.innerHeight;
    const target = el.offsetTop + (i / N) * totalScroll + 4;
    window.scrollTo({ top: target, behavior: "smooth" });
  };
  return (
    <div className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 flex-col gap-3 z-20">
      {Array.from({ length: N }).map((_, i) => {
        const active = i === dominant;
        return (
          <button
            key={i}
            onClick={() => jumpTo(i)}
            aria-label={`Jump to frame ${i + 1}`}
            className={`group relative flex items-center justify-center w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              active
                ? "bg-[var(--primary)] scale-125"
                : "bg-[var(--border-default)] hover:bg-[var(--text-tertiary)]"
            }`}
          >
            <span
              className={`absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-bold tracking-wider whitespace-nowrap transition-opacity ${
                active ? "opacity-100 text-[var(--primary)]" : "opacity-0 group-hover:opacity-100 text-[var(--text-secondary)]"
              }`}
            >
              0{i + 1}
            </span>
          </button>
        );
      })}
    </div>
  );
}
