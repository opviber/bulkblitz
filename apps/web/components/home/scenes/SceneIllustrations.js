"use client";

// =============================================================================
// SceneIllustrations — five hand-coded SVG illustrations for the hyperframe
// explainer. Each is a pure, brand-aligned, deterministic scene driven by a
// 0..1 `progress` prop coming from the scroll position. Zero AI imagery,
// zero stock — everything authored here so it stays on-brand.
// =============================================================================

import { motion } from "framer-motion";

const BRAND = {
  orange: "#FF6A00",
  accent: "#FF8C24",
  light: "#FFB85C",
  surface: "#18181B",
  surfaceMid: "#26262B",
  border: "rgba(255,255,255,0.08)",
  text: "#FAFAFA",
  textMute: "#A1A1AA",
  success: "#1DB954",
};

// ── Reusable building blocks ─────────────────────────────────────────────────

function PersonGlyph({ x, y, fill = BRAND.surfaceMid, accent = BRAND.orange, scale = 1, opacity = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <circle cx="0" cy="-14" r="9" fill={fill} stroke={accent} strokeWidth="1" />
      <path d="M -16 18 Q 0 -2 16 18 L 16 30 L -16 30 Z" fill={fill} stroke={accent} strokeWidth="1" />
    </g>
  );
}

function PriceTag({ x, y, price, currency = "₹", color = BRAND.orange, struck = false, scale = 1, opacity = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <rect x="-44" y="-22" width="88" height="44" rx="22" fill={BRAND.surface} stroke={color} strokeWidth="1.5" />
      <circle cx="-32" cy="0" r="3" fill={color} />
      <text
        x="4"
        y="6"
        textAnchor="middle"
        fill={color}
        fontSize="20"
        fontWeight="800"
        fontFamily="ui-monospace, SFMono-Regular, monospace"
        textDecoration={struck ? "line-through" : "none"}
      >
        {currency}{price}
      </text>
    </g>
  );
}

// =============================================================================
// SCENE 1 — Alone, you pay retail. Single buyer + bold MRP.
// =============================================================================
export function Scene1({ progress = 0 }) {
  const fade = Math.min(1, progress * 3);
  return (
    <svg viewBox="0 0 600 400" className="w-full h-full max-w-[640px] max-h-[420px]" preserveAspectRatio="xMidYMid meet" aria-label="One buyer alone with MRP">
      <defs>
        <radialGradient id="s1-spot" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={BRAND.orange} stopOpacity="0.15" />
          <stop offset="100%" stopColor={BRAND.orange} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft spotlight */}
      <ellipse cx="300" cy="280" rx="140" ry="40" fill="url(#s1-spot)" />

      {/* Floor line */}
      <line x1="60" y1="310" x2="540" y2="310" stroke={BRAND.border} strokeWidth="1" strokeDasharray="4 6" />

      {/* Lone shopper */}
      <motion.g
        initial={false}
        animate={{ y: progress * -4 }}
        transition={{ type: "tween", ease: "easeOut" }}
      >
        <PersonGlyph x={300} y={260} accent={BRAND.orange} scale={2.4} />
      </motion.g>

      {/* MRP tag */}
      <motion.g
        initial={false}
        animate={{ scale: 1 + progress * 0.06, opacity: fade }}
        style={{ transformOrigin: "300px 110px" }}
      >
        <PriceTag x={300} y={110} price="500" color={BRAND.orange} scale={1.4} />
        <text x="300" y="65" textAnchor="middle" fill={BRAND.textMute} fontSize="11" fontWeight="600" letterSpacing="2">
          STANDARD MRP
        </text>
      </motion.g>
    </svg>
  );
}

