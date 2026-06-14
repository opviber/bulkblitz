"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  formatPrice, 
  getCurrentTier, 
  getSavingsPercent, 
  getSlotsToNextTier, 
  calculateFillPercent 
} from "@/lib/utils";

/* ─────────────────────────────────────────────
   Category color palette
───────────────────────────────────────────── */
const CATEGORY_COLORS = {
  'fmcg': { from: '#F59E0B', to: '#EF4444', icon_opacity: 0.9 },
  'electronics': { from: '#3B82F6', to: '#6366F1', icon_opacity: 0.9 },
  'apparel': { from: '#8B5CF6', to: '#EC4899', icon_opacity: 0.9 },
  'home-kitchen': { from: '#10B981', to: '#06B6D4', icon_opacity: 0.9 },
  'agriculture': { from: '#84CC16', to: '#10B981', icon_opacity: 0.9 },
  'personal-care': { from: '#EC4899', to: '#F43F5E', icon_opacity: 0.9 },
  'stationery': { from: '#F97316', to: '#EAB308', icon_opacity: 0.9 },
  'sports-fitness': { from: '#06B6D4', to: '#3B82F6', icon_opacity: 0.9 },
};

/* ─────────────────────────────────────────────
   Status glow / border helpers
───────────────────────────────────────────── */
const statusGlow = {
  LIVE: 'rgba(16, 185, 129, 0.15)',
  ENDING_SOON: 'rgba(245, 158, 11, 0.15)',
  NEW: 'rgba(59, 130, 246, 0.15)',
  CLOSED: 'rgba(0,0,0,0)',
};

