"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  getBatchById,
  getManufacturerById,
  getCurrentTier,
  getSavingsPercent,
  getTimeRemaining,
  getSlotsToNextTier,
} from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";

function LiveTimer({ endTime }) {
  const [time, setTime] = useState(getTimeRemaining(endTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeRemaining(endTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const isUrgent = time.hours < 6;

  return (
    <div className={`live-timer ${isUrgent ? "live-timer--urgent" : ""}`}>
      <div className="live-timer__segment">
        <span className="live-timer__value">{String(time.hours).padStart(2, "0")}</span>
        <span className="live-timer__label">Hours</span>
      </div>
      <span className="live-timer__sep">:</span>
      <div className="live-timer__segment">
        <span className="live-timer__value">{String(time.minutes).padStart(2, "0")}</span>
        <span className="live-timer__label">Min</span>
      </div>
      <span className="live-timer__sep">:</span>
      <div className="live-timer__segment">
        <span className="live-timer__value">{String(time.seconds).padStart(2, "0")}</span>
        <span className="live-timer__label">Sec</span>
      </div>

      <style jsx>{`
        .live-timer { display: flex; align-items: center; gap: var(--space-2); }
        .live-timer--urgent .live-timer__value { color: var(--accent-warning); animation: urgencyPulse 2s ease-in-out infinite; }
        .live-timer__segment { display: flex; flex-direction: column; align-items: center; min-width: 48px; padding: var(--space-2) var(--space-3); background: var(--bg-elevated); border-radius: var(--radius-md); }
        .live-timer__value { font-family: var(--font-heading), sans-serif; font-size: 1.5rem; font-weight: 800; color: var(--text-primary); font-variant-numeric: tabular-nums; line-height: 1; }
        .live-timer__label { font-size: 0.6rem; color: var(--text-tertiary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px; }
        .live-timer__sep { font-size: 1.2rem; font-weight: 700; color: var(--text-tertiary); margin-top: -10px; }
      `}</style>
    </div>
  );
}

export default function BatchDetailPage({ params }) {
  const resolvedParams = use(params);
  const batch = getBatchById(resolvedParams.id);
  const [selectedQty, setSelectedQty] = useState(1);
  const [showShareModal, setShowShareModal] = useState(false);

  if (!batch) {
    return (
      <>
        <Header />
        <main style={{ paddingTop: "120px", textAlign: "center", minHeight: "60vh" }}>
          <h1>Batch not found</h1>
          <p style={{ color: "var(--text-secondary)" }}>
            This batch may have ended or doesn&apos;t exist.
          </p>
          <Link href="/" className="btn btn--primary" style={{ marginTop: "20px" }}>
            ← Back to Home
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const manufacturer = getManufacturerById(batch.manufacturerId);
  const currentTier = getCurrentTier(batch);
  const savingsPercent = getSavingsPercent(batch);
  const slotsToNext = getSlotsToNextTier(batch);
  const fillPercent = Math.min((batch.currentSlots / batch.maxSlots) * 100, 100);
  const nextTier = batch.tiers.find((t) => t.minSlots > batch.currentSlots);

  return (
    <>
      <Header />
      <main className="batch-detail" id="batch-detail-page">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb animate-fade-in" id="breadcrumb">
            <Link href="/" className="breadcrumb__link">Home</Link>
            <span className="breadcrumb__sep">/</span>
            <Link href="/" className="breadcrumb__link">Batches</Link>
            <span className="breadcrumb__sep">/</span>
            <span className="breadcrumb__current">{batch.title}</span>
          </nav>

          <div className="batch-detail__grid">
            {/* Left Column — Product */}
            <div className="batch-detail__left animate-fade-in-up">
              {/* Product Image */}
              <div className="batch-detail__image" id="product-image">
                <div className="batch-detail__image-placeholder">
                  <span className="batch-detail__image-icon">{batch.categoryIcon || "📦"}</span>
                </div>
                <div className="batch-detail__image-badges">
                  {batch.status === "LIVE" && (
                    <span className="badge badge--success">
                      <span className="badge__dot"></span> LIVE
                    </span>
                  )}
                  {savingsPercent > 0 && (
                    <span className="badge badge--premium">Save {savingsPercent}%</span>
                  )}
                </div>
              </div>

              {/* Manufacturer Info */}
              <div className="mfg-card" id="manufacturer-info">
                <div className="mfg-card__avatar">{manufacturer?.avatar || "MF"}</div>
                <div className="mfg-card__info">
                  <div className="mfg-card__name">
                    {manufacturer?.name}
                    {manufacturer?.gstVerified && (
                      <span className="mfg-card__badge" title="GST Verified">✓ GST Verified</span>
                    )}
                  </div>
                  <div className="mfg-card__meta">
                    📍 {manufacturer?.city}, {manufacturer?.state} · {manufacturer?.yearsInBusiness} yrs ·{" "}
                    ⭐ {manufacturer?.rating}
                  </div>
                </div>
              </div>

              {/* Product Specs */}
              {batch.specs && (
                <div className="specs-card" id="product-specs">
                  <h3 className="specs-card__title">Product Details</h3>
                  <div className="specs-card__grid">
                    {Object.entries(batch.specs).map(([key, value]) => (
                      <div key={key} className="specs-card__item">
                        <span className="specs-card__key">{key}</span>
                        <span className="specs-card__value">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              {batch.reviews && batch.reviews.length > 0 && (
                <div className="reviews-card" id="reviews-section">
                  <h3 className="reviews-card__title">
                    Reviews ({batch.reviews.length})
                  </h3>
                  {batch.reviews.map((review, i) => (
                    <div key={i} className="review">
                      <div className="review__header">
                        <span className="review__user">{review.user}</span>
                        <span className="review__stars">
                          {"⭐".repeat(review.rating)}
                        </span>
                      </div>
                      <p className="review__comment">{review.comment}</p>
                      <span className="review__date">{review.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column — Pricing & Actions */}
            <div className="batch-detail__right">
              <div className="pricing-panel animate-fade-in-up animate-delay-100" id="pricing-panel">
                {/* Title */}
                <h1 className="pricing-panel__title">{batch.title}</h1>
                <p className="pricing-panel__description">{batch.description}</p>

                {/* Timer */}
                <div className="pricing-panel__timer-wrap">
                  <span className="pricing-panel__timer-label">Batch closes in</span>
                  <LiveTimer endTime={batch.endTime} />
                </div>

                {/* Current Price */}
                <div className="pricing-panel__current">
                  <div className="pricing-panel__price-row">
                    <span className="pricing-panel__price">{formatPrice(currentTier.price)}</span>
                    {savingsPercent > 0 && (
                      <span className="pricing-panel__original">{formatPrice(batch.tiers[0].price)}</span>
                    )}
                    {savingsPercent > 0 && (
                      <span className="pricing-panel__savings-badge">-{savingsPercent}%</span>
                    )}
                  </div>
                  <span className="pricing-panel__price-note">per unit · Current batch price</span>
                </div>

                {/* Tier Ladder */}
                <div className="tier-ladder" id="tier-ladder">
                  <h4 className="tier-ladder__title">Price Tiers</h4>
                  {batch.tiers.map((tier, i) => {
                    const isActive = batch.currentSlots >= tier.minSlots && batch.currentSlots <= tier.maxSlots;
                    const isReached = batch.currentSlots >= tier.minSlots;
                    return (
                      <div
                        key={i}
                        className={`tier-ladder__row ${isActive ? "tier-ladder__row--active" : ""} ${isReached ? "tier-ladder__row--reached" : ""}`}
                      >
                        <div className="tier-ladder__indicator">
                          <div className={`tier-ladder__dot ${isReached ? "tier-ladder__dot--filled" : ""}`}>
                            {isReached && "✓"}
                          </div>
                          {i < batch.tiers.length - 1 && (
                            <div className={`tier-ladder__line ${isReached ? "tier-ladder__line--filled" : ""}`}></div>
                          )}
                        </div>
                        <div className="tier-ladder__info">
                          <span className="tier-ladder__range">{tier.minSlots}–{tier.maxSlots} buyers</span>
                          <span className="tier-ladder__price">{formatPrice(tier.price)}</span>
                        </div>
                        {isActive && (
                          <span className="tier-ladder__current-tag">Current</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Progress Bar */}
                <div className="pricing-panel__progress" id="batch-progress">
                  <div className="pricing-panel__progress-header">
                    <span>{batch.currentSlots} of {batch.maxSlots} slots filled</span>
                    <span>{Math.round(fillPercent)}%</span>
                  </div>
                  <div className="pricing-panel__progress-bar">
                    <div
                      className="pricing-panel__progress-fill"
                      style={{ width: `${fillPercent}%` }}
                    ></div>
                  </div>
                  {nextTier && (
                    <div className="pricing-panel__next-tier">
                      🔥 <strong>{slotsToNext} more buyers</strong> needed to drop
                      price to <strong>{formatPrice(nextTier.price)}</strong>
                    </div>
                  )}
                </div>

                {/* Quantity Selector */}
                <div className="pricing-panel__qty" id="qty-selector">
                  <label className="pricing-panel__qty-label">Quantity (slots)</label>
                  <div className="pricing-panel__qty-controls">
                    <button
                      className="pricing-panel__qty-btn"
                      onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                      disabled={selectedQty <= 1}
                    >
                      −
                    </button>
                    <span className="pricing-panel__qty-value">{selectedQty}</span>
                    <button
                      className="pricing-panel__qty-btn"
                      onClick={() => setSelectedQty(selectedQty + 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className="pricing-panel__total">
                    Total: <strong>{formatPrice(currentTier.price * selectedQty)}</strong>
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="pricing-panel__actions">
                  <button className="btn btn--primary btn--lg w-full" id="join-batch-btn">
                    Join This Batch — {formatPrice(currentTier.price * selectedQty)}
                  </button>
                  <button
                    className="btn btn--secondary w-full"
                    onClick={() => setShowShareModal(true)}
                    id="share-batch-btn"
                  >
                    📤 Share to Drop the Price
                  </button>
                </div>

                {/* Trust Signals */}
                <div className="pricing-panel__trust">
                  <div className="pricing-panel__trust-item">🔒 Card held, not charged until batch closes</div>
                  <div className="pricing-panel__trust-item">🔄 Full refund if batch cancels</div>
                  <div className="pricing-panel__trust-item">📦 Ships in {batch.shipping?.estimatedDays || 5}-{(batch.shipping?.estimatedDays || 5) + 2} days</div>
                </div>

                {/* Recent Joiners */}
                {batch.recentJoiners && batch.recentJoiners.length > 0 && (
                  <div className="pricing-panel__joiners">
                    <div className="pricing-panel__joiners-avatars">
                      {batch.recentJoiners.slice(0, 5).map((j, i) => (
                        <span key={i} className="pricing-panel__joiner-avatar">{j.avatar}</span>
                      ))}
                    </div>
                    <span className="pricing-panel__joiners-text">
                      {batch.recentJoiners[0]?.name} and {batch.currentSlots - 1} others joined
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)} id="share-modal">
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal__close" onClick={() => setShowShareModal(false)}>✕</button>
            <h3 className="modal__title">Share This Batch</h3>
            <p className="modal__text">
              Every person who joins through your link drops the price for
              everyone — including you!
            </p>
            <div className="modal__share-options">
              <button className="modal__share-btn modal__share-btn--whatsapp">
                💬 WhatsApp
              </button>
              <button className="modal__share-btn modal__share-btn--copy">
                📋 Copy Link
              </button>
              <button className="modal__share-btn modal__share-btn--twitter">
                𝕏 Twitter
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .batch-detail { padding-top: calc(64px + var(--space-6)); min-height: 100vh; }
        .breadcrumb { display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-6); font-size: 0.8rem; }
        .breadcrumb__link { color: var(--text-tertiary); text-decoration: none; }
        .breadcrumb__link:hover { color: var(--accent-primary); }
        .breadcrumb__sep { color: var(--text-tertiary); }
        .breadcrumb__current { color: var(--text-secondary); font-weight: 500; }

        .batch-detail__grid { display: grid; grid-template-columns: 1fr; gap: var(--space-8); }
        @media (min-width: 768px) { .batch-detail__grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 1024px) { .batch-detail__grid { grid-template-columns: 1.2fr 1fr; gap: var(--space-10); } }

        .batch-detail__image { position: relative; border-radius: var(--radius-xl); overflow: hidden; margin-bottom: var(--space-5); }
        .batch-detail__image-placeholder { height: 320px; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-primary)); display: flex; align-items: center; justify-content: center; }
        .batch-detail__image-icon { font-size: 5rem; opacity: 0.5; }
        .batch-detail__image-badges { position: absolute; top: var(--space-4); left: var(--space-4); display: flex; gap: var(--space-2); }
        .badge__dot { width: 6px; height: 6px; background: currentColor; border-radius: 50%; animation: pulseSoft 1.5s infinite; display: inline-block; margin-right: 4px; }

        /* Manufacturer Card */
        .mfg-card { display: flex; gap: var(--space-4); padding: var(--space-4); background: var(--bg-surface); border: 1px solid var(--border-default); border-radius: var(--radius-lg); margin-bottom: var(--space-5); }
        .mfg-card__avatar { width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--accent-premium-light); color: var(--accent-premium); font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .mfg-card__name { font-weight: 700; font-size: 0.95rem; display: flex; align-items: center; gap: var(--space-2); }
        .mfg-card__badge { font-size: 0.6rem; font-weight: 700; color: var(--accent-primary); background: var(--accent-primary-light); padding: 2px 8px; border-radius: var(--radius-full); }
        .mfg-card__meta { font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px; }

        /* Specs Card */
        .specs-card { padding: var(--space-5); background: var(--bg-surface); border: 1px solid var(--border-default); border-radius: var(--radius-lg); margin-bottom: var(--space-5); }
        .specs-card__title { font-family: var(--font-heading), sans-serif; font-size: 1rem; font-weight: 700; margin: 0 0 var(--space-4); }
        .specs-card__grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }
        .specs-card__item { display: flex; flex-direction: column; gap: 2px; }
        .specs-card__key { font-size: 0.7rem; color: var(--text-tertiary); text-transform: capitalize; font-weight: 600; }
        .specs-card__value { font-size: 0.85rem; color: var(--text-primary); font-weight: 500; }

        /* Reviews */
        .reviews-card { padding: var(--space-5); background: var(--bg-surface); border: 1px solid var(--border-default); border-radius: var(--radius-lg); }
        .reviews-card__title { font-family: var(--font-heading), sans-serif; font-size: 1rem; font-weight: 700; margin: 0 0 var(--space-4); }
        .review { padding: var(--space-3) 0; border-bottom: 1px solid var(--border-light); }
        .review:last-child { border-bottom: none; }
        .review__header { display: flex; justify-content: space-between; margin-bottom: var(--space-1); }
        .review__user { font-weight: 600; font-size: 0.85rem; }
        .review__stars { font-size: 0.75rem; }
        .review__comment { font-size: 0.85rem; color: var(--text-secondary); margin: 0 0 var(--space-1); line-height: 1.5; }
        .review__date { font-size: 0.7rem; color: var(--text-tertiary); }

        /* Pricing Panel - Sticky sidebar */
        .pricing-panel { position: sticky; top: calc(64px + var(--space-4)); padding: var(--space-6); background: var(--bg-surface); border: 1px solid var(--border-default); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); display: flex; flex-direction: column; gap: var(--space-5); }
        .pricing-panel__title { font-family: var(--font-heading), sans-serif; font-size: 1.4rem; font-weight: 800; margin: 0; line-height: 1.3; }
        .pricing-panel__description { font-size: 0.875rem; color: var(--text-secondary); margin: 0; line-height: 1.6; }
        .pricing-panel__timer-wrap { display: flex; flex-direction: column; gap: var(--space-2); }
        .pricing-panel__timer-label { font-size: 0.7rem; color: var(--text-tertiary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }

        /* Current Price */
        .pricing-panel__current { padding: var(--space-4); background: var(--accent-success-light); border-radius: var(--radius-lg); }
        .pricing-panel__price-row { display: flex; align-items: center; gap: var(--space-3); }
        .pricing-panel__price { font-family: var(--font-heading), sans-serif; font-size: 2rem; font-weight: 800; color: var(--accent-success); font-variant-numeric: tabular-nums; }
        .pricing-panel__original { font-size: 1rem; color: var(--text-tertiary); text-decoration: line-through; }
        .pricing-panel__savings-badge { padding: 2px 8px; background: var(--accent-success); color: white; border-radius: var(--radius-full); font-size: 0.7rem; font-weight: 700; }
        .pricing-panel__price-note { font-size: 0.75rem; color: var(--text-secondary); margin-top: var(--space-1); display: block; }

        /* Tier Ladder */
        .tier-ladder__title { font-family: var(--font-heading), sans-serif; font-size: 0.85rem; font-weight: 700; margin: 0 0 var(--space-3); }
        .tier-ladder__row { display: flex; align-items: flex-start; gap: var(--space-3); padding: var(--space-2) var(--space-3); border-radius: var(--radius-md); transition: background var(--transition-fast); }
        .tier-ladder__row--active { background: var(--accent-primary-light); }
        .tier-ladder__indicator { display: flex; flex-direction: column; align-items: center; min-width: 20px; }
        .tier-ladder__dot { width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--border-default); display: flex; align-items: center; justify-content: center; font-size: 0.6rem; color: white; transition: all var(--transition-fast); }
        .tier-ladder__dot--filled { background: var(--accent-success); border-color: var(--accent-success); }
        .tier-ladder__line { width: 2px; height: 16px; background: var(--border-default); }
        .tier-ladder__line--filled { background: var(--accent-success); }
        .tier-ladder__info { display: flex; justify-content: space-between; flex: 1; }
        .tier-ladder__range { font-size: 0.8rem; color: var(--text-secondary); }
        .tier-ladder__price { font-size: 0.85rem; font-weight: 700; color: var(--text-primary); font-variant-numeric: tabular-nums; }
        .tier-ladder__current-tag { font-size: 0.6rem; font-weight: 700; color: var(--accent-primary); background: var(--accent-primary-light); padding: 2px 8px; border-radius: var(--radius-full); white-space: nowrap; }

        /* Progress */
        .pricing-panel__progress-header { display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-secondary); font-weight: 500; margin-bottom: var(--space-2); }
        .pricing-panel__progress-bar { height: 8px; background: var(--bg-elevated); border-radius: var(--radius-full); overflow: hidden; }
        .pricing-panel__progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent-primary), var(--accent-success)); border-radius: var(--radius-full); transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .pricing-panel__next-tier { margin-top: var(--space-2); font-size: 0.8rem; color: var(--accent-warning); padding: var(--space-2) var(--space-3); background: var(--accent-warning-light); border-radius: var(--radius-md); }

        /* Quantity */
        .pricing-panel__qty-label { font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); display: block; margin-bottom: var(--space-2); }
        .pricing-panel__qty-controls { display: flex; align-items: center; gap: var(--space-3); }
        .pricing-panel__qty-btn { width: 36px; height: 36px; border-radius: var(--radius-md); border: 1px solid var(--border-default); background: var(--bg-surface); font-size: 1.1rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all var(--transition-fast); color: var(--text-primary); }
        .pricing-panel__qty-btn:hover { border-color: var(--accent-primary); color: var(--accent-primary); }
        .pricing-panel__qty-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .pricing-panel__qty-value { font-family: var(--font-heading), sans-serif; font-size: 1.2rem; font-weight: 700; min-width: 30px; text-align: center; }
        .pricing-panel__total { font-size: 0.85rem; color: var(--text-secondary); margin-top: var(--space-2); display: block; }
        .pricing-panel__total strong { color: var(--text-primary); }

        /* Actions */
        .pricing-panel__actions { display: flex; flex-direction: column; gap: var(--space-3); }
        .w-full { width: 100%; }

        /* Trust */
        .pricing-panel__trust { display: flex; flex-direction: column; gap: var(--space-2); padding: var(--space-3); background: var(--bg-elevated); border-radius: var(--radius-md); }
        .pricing-panel__trust-item { font-size: 0.75rem; color: var(--text-secondary); }

        /* Joiners */
        .pricing-panel__joiners { display: flex; align-items: center; gap: var(--space-3); }
        .pricing-panel__joiners-avatars { display: flex; }
        .pricing-panel__joiner-avatar { width: 28px; height: 28px; border-radius: 50%; background: var(--bg-elevated); border: 2px solid var(--bg-surface); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; margin-left: -6px; }
        .pricing-panel__joiner-avatar:first-child { margin-left: 0; }
        .pricing-panel__joiners-text { font-size: 0.75rem; color: var(--text-secondary); }

        /* Modal */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: var(--space-4); animation: fadeIn 0.2s ease; }
        .modal { background: var(--bg-surface); border-radius: var(--radius-xl); padding: var(--space-6); max-width: 400px; width: 100%; position: relative; animation: fadeInScale 0.3s ease; }
        .modal__close { position: absolute; top: var(--space-3); right: var(--space-3); width: 32px; height: 32px; border: none; background: var(--bg-elevated); border-radius: var(--radius-md); font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); }
        .modal__title { font-family: var(--font-heading), sans-serif; font-size: 1.2rem; font-weight: 700; margin: 0 0 var(--space-2); }
        .modal__text { font-size: 0.875rem; color: var(--text-secondary); margin: 0 0 var(--space-5); line-height: 1.6; }
        .modal__share-options { display: flex; flex-direction: column; gap: var(--space-2); }
        .modal__share-btn { padding: var(--space-3); border-radius: var(--radius-md); border: 1px solid var(--border-default); background: var(--bg-surface); font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all var(--transition-fast); color: var(--text-primary); }
        .modal__share-btn:hover { background: var(--bg-elevated); }
        .modal__share-btn--whatsapp:hover { background: #dcf8c6; border-color: #25d366; }
      `}</style>
    </>
  );
}
