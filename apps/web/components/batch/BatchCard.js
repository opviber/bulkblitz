"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Users, Clock, ShoppingBag, Cpu, Shirt, Home, Wheat, Sparkles, 
  PenTool, Dumbbell, Compass, Check
} from "lucide-react";
import { 
  formatPrice, 
  getCurrentTier, 
  getSavingsPercent, 
  getSlotsToNextTier, 
  calculateFillPercent 
} from "@/lib/utils";

const CATEGORY_MAP = {
  fmcg: { bg: 'var(--color-batch-c)', glow: 'rgba(249, 115, 22, 0.08)', icon: ShoppingBag },
  electronics: { bg: 'var(--color-batch-b)', glow: 'rgba(59, 130, 246, 0.08)', icon: Cpu },
  apparel: { bg: 'var(--color-batch-d)', glow: 'rgba(139, 92, 246, 0.08)', icon: Shirt },
  'home-kitchen': { bg: 'var(--color-batch-b)', glow: 'rgba(16, 185, 129, 0.08)', icon: Home },
  agriculture: { bg: 'var(--color-batch-a)', glow: 'rgba(132, 204, 22, 0.08)', icon: Wheat },
  'personal-care': { bg: 'var(--color-batch-c)', glow: 'rgba(236, 72, 153, 0.08)', icon: Sparkles },
  stationery: { bg: 'var(--color-batch-d)', glow: 'rgba(249, 115, 22, 0.08)', icon: PenTool },
  'sports-fitness': { bg: 'var(--color-batch-b)', glow: 'rgba(6, 182, 212, 0.08)', icon: Dumbbell },
};

const statusConfig = {
  LIVE: { label: "LIVE", color: "text-green-400 border-green-500/30 bg-green-500/5" },
  ENDING_SOON: { label: "ENDING SOON", color: "text-amber-400 border-amber-500/30 bg-amber-500/5" },
  NEW: { label: "NEW", color: "text-[var(--color-brand)] border-[var(--color-brand)]/30 bg-[var(--color-brand-dim)]" },
  CLOSED: { label: "CLOSED", color: "text-neutral-500 border-neutral-700 bg-neutral-900/50" },
};

