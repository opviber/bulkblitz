"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Clock } from "lucide-react";
import { 
  formatPrice, 
  getCurrentTier, 
  getSavingsPercent, 
  getSlotsToNextTier, 
  calculateFillPercent 
} from "@/lib/utils";

const CATEGORY_COLORS = {
  'fmcg': { from: 'from-amber-500/10', to: 'to-red-500/20', border: 'hover:border-amber-500/30', glow: 'rgba(245, 158, 11, 0.15)', text: 'text-amber-400' },
  'electronics': { from: 'from-blue-500/10', to: 'to-indigo-500/20', border: 'hover:border-blue-500/30', glow: 'rgba(59, 130, 246, 0.15)', text: 'text-blue-400' },
  'apparel': { from: 'from-purple-500/10', to: 'to-pink-500/20', border: 'hover:border-purple-500/30', glow: 'rgba(139, 92, 246, 0.15)', text: 'text-purple-400' },
  'home-kitchen': { from: 'from-emerald-500/10', to: 'to-cyan-500/20', border: 'hover:border-emerald-500/30', glow: 'rgba(16, 185, 129, 0.15)', text: 'text-emerald-400' },
  'agriculture': { from: 'from-lime-500/10', to: 'to-emerald-500/20', border: 'hover:border-lime-500/30', glow: 'rgba(132, 204, 22, 0.15)', text: 'text-lime-400' },
  'personal-care': { from: 'from-pink-500/10', to: 'to-rose-500/20', border: 'hover:border-pink-500/30', glow: 'rgba(236, 72, 153, 0.15)', text: 'text-pink-400' },
  'stationery': { from: 'from-orange-500/10', to: 'to-yellow-500/20', border: 'hover:border-orange-500/30', glow: 'rgba(249, 115, 22, 0.15)', text: 'text-orange-400' },
  'sports-fitness': { from: 'from-cyan-500/10', to: 'to-blue-500/20', border: 'hover:border-cyan-500/30', glow: 'rgba(6, 182, 212, 0.15)', text: 'text-cyan-400' },
};

const statusBorderColor = {
  LIVE: 'hover:border-green-500/30',
  ENDING_SOON: 'hover:border-amber-500/30',
  NEW: 'hover:border-primary/30',
  CLOSED: 'hover:border-white/10',
};

const statusConfig = {
  LIVE: { label: "LIVE", color: "text-green-400 border-green-500/30 bg-green-500/5" },
  ENDING_SOON: { label: "ENDING SOON", color: "text-amber-400 border-amber-500/30 bg-amber-500/5" },
  NEW: { label: "NEW", color: "text-primary border-primary/30 bg-primary/5" },
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
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
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
  const catColor = CATEGORY_COLORS[batch.category] || { from: 'from-blue-500/10', to: 'to-indigo-500/20', border: 'hover:border-blue-500/30', glow: 'rgba(59, 130, 246, 0.15)', text: 'text-blue-400' };

  return (
    <Link
      href={`/batch/${batch.id}`}
      className={`group block rounded-2xl border border-white/5 bg-neutral-900/40 backdrop-blur-md overflow-hidden text-white transition-all duration-300 ${catColor.border} ${statusBorderColor[batch.status]}`}
      id={`batch-card-${batch.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(1.02)` 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
        boxShadow: isHovered 
          ? `0 20px 40px ${catColor.glow}, 0 4px 30px rgba(0, 0, 0, 0.4)` 
          : '0 4px 20px rgba(0, 0, 0, 0.2)',
      }}
    >
      {/* Product Image Banner */}
      <div className={`relative h-44 flex items-center justify-center overflow-hidden bg-gradient-to-br ${catColor.from} ${catColor.to} border-b border-white/5`}>
        <span className="text-6xl transition-transform duration-300 group-hover:scale-115 group-hover:rotate-3 drop-shadow-[0_4px_16px_rgba(255,106,0,0.15)]">
          {batch.categoryIcon || "📦"}
        </span>

        {/* Status Badge */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${status.color}`}>
          {status.label}
        </div>

        {/* Savings Badge */}
        {savingsPercent > 0 && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold border border-primary/20 bg-primary/10 text-primary">
            Save {savingsPercent}%
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col gap-4">
        {/* Manufacturer Profile */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-neutral-950/60 border border-white/5 flex items-center justify-center text-[10px] font-bold text-neutral-400">
            {manufacturer?.avatar || "MF"}
          </div>
          <span className="text-xs text-neutral-400 font-medium truncate flex-1">
            {manufacturer?.name || "Manufacturer"}
          </span>
          {manufacturer?.gstVerified && (
            <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-white" title="GST Verified">
              <svg width="8" height="6" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 1L3.5 6.5L1 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-sm leading-snug text-white line-clamp-2 h-10">
          {batch.title}
        </h3>

        {/* Pricing Info */}
        <div className="flex flex-col">
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

        {/* Progress Bar & Demand Meter */}
        <div className="flex flex-col gap-1.5">
          <div className="relative h-2 w-full bg-neutral-950/60 border border-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 relative"
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
                title={`${tier.minSlots} slots = ${formatPrice(tier.price)}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-[10px] text-neutral-400">
            <span className="font-mono font-medium">
              {batch.currentSlots} / {batch.maxSlots} slots
            </span>
            {nextTier && (
              <span className="font-bold text-neutral-300">
                🔥 {slotsToNext} more = {formatPrice(nextTier.price, false)}
              </span>
            )}
          </div>
        </div>

        <div className="h-px bg-white/5" />

        {/* Card Footer */}
        <div className="flex items-center justify-between">
          {/* Countdown timer */}
          <div className={`flex items-center gap-1.5 text-[10px] font-bold ${isUrgent ? "text-danger" : "text-neutral-400"}`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{hoursLeft}h {minutesLeft}m left</span>
          </div>

          {/* Join CTA & Avatars */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5 overflow-hidden">
              {(batch.recentJoiners || []).slice(0, 3).map((j, i) => (
                <div
                  key={i}
                  className="inline-block w-5 h-5 rounded-full border border-neutral-900 bg-neutral-800 text-[8px] font-bold flex items-center justify-center text-neutral-300"
                  title={j.name}
                >
                  {j.avatar}
                </div>
              ))}
            </div>
            <span className="text-[10px] font-bold tracking-wide uppercase text-primary group-hover:translate-x-1 transition-transform duration-200">
              Join →
            </span>
          </div>
        </div>

      </div>
    </Link>
  );
}