const statusBorderColor = {
  LIVE: 'var(--accent-success)',
  ENDING_SOON: 'var(--accent-warning)',
  NEW: 'var(--accent-primary)',
  CLOSED: 'var(--border-default)',
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

  // Calculate tier metrics using central utility library
  const currentTier = getCurrentTier(batch) || batch.tiers[0];
  const slotsToNext = getSlotsToNextTier(batch) || 0;
  const fillPercent = calculateFillPercent(batch.currentSlots, batch.maxSlots);
  const savingsPercent = getSavingsPercent(batch);
  const nextTier = batch.tiers.find((t) => t.minSlots > batch.currentSlots);

  // Time remaining
  const endTime = new Date(batch.endTime);
  const now = new Date();
  const diffMs = endTime - now;
  const hoursLeft = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
  const minutesLeft = Math.max(
    0,
    Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  );
  const isUrgent = hoursLeft < 6;

  const statusConfig = {
    LIVE: { label: "LIVE", color: "var(--accent-success)", bg: "var(--accent-success-light)" },
    ENDING_SOON: { label: "ENDING SOON", color: "var(--accent-warning)", bg: "var(--accent-warning-light)" },
    NEW: { label: "NEW", color: "var(--accent-primary)", bg: "var(--accent-primary-light)" },
    CLOSED: { label: "CLOSED", color: "var(--text-tertiary)", bg: "var(--bg-elevated)" },
  };

  const status = statusConfig[batch.status] || statusConfig.LIVE;
  const catColor = CATEGORY_COLORS[batch.category] || { from: '#3B82F6', to: '#8B5CF6', icon_opacity: 0.9 };

  return (
    <Link
      href={`/batch/${batch.id}`}
      className={`batch-card batch-card--${batch.status.toLowerCase().replace('_', '-')}`}
      id={`batch-card-${batch.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        animationDelay: `${index * 80}ms`,
        transform: isHovered 
          ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(1.02)` 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
        borderColor: isHovered ? statusBorderColor[batch.status] : 'var(--border-default)',
        boxShadow: isHovered 
          ? `0 24px 70px ${statusGlow[batch.status]}, var(--shadow-premium)` 
          : 'var(--shadow-sm)',
        transition: isHovered ? 'box-shadow 0.3s var(--ease-out), border-color 0.3s var(--ease-out)' : 'all 0.5s var(--ease-out)',
      }}
    >
      {/* Image Area */}
      <div 
        className="batch-card__image"
        style={{
          background: `linear-gradient(135deg, ${catColor.from}22, ${catColor.to}44)`,
          backgroundImage: `radial-gradient(circle, ${catColor.from}11 1px, transparent 1px), linear-gradient(135deg, ${catColor.from}22, ${catColor.to}44)`,
          backgroundSize: '24px 24px, 100% 100%'
        }}
      >
        <span 
          className="batch-card__category-icon"
          style={{
            filter: `drop-shadow(0 4px 16px ${catColor.from}66)`,
            opacity: catColor.icon_opacity
          }}
        >
          {batch.categoryIcon || "📦"}
        </span>

        {/* Status Badge */}
        <div
          className="batch-card__status-badge"
          style={{ 
            color: status.color, 
            background: status.bg,
            borderColor: `${status.color}33`
          }}
        >
          {batch.status === "LIVE" && <span className="batch-card__live-dot"></span>}
          {status.label}
        </div>

        {/* Savings Badge */}
        {savingsPercent > 0 && (
          <div className="batch-card__savings-badge">
            Save {savingsPercent}%
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="batch-card__content">
        {/* Manufacturer Row */}
        <div className="batch-card__mfg-row">
          <div 
            className="batch-card__mfg-avatar"
            style={{
              background: `linear-gradient(135deg, ${catColor.from}33, ${catColor.to}33)`,
              color: catColor.from
            }}
          >
            {manufacturer?.avatar || "MF"}
          </div>
          <span className="batch-card__mfg-name">
            {manufacturer?.name || "Manufacturer"}
          </span>
          {manufacturer?.gstVerified && (
            <span className="batch-card__mfg-verified" title="GST Verified">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 1L3.5 6.5L1 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="batch-card__title">{batch.title}</h3>

        {/* Price Section */}
        <div className="batch-card__price-section">
          <span className="batch-card__price-label">Current Price</span>
          <div className="batch-card__price-row">
            <span className="batch-card__price-value">
              {formatPrice(currentTier.price, false)}
            </span>
            {savingsPercent > 0 && (
              <span className="batch-card__price-strike">
                {formatPrice(batch.tiers[0].price, false)}
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="batch-card__progress">
          <div className="batch-card__progress-bar">
            <div
              className="batch-card__progress-fill"
              style={{ width: `${fillPercent}%` }}
            >
              <div className="batch-card__progress-glow"></div>
            </div>
            {/* Tier markers */}
            {batch.tiers.slice(1).map((tier, i) => (
              <div
                key={i}
                className={`batch-card__tier-marker ${
                  batch.currentSlots >= tier.minSlots ? "batch-card__tier-marker--reached" : ""
                }`}
                style={{
                  left: `${(tier.minSlots / batch.maxSlots) * 100}%`,
                }}
                title={`${tier.minSlots} slots = ${formatPrice(tier.price)}`}
              ></div>
            ))}
          </div>
          <div className="batch-card__progress-info">
            <span className="batch-card__slots">
              {batch.currentSlots}/{batch.maxSlots} slots
            </span>
            {nextTier && (
              <span className="batch-card__next-drop">
                🔥 {slotsToNext} more = {formatPrice(nextTier.price, false)}
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="batch-card__footer">
          <div className={`batch-card__timer ${isUrgent ? "batch-card__timer--urgent" : ""}`}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
              <circle cx="6" cy="6" r="5"/>
              <path d="M6 3v3l2 1"/>
            </svg>
            <span>{hoursLeft}h {minutesLeft}m left</span>
          </div>
          
          <div className="batch-card__right-footer">
            <div className="batch-card__joiners">
              {(batch.recentJoiners || []).slice(0, 3).map((j, i) => (
                <div
                  key={i}
                  className="batch-card__joiner-dot"
                  style={{ zIndex: 3 - i }}
                  title={j.name}
                >
                  {j.avatar}
                </div>
              ))}
            </div>
            
            <span className="batch-card__join-btn">
              Join Batch →
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .batch-card {
          display: flex;
          flex-direction: column;
          background:
            linear-gradient(180deg, color-mix(in srgb, var(--bg-surface) 96%, #ffffff) 0%, var(--bg-surface) 100%);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          overflow: hidden;
          text-decoration: none;
          color: var(--text-primary);
          animation: fadeInUp 0.5s ease both;
          cursor: pointer;
          transform-style: preserve-3d;
          min-height: 100%;
          position: relative;
          isolation: isolate;
        }

        .batch-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background:
            linear-gradient(135deg, color-mix(in srgb, var(--accent-primary) 16%, transparent), transparent 38%),
            linear-gradient(315deg, color-mix(in srgb, var(--accent-success) 14%, transparent), transparent 44%);
          opacity: 0;
          pointer-events: none;
          transition: opacity var(--transition-base);
          z-index: 1;
        }

        .batch-card:hover::before {
          opacity: 1;
        }

        .batch-card > * {
          position: relative;
          z-index: 2;
        }

        .batch-card__image {
          position: relative;
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-bottom: 1px solid color-mix(in srgb, var(--border-default) 74%, transparent);
        }

        .batch-card__image::after {
          content: "";
          position: absolute;
          inset: auto 0 0 0;
          height: 46%;
          background: linear-gradient(180deg, transparent, color-mix(in srgb, var(--bg-surface) 58%, transparent));
          pointer-events: none;
        }

        .batch-card__category-icon {
          font-size: 4rem;
          transition: transform var(--transition-base);
          transform: translateZ(34px);
        }

        .batch-card:hover .batch-card__category-icon {
          transform: scale(1.15) rotate(3deg);
        }

        .batch-card__status-badge {
          position: absolute;
          top: var(--space-3);
          left: var(--space-3);
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          border: 1px solid currentColor;
          backdrop-filter: blur(8px);
        }

        .batch-card__live-dot {
          width: 6px;
          height: 6px;
          background: currentColor;
          border-radius: 50%;
          animation: pulseSoft 1.5s ease-in-out infinite;
        }

        .batch-card__savings-badge {
          position: absolute;
          top: var(--space-3);
          right: var(--space-3);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.7rem;
          font-weight: 700;
          color: #34D399;
          background: rgba(52, 211, 153, 0.15);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(52, 211, 153, 0.25);
        }

        .batch-card__content {
          padding: var(--space-4) var(--space-5) var(--space-5);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          flex: 1;
          background:
            linear-gradient(180deg, color-mix(in srgb, var(--bg-surface) 88%, transparent) 0%, var(--bg-surface) 100%);
        }

        .batch-card__mfg-row {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .batch-card__mfg-avatar {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-full);
          font-size: 0.6rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .batch-card__mfg-name {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .batch-card__mfg-verified {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--accent-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .batch-card__title {
          font-family: var(--font-heading), sans-serif;
          font-size: 1rem;
          font-weight: 700;
          line-height: 1.4;
          margin: 0;
          color: var(--text-primary);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.8em;
          letter-spacing: 0;
        }

        .batch-card__price-section {
          display: flex;
          flex-direction: column;
          margin-top: 2px;
        }

        .batch-card__price-label {
          font-size: 0.65rem;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .batch-card__price-row {
          display: flex;
          align-items: baseline;
          gap: var(--space-3);
        }

        .batch-card__price-value {
          font-family: var(--font-heading), sans-serif;
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--accent-success);
          font-variant-numeric: tabular-nums;
          line-height: 1;
          text-shadow: 0 10px 30px color-mix(in srgb, var(--accent-success) 18%, transparent);
        }

        .batch-card__price-strike {
          font-size: 0.9rem;
          color: var(--text-tertiary);
          text-decoration: line-through;
          font-variant-numeric: tabular-nums;
          font-weight: 500;
        }

        .batch-card__progress {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          margin-top: var(--space-1);
        }

        .batch-card__progress-bar {
          position: relative;
          height: 10px;
          background: var(--bg-elevated);
          border-radius: var(--radius-full);
        }

        .batch-card__progress-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-success));
          border-radius: var(--radius-full);
          transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 0 22px color-mix(in srgb, var(--accent-success) 32%, transparent);
        }

        .batch-card__progress-glow {
          position: absolute;
          right: -2px;
          top: -2px;
          width: 14px;
          height: 14px;
          background: var(--accent-success);
          border-radius: 50%;
          box-shadow: 0 0 12px var(--accent-success);
          animation: pulseSoft 2s infinite;
        }

        .batch-card__tier-marker {
          position: absolute;
          top: -3px;
          width: 4px;
          height: 16px;
          background: var(--border-default);
          border-radius: 2px;
          transform: translateX(-50%);
          transition: background var(--transition-base);
        }

        .batch-card__tier-marker--reached {
          background: var(--accent-success);
        }

        .batch-card__progress-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .batch-card__slots {
          font-size: 0.72rem;
          color: var(--text-secondary);
          font-weight: 500;
          font-variant-numeric: tabular-nums;
        }

        .batch-card__next-drop {
          font-size: 0.72rem;
          color: var(--accent-warning);
          font-weight: 600;
          white-space: nowrap;
        }

        .batch-card__footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: var(--space-4);
          border-top: 1px solid var(--border-light);
          margin-top: auto;
        }

        .batch-card__timer {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          color: var(--text-secondary);
          font-weight: 500;
          font-variant-numeric: tabular-nums;
        }

        .batch-card__timer--urgent {
          color: var(--accent-warning);
          animation: urgencyPulse 2s ease-in-out infinite;
        }

        .batch-card__right-footer {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          min-width: 0;
        }

        .batch-card__joiners {
          display: flex;
          align-items: center;
        }

        .batch-card__joiner-dot {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--bg-elevated);
          border: 2px solid var(--bg-surface);
          font-size: 0.6rem;
          font-weight: 600;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: -8px;
          transition: transform var(--transition-fast);
        }

        .batch-card__joiner-dot:first-child {
          margin-left: 0;
        }

        .batch-card__joiners:hover .batch-card__joiner-dot {
          transform: translateX(-2px);
        }

        .batch-card__join-btn {
          border: 1px solid var(--accent-primary);
          color: var(--accent-primary);
          padding: 5px 12px;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 600;
          transition: all var(--transition-fast);
          white-space: nowrap;
        }

        .batch-card:hover .batch-card__join-btn {
          background: var(--accent-primary);
          color: var(--text-inverse);
          box-shadow: var(--shadow-glow-primary);
        }

        @media (max-width: 420px) {
          .batch-card__content {
            padding-inline: var(--space-4);
          }

          .batch-card__progress-info,
          .batch-card__footer {
            align-items: flex-start;
            flex-direction: column;
            gap: var(--space-2);
          }

          .batch-card__right-footer {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </Link>
  );
}