export default function BatchCard({ batch, manufacturer, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!e.currentTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  const currentTier = getCurrentTier(batch) || batch.tiers[0];
  const slotsToNext = getSlotsToNextTier(batch) || 0;
  const fillPercent = calculateFillPercent(batch.currentSlots, batch.maxSlots);
  const savingsPercent = getSavingsPercent(batch);
  const nextTier = batch.tiers.find((t) => t.minSlots > batch.currentSlots);

  const endTime = new Date(batch.endTime);
  const now = new Date();
  const diffMs = endTime - now;
  const hoursLeft = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
  const minutesLeft = Math.max(0, Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)));
  const isUrgent = hoursLeft < 6;

  const status = statusConfig[batch.status] || statusConfig.LIVE;
  const catConfig = CATEGORY_MAP[batch.category] || { bg: 'var(--color-batch-b)', glow: 'rgba(59, 130, 246, 0.08)', icon: Compass };
  const CatIcon = catConfig.icon;

  const joinedLast1h = (batch.currentSlots % 5) + 2;

  return (
    <Link
      href={`/batch/${batch.id}`}
      className="group block rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] overflow-hidden text-white transition-all duration-300 hover:border-[var(--color-brand)]/20 relative"
      id={`batch-card-${batch.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(1.02)` 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
        boxShadow: isHovered 
          ? `0 20px 40px rgba(0, 0, 0, 0.5), 0 0 32px ${catConfig.glow}` 
          : 'var(--shadow-card)',
        backgroundImage: `radial-gradient(ellipse at 50% -20%, ${isHovered ? 'var(--color-brand-glow)' : catConfig.glow} 0%, transparent 70%)`
      }}
    >
      {/* Product Image Area */}
      <div 
        className="relative h-40 flex items-center justify-center overflow-hidden border-b border-[var(--color-border)] transition-colors duration-300"
        style={{ backgroundColor: catConfig.bg }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        <div className="w-16 h-16 rounded-xl bg-[var(--color-surface-overlay)] border border-[var(--color-border)] flex items-center justify-center opacity-60">
          <CatIcon className="w-9 h-9 text-white opacity-80 transition-transform duration-300 group-hover:scale-110 shrink-0" />
        </div>

        {/* Status Badge */}
        <div className={`absolute top-4 left-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${status.color}`}>
          {status.label}
        </div>

        {/* Savings Badge */}
        {savingsPercent > 0 && (
          <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-[var(--color-brand)]/20 bg-[var(--color-brand-dim)] text-[var(--color-brand)]">
            Save {savingsPercent}%
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col gap-3">
        {/* Manufacturer Row */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-neutral-950/60 border border-white/5 flex items-center justify-center text-[9px] font-black text-neutral-400 uppercase">
            {manufacturer?.avatar || "MF"}
          </div>
          <span className="text-[11px] text-neutral-400 font-bold truncate flex-1">
            {manufacturer?.name || "Manufacturer"}
          </span>
          {manufacturer?.gstVerified && (
            <span className="w-3.5 h-3.5 rounded-full bg-[var(--color-brand)] flex items-center justify-center text-white" title="GST Verified">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3 className="font-display font-bold text-xs leading-snug text-white line-clamp-2 h-8 text-left">
          {batch.title}
        </h3>

        {/* Momentum Signal */}
        <div className="flex items-center gap-1 text-[10px] text-[var(--color-brand)] font-bold text-left mt-0.5">
          <span>🔥</span>
          <span>{joinedLast1h} joined in the last hour</span>
        </div>

        {/* Pricing Area */}
        <div className="flex flex-col text-left mt-1">
          <span className="text-[9px] font-bold tracking-wider text-neutral-500 uppercase">Current Price</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-mono font-black text-white">
              {formatPrice(currentTier.price, false)}
            </span>
            {savingsPercent > 0 && (
              <span className="text-xs text-neutral-500 line-through font-mono">
                {formatPrice(batch.tiers[0].price, false)}
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar Fill */}
        <div className="flex flex-col gap-1 mt-1">
          <div className="relative h-1 w-full bg-[var(--color-surface-overlay)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--color-brand)] to-orange-400 rounded-full transition-all duration-500 relative"
              style={{ width: `${fillPercent}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>

            {/* Tier tick marks */}
            {batch.tiers.slice(1).map((tier, i) => (
              <div
                key={i}
                className={`absolute top-0 bottom-0 w-0.5 z-10 transition-colors duration-200 ${
                  batch.currentSlots >= tier.minSlots ? "bg-white/40" : "bg-neutral-800"
                }`}
                style={{
                  left: `${(tier.minSlots / batch.maxSlots) * 100}%`,
                }}
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-[9px] text-neutral-400 pt-0.5">
            <span className="font-mono font-semibold text-neutral-500">
              {batch.currentSlots} / {batch.maxSlots} slots
            </span>
            {nextTier && (
              <span className="font-bold text-neutral-300">
                🔥 {slotsToNext} more = {formatPrice(nextTier.price, false)}
              </span>
            )}
          </div>
        </div>

        <div className="h-px bg-white/5 my-1" />

        {/* Card Footer */}
        <div className="flex items-center justify-between">
          {/* Countdown timer */}
          <div className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider ${isUrgent ? "text-red-400" : "text-neutral-500"}`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{hoursLeft}h {minutesLeft}m left</span>
          </div>

          {/* Join CTA */}
          <button className="btn-join text-[10px] font-black uppercase tracking-wider bg-[var(--color-brand)] hover:opacity-90 px-3.5 py-1.5 rounded-lg text-white transition-all transform hover:scale-[1.03]">
            Join →
          </button>
        </div>
      </div>
    </Link>
  );
}
