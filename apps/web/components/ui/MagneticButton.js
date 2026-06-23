"use client";

// =============================================================================
// MagneticButton — primary CTA with subtle pointer-tracking magnetism + a
// soft lift on hover and a clean tap response. Respects prefers-reduced-motion
// (resolves to a plain styled <Link> in that case). Replaces the bare
// `Magnet` wrapper deleted in Step 4.
//
// Usage:
//   <MagneticButton href="/auth" icon={ArrowRight}>Get started</MagneticButton>
//   <MagneticButton onClick={...} variant="ghost">Browse</MagneticButton>
// =============================================================================

import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

export default function MagneticButton({
  href,
  onClick,
  children,
  icon: Icon,
  variant = "primary",
  className = "",
  strength = 0.35,
  disabled = false,
  ...rest
}) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Spring-smooth the magnetic follow
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  function onMove(e) {
    if (reduced || disabled) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  const base =
    "relative inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full font-semibold text-[15px] select-none transition-colors will-change-transform";
  const variants = {
    primary:
      "bg-[var(--primary)] text-white shadow-[0_10px_30px_rgba(255,106,0,0.30)] hover:bg-[var(--accent)]",
    ghost:
      "bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] hover:border-[var(--text-tertiary)]",
    danger:
      "bg-[var(--accent-danger)] text-white hover:opacity-90",
  };
  const cls = `${base} ${variants[variant] || variants.primary} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`;

  const inner = (
    <motion.span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileTap={reduced || disabled ? undefined : { scale: 0.97 }}
      style={{ x: sx, y: sy, display: "inline-flex" }}
      className={cls}
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        {Icon ? <Icon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" /> : null}
      </span>
    </motion.span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex group" {...rest} aria-disabled={disabled}>
        {inner}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className="inline-flex group bg-transparent border-0 p-0 m-0"
      {...rest}
    >
      {inner}
    </button>
  );
}