// =============================================================================
// SCENE 2 — The crowd joins. People emerge around the buyer.
// =============================================================================
export function Scene2({ progress = 0 }) {
  // Spawn schedule: more people the further you scroll through Scene 2
  const peopleCount = Math.floor(progress * 40);
  const people = Array.from({ length: 40 }, (_, i) => {
    const angle = (i / 40) * Math.PI * 2;
    const radius = 70 + (i % 5) * 22;
    const x = 300 + Math.cos(angle) * radius;
    const y = 220 + Math.sin(angle) * radius * 0.55;
    return { id: i, x, y, visible: i < peopleCount };
  });

  return (
    <svg viewBox="0 0 600 400" className="w-full h-full max-w-[640px] max-h-[420px]" preserveAspectRatio="xMidYMid meet" aria-label="Crowd joining the batch">
      {/* Concentric rings showing the pool */}
      {[110, 160, 200].map((r, i) => (
        <ellipse
          key={r}
          cx="300"
          cy="220"
          rx={r}
          ry={r * 0.55}
          fill="none"
          stroke={BRAND.orange}
          strokeOpacity={0.06 + (progress * 0.05 * (3 - i))}
          strokeWidth="1"
        />
      ))}

      {/* Central buyer */}
      <PersonGlyph x={300} y={220} accent={BRAND.orange} scale={2.0} />

      {/* Joiners pop in */}
      {people.map((p) => (
        <motion.g
          key={p.id}
          initial={false}
          animate={{ scale: p.visible ? 1 : 0, opacity: p.visible ? 0.85 : 0 }}
          style={{ transformOrigin: `${p.x}px ${p.y}px` }}
          transition={{ duration: 0.25, ease: "backOut" }}
        >
          <PersonGlyph x={p.x} y={p.y} accent={BRAND.accent} scale={0.85} />
        </motion.g>
      ))}

      {/* Counter pill */}
      <g transform="translate(300 60)">
        <rect x="-90" y="-22" width="180" height="44" rx="22" fill={BRAND.surface} stroke={BRAND.orange} strokeWidth="1.5" />
        <circle cx="-66" cy="0" r="4" fill={BRAND.orange}>
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.4s" repeatCount="indefinite" />
        </circle>
        <text x="6" y="6" textAnchor="middle" fill={BRAND.text} fontSize="18" fontWeight="800"
              fontFamily="ui-monospace, SFMono-Regular, monospace">
          {peopleCount + 1} buyers
        </text>
      </g>
    </svg>
  );
}

