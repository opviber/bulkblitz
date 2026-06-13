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

  return (
    <Link
      href={`/batch/${batch.id}`}
      className="batch-card"
      id={`batch-card-${batch.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        animationDelay: `${index * 80}ms`,
        transform: isHovered ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(1.02)` : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
        transition: isHovered ? 'box-shadow 0.3s ease, border-color 0.3s ease' : 'all 0.5s ease',
      }}
    >
      {/* Image Section */}
      <div className="batch-card__image">
        <div className="batch-card__image-placeholder">
          <span className="batch-card__category-icon">
            {batch.categoryIcon || "📦"}
          </span>
        </div>

        {/* Status Badge */}
        <div
          className="batch-card__status"
          style={{ color: status.color, background: status.bg }}
        >
          {batch.status === "LIVE" && <span className="batch-card__live-dot"></span>}
          {status.label}
        </div>

        {/* Savings Badge */}
        {savingsPercent > 0 && (
          <div className="batch-card__savings">
            Save {savingsPercent}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="batch-card__content">
        {/* Manufacturer */}
        <div className="batch-card__manufacturer">
          <div className="batch-card__mfg-avatar">
            {manufacturer?.avatar || "MF"}
          </div>
          <span className="batch-card__mfg-name">
            {manufacturer?.name || "Manufacturer"}
          </span>
          {manufacturer?.gstVerified && (
            <span className="batch-card__verified" title="GST Verified">✓</span>
          )}
        </div>

        {/* Title */}
        <h3 className="batch-card__title">{batch.title}</h3>

        {/* Price Section */}
        <div className="batch-card__pricing">
          <div className="batch-card__current-price">
            <span className="batch-card__price-label">Current Price</span>
            <span className="batch-card__price-value">
              {formatPrice(currentTier.price)}
            </span>
          </div>
          {savingsPercent > 0 && (
            <div className="batch-card__original-price">
              <span className="batch-card__price-strike">
                {formatPrice(batch.tiers[0].price)}
              </span>
            </div>
          )}
        </div>

        {/* Tier Progress */}
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
                🔥 {slotsToNext} more = {formatPrice(nextTier.price)}
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="batch-card__footer">
          <div className={`batch-card__timer ${isUrgent ? "batch-card__timer--urgent" : ""}`}>
            ⏱ {hoursLeft}h {minutesLeft}m left
          </div>
          <div className="batch-card__joiners">
            <div className="batch-card__joiner-avatars">
              {(batch.recentJoiners || []).slice(0, 3).map((j, i) => (
                <div
                  key={i}
                  className="batch-card__joiner-dot"
                  style={{ animationDelay: `${i * 150}ms` }}
                  title={j.name}
                >
                  {j.avatar}
                </div>
              ))}
            </div>
            {batch.currentSlots > 3 && (
              <span className="batch-card__joiner-count">
                +{batch.currentSlots - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .batch-card {
          display: flex;
          flex-direction: column;
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          overflow: hidden;
          text-decoration: none;
          color: var(--text-primary);
          transition: all var(--transition-base);
          animation: fadeInUp 0.5s ease both;
          cursor: pointer;
          transform-style: preserve-3d;
        }

        .batch-card:hover {
          box-shadow: var(--shadow-xl);
          border-color: var(--accent-primary);
        }

        .batch-card__image {
          position: relative;
          height: 160px;
          overflow: hidden;
        }

        .batch-card__image-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            var(--bg-elevated) 0%,
            var(--bg-primary) 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .batch-card__category-icon {
          font-size: 3rem;
          opacity: 0.6;
          transition: transform var(--transition-base);
        }

        .batch-card:hover .batch-card__category-icon {
          transform: scale(1.15);
        }

        .batch-card__status {
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
          backdrop-filter: blur(10px);
        }

        .batch-card__live-dot {
          width: 6px;
          height: 6px;
          background: currentColor;
          border-radius: 50%;
          animation: pulseSoft 1.5s ease-in-out infinite;
        }

        .batch-card__savings {
          position: absolute;
          top: var(--space-3);
          right: var(--space-3);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--accent-success);
          background: var(--accent-success-light);
          backdrop-filter: blur(10px);
        }

        .batch-card__content {
          padding: var(--space-4) var(--space-5) var(--space-5);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          flex: 1;
        }

        .batch-card__manufacturer {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .batch-card__mfg-avatar {
          width: 22px;
          height: 22px;
          border-radius: var(--radius-sm);
          background: var(--accent-premium-light);
          color: var(--accent-premium);
          font-size: 0.55rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .batch-card__mfg-name {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .batch-card__verified {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--accent-primary);
          color: white;
          font-size: 0.55rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .batch-card__title {
          font-family: var(--font-heading), sans-serif;
          font-size: 1rem;
          font-weight: 700;
          line-height: 1.3;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .batch-card__pricing {
          display: flex;
          align-items: flex-end;
          gap: var(--space-3);
        }

        .batch-card__current-price {
          display: flex;
          flex-direction: column;
        }

        .batch-card__price-label {
          font-size: 0.65rem;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .batch-card__price-value {
          font-family: var(--font-heading), sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--accent-success);
          font-variant-numeric: tabular-nums;
          line-height: 1;
        }

        .batch-card__price-strike {
          font-size: 0.85rem;
          color: var(--text-tertiary);
          text-decoration: line-through;
          font-variant-numeric: tabular-nums;
        }

        .batch-card__progress {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .batch-card__progress-bar {
          position: relative;
          height: 6px;
          background: var(--bg-elevated);
          border-radius: var(--radius-full);
          overflow: visible;
        }

        .batch-card__progress-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-success));
          border-radius: var(--radius-full);
          transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .batch-card__progress-glow {
          position: absolute;
          right: -2px;
          top: -3px;
          width: 12px;
          height: 12px;
          background: var(--accent-success);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--accent-success), 0 0 20px rgba(16, 185, 129, 0.3);
          animation: pulseSoft 2s ease-in-out infinite;
        }

        .batch-card__tier-marker {
          position: absolute;
          top: -3px;
          width: 3px;
          height: 12px;
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
          color: var(--text-tertiary);
          font-weight: 500;
          font-variant-numeric: tabular-nums;
        }

        .batch-card__next-drop {
          font-size: 0.7rem;
          color: var(--accent-warning);
          font-weight: 600;
        }

        .batch-card__footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: var(--space-3);
          border-top: 1px solid var(--border-light);
          margin-top: auto;
        }

        .batch-card__timer {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 500;
          font-variant-numeric: tabular-nums;
        }

        .batch-card__timer--urgent {
          color: var(--accent-warning);
          animation: urgencyPulse 2s ease-in-out infinite;
        }

        .batch-card__joiners {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .batch-card__joiner-avatars {
          display: flex;
        }

        .batch-card__joiner-dot {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--bg-elevated);
          border: 2px solid var(--bg-surface);
          font-size: 0.6rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: -6px;
          animation: avatarPop 0.3s ease both;
        }

        .batch-card__joiner-dot:first-child {
          margin-left: 0;
        }

        .batch-card__joiner-count {
          font-size: 0.7rem;
          color: var(--text-tertiary);
          font-weight: 600;
        }
      `}</style>
    </Link>
  );
}