// =============================================================================
// SCENE 3 — Price ladder. Tiers light up as crowd fills.
// =============================================================================
export function Scene3({ progress = 0 }) {
  const tiers = [
    { id: 0, range: "1 – 49", price: 500, slotsCenter: 25 },
    { id: 1, range: "50 – 99", price: 420, slotsCenter: 75 },
    { id: 2, range: "100 – 149", price: 360, slotsCenter: 125 },
    { id: 3, range: "150 – 199", price: 310, slotsCenter: 175 },
    { id: 4, range: "200+", price: 260, slotsCenter: 220 },
  ];
  // Active tier index based on progress
  const active = Math.min(4, Math.floor(progress * 5));

  return (
    <svg viewBox="0 0 600 400" className="w-full h-full max-w-[640px] max-h-[420px]" preserveAspectRatio="xMidYMid meet" aria-label="Tier price ladder">
      {/* Header label */}
      <text x="300" y="36" textAnchor="middle" fill={BRAND.textMute} fontSize="11" fontWeight="600" letterSpacing="2">
        TIER LADDER
      </text>

      {tiers.map((t, i) => {
        const y = 70 + i * 58;
        const isLive = i <= active;
        const isFinal = i === active;
        const color = isLive ? BRAND.orange : BRAND.surfaceMid;

        return (
          <g key={t.id}>
            {/* Slot count rail */}
            <line x1="80" y1={y + 18} x2="80" y2={y + 22} stroke={BRAND.border} strokeWidth="1" />
            <text x="80" y={y + 10} textAnchor="middle" fill={BRAND.textMute} fontSize="10" fontWeight="600">
              {t.range}
            </text>

            {/* Tier bar */}
            <motion.rect
              x="120"
              y={y - 8}
              height="32"
              rx="6"
              fill={color}
              initial={false}
              animate={{
                width: isLive ? 320 : 220,
                opacity: isLive ? 1 : 0.35,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />

            {/* Tier price */}
            <motion.text
              x="460"
              y={y + 13}
              fill={isLive ? BRAND.orange : BRAND.textMute}
              fontSize={isFinal ? "22" : "16"}
              fontWeight="800"
              fontFamily="ui-monospace, SFMono-Regular, monospace"
              initial={false}
              animate={{
                scale: isFinal ? 1.05 : 1,
              }}
              style={{ transformBox: "fill-box", transformOrigin: "left center" }}
            >
              ₹{t.price}
            </motion.text>

            {/* "LIVE" badge on the active tier */}
            {isFinal && (
              <motion.g
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <rect x={540} y={y - 1} width="44" height="18" rx="9" fill={BRAND.orange} fillOpacity="0.15" />
                <text x={562} y={y + 12} textAnchor="middle" fill={BRAND.orange} fontSize="9" fontWeight="800" letterSpacing="1">
                  LIVE
                </text>
              </motion.g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// =============================================================================
// SCENE 4 — Batch closes. Cards captured at the final price.
// =============================================================================
export function Scene4({ progress = 0 }) {
  const captured = progress > 0.5;
  return (
    <svg viewBox="0 0 600 400" className="w-full h-full max-w-[640px] max-h-[420px]" preserveAspectRatio="xMidYMid meet" aria-label="Cards captured at final price">
      {/* Big lock + price reveal */}
      <motion.g
        initial={false}
        animate={{ y: progress * -6 }}
      >
        <text x="300" y="56" textAnchor="middle" fill={BRAND.textMute} fontSize="11" fontWeight="600" letterSpacing="2">
          BATCH CLOSED · FINAL PRICE
        </text>
        <motion.g
          initial={false}
          animate={{ scale: 1 + progress * 0.04 }}
          style={{ transformOrigin: "300px 110px" }}
        >
          <PriceTag x={300} y={110} price="260" color={BRAND.orange} scale={1.7} />
        </motion.g>
      </motion.g>

      {/* Cards lined up — each gets a "captured" check */}
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 90 + i * 90;
        return (
          <g key={i} transform={`translate(${x} 250)`}>
            {/* Card body */}
            <rect x="-32" y="-22" width="64" height="44" rx="6" fill={BRAND.surface} stroke={BRAND.border} strokeWidth="1" />
            <rect x="-26" y="-14" width="26" height="6" rx="2" fill={BRAND.surfaceMid} />
            <rect x="-26" y="-4" width="18" height="3" rx="1.5" fill={BRAND.surfaceMid} />

            {/* Captured stamp */}
            <motion.g
              initial={false}
              animate={{ scale: captured ? 1 : 0, opacity: captured ? 1 : 0 }}
              style={{ transformOrigin: "0px 0px" }}
              transition={{ delay: i * 0.06, duration: 0.3, ease: "backOut" }}
            >
              <circle cx="0" cy="0" r="14" fill={BRAND.success} />
              <path d="M -5 0 L -1 4 L 6 -4" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </motion.g>

            <text x="0" y="36" textAnchor="middle" fill={BRAND.textMute} fontSize="9" fontWeight="600">
              ₹260
            </text>
          </g>
        );
      })}

      {/* Authorized → Captured rail */}
      <g transform="translate(300 330)">
        <text x="-110" y="0" textAnchor="middle" fill={BRAND.textMute} fontSize="10" fontWeight="600" letterSpacing="1">
          AUTHORIZED
        </text>
        <text x="110" y="0" textAnchor="middle" fill={BRAND.orange} fontSize="10" fontWeight="700" letterSpacing="1">
          CAPTURED
        </text>
        <line x1="-50" y1="-3" x2="50" y2="-3" stroke={BRAND.border} strokeWidth="1" />
        <motion.line
          x1="-50" y1="-3" x2="50" y2="-3"
          stroke={BRAND.orange} strokeWidth="2" strokeLinecap="round"
          initial={false}
          animate={{ pathLength: progress }}
          style={{ pathLength: progress }}
        />
      </g>
    </svg>
  );
}

// =============================================================================
// SCENE 5 — Everyone wins. Boxes ship, savings tally up.
// =============================================================================
export function Scene5({ progress = 0 }) {
  const savings = Math.round(240 * progress);
  return (
    <svg viewBox="0 0 600 400" className="w-full h-full max-w-[640px] max-h-[420px]" preserveAspectRatio="xMidYMid meet" aria-label="Boxes shipping out, savings tally">
      {/* Conveyor */}
      <line x1="40" y1="280" x2="560" y2="280" stroke={BRAND.border} strokeWidth="2" strokeDasharray="6 6" />
      <line x1="40" y1="290" x2="560" y2="290" stroke={BRAND.border} strokeWidth="1" />

      {/* Boxes moving across */}
      {[0, 1, 2, 3, 4].map((i) => {
        const baseX = -40 + i * 130;
        const x = baseX + progress * 200;
        return (
          <g key={i} transform={`translate(${x} 240)`}>
            <rect x="-26" y="-22" width="52" height="44" rx="4" fill={BRAND.surfaceMid} stroke={BRAND.orange} strokeWidth="1.2" />
            <line x1="-26" y1="0" x2="26" y2="0" stroke={BRAND.orange} strokeOpacity="0.5" strokeWidth="1" />
            <line x1="0" y1="-22" x2="0" y2="0" stroke={BRAND.orange} strokeOpacity="0.5" strokeWidth="1" />
            <text x="0" y="-4" textAnchor="middle" fill={BRAND.textMute} fontSize="7" fontWeight="700" letterSpacing="1">
              BULK
            </text>
          </g>
        );
      })}

      {/* Massive savings number */}
      <g transform="translate(300 110)">
        <text x="0" y="-30" textAnchor="middle" fill={BRAND.textMute} fontSize="11" fontWeight="600" letterSpacing="2">
          EVERY BUYER SAVED
        </text>
        <motion.text
          x="0" y="20"
          textAnchor="middle"
          fill={BRAND.orange}
          fontSize="74"
          fontWeight="900"
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          letterSpacing="-2"
        >
          ₹{savings}
        </motion.text>
        <text x="0" y="48" textAnchor="middle" fill={BRAND.text} fontSize="13" fontWeight="600" opacity="0.9">
          per unit · zero commitment · zero risk
        </text>
      </g>
    </svg>
  );
}
