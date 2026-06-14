'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import BatchCard from '@/components/batch/BatchCard';
import { CATEGORIES, STATS } from '@/lib/mock-data';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('trending');
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBatches() {
      try {
        const res = await fetch('/api/batches');
        if (res.ok) {
          const data = await res.json();
          setBatches(data);
        }
      } catch (err) {
        console.error('Failed to load batches:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBatches();
  }, []);

  const filteredBatches =
    activeCategory === 'all'
      ? batches.filter((b) => b.status !== 'CLOSED')
      : batches.filter(
          (b) => b.category === activeCategory && b.status !== 'CLOSED'
        );

  const getTrending = () => {
    return [...batches].sort((a, b) => (b.velocity || 0) - (a.velocity || 0));
  };

  const getEnding = () => {
    return [...batches]
      .filter((b) => b.status === 'LIVE')
      .sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
  };

  const getNew = () => {
    return [...batches].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  };

  const tabBatches = {
    trending: getTrending(),
    ending: getEnding(),
    new: getNew(),
  };

  const currentTabBatches = tabBatches[activeTab] || getTrending();
  const liveCount = batches.filter((b) => b.status === 'LIVE').length;

  const TABS = [
    { id: 'trending', icon: '🔥', label: 'Trending' },
    { id: 'ending',   icon: '⏰', label: 'Ending Soon' },
    { id: 'new',      icon: '✨', label: 'New' },
  ];

  const CTA_FEATURES = [
    'First batch completely free',
    'Only 4% fee on successful batches',
    'Payout within 3 business days',
    'GST invoice auto-generated',
  ];

  const CTA_STATS = [
    { v: '₹0',  l: 'Upfront Cost' },
    { v: '4%',  l: 'Success Fee' },
    { v: '3d',  l: 'Payout Time' },
    { v: '320+',l: 'Active Sellers' },
  ];

  return (
    <>
      <Header />

      <main>
        <HeroSection stats={STATS} />

        {/* ── SECTION 1: LIVE BATCHES ─────────────────────────────────────── */}
        <section className="section" id="batches">
          <div className="container">

            {/* Section Header */}
            <div className="section-hdr">
              <div>
                <div className="section-hdr__eyebrow">
                  <span className="section-hdr__dot" />
                  Live Now
                </div>
                <h2 className="section-hdr__title">
                  Active Batches
                  <span className="section-hdr__badge">{liveCount} live</span>
                </h2>
                <p className="section-hdr__sub">
                  Join a batch and watch the price fall in real time
                </p>
              </div>
            </div>

            {/* Segmented Tab Control */}
            <div className="seg-tabs" role="tablist" id="batch-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  className={`seg-tab${activeTab === tab.id ? ' seg-tab--active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Batch Grid */}
            <div className="batch-grid batch-grid--featured">
              {loading ? (
                Array(4).fill(0).map((_, idx) => (
                  <div
                    key={idx}
                    className="skeleton-card skeleton"
                    style={{ height: '360px', borderRadius: 'var(--radius-lg)' }}
                  />
                ))
              ) : currentTabBatches.length > 0 ? (
                currentTabBatches.slice(0, 4).map((batch, i) => (
                  <BatchCard
                    key={batch.id}
                    batch={batch}
                    manufacturer={batch.manufacturer}
                    index={i}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-state__illus">📭</div>
                  <h3 className="empty-state__title">Nothing here yet</h3>
                  <p className="empty-state__text">
                    No batches match this filter right now. Try another tab or check back soon!
                  </p>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* ── SECTION 2: BROWSE BY CATEGORY ───────────────────────────────── */}
        <section className="section section--alt" id="categories-section">
          <div className="container">

            {/* Section Header */}
            <div className="section-hdr">
              <div>
                <div className="section-hdr__eyebrow">
                  <span className="section-hdr__dot section-hdr__dot--purple" />
                  Explore
                </div>
                <h2 className="section-hdr__title">Browse by Category</h2>
                <p className="section-hdr__sub">
                  Find batches in your favorite product categories
                </p>
              </div>
            </div>

            {/* Category Tiles */}
            <div className="cat-tiles" id="category-filters">
              <button
                className={`cat-tile${activeCategory === 'all' ? ' cat-tile--active' : ''}`}
                onClick={() => setActiveCategory('all')}
                id="chip-all"
              >
                <span className="cat-tile__icon">🌟</span>
                <span className="cat-tile__name">All</span>
                <span className="cat-tile__count">{batches.length}</span>
              </button>

              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  id={`chip-${cat.id}`}
                  className={`cat-tile${activeCategory === cat.id ? ' cat-tile--active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{ '--cat-color': cat.color }}
                >
                  <span className="cat-tile__icon">{cat.icon}</span>
                  <span className="cat-tile__name">{cat.name}</span>
                  <span className="cat-tile__count">{cat.count}</span>
                </button>
              ))}
            </div>

            {/* Filtered Batch Grid */}
            <div className="batch-grid">
              {loading ? (
                Array(4).fill(0).map((_, idx) => (
                  <div
                    key={idx}
                    className="skeleton-card skeleton"
                    style={{ height: '360px', borderRadius: 'var(--radius-lg)' }}
                  />
                ))
              ) : filteredBatches.length > 0 ? (
                filteredBatches.map((batch, i) => (
                  <BatchCard
                    key={batch.id}
                    batch={batch}
                    manufacturer={batch.manufacturer}
                    index={i}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-state__illus">📦</div>
                  <h3 className="empty-state__title">No batches yet</h3>
                  <p className="empty-state__text">
                    No active batches in this category right now. Check back soon or browse other categories!
                  </p>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* ── SECTION 3: MANUFACTURER CTA ─────────────────────────────────── */}
        <section className="cta-section" id="cta-section">
          <div className="container">
            <div className="cta-card">

              {/* Background orbs */}
              <div className="cta-orb cta-orb--1" />
              <div className="cta-orb cta-orb--2" />

              {/* Split layout */}
              <div className="cta-layout">

                {/* Left: copy */}
                <div className="cta-left">
                  <span className="cta-eyebrow">🏭 For Manufacturers</span>
                  <h2 className="cta-title">
                    Scale your production.<br />Fill your order book.
                  </h2>
                  <div className="cta-features">
                    {CTA_FEATURES.map((f) => (
                      <div key={f} className="cta-feature">
                        <span className="cta-check">✓</span>
                        {f}
                      </div>
                    ))}
                  </div>
                  <a
                    href="/manufacturer"
                    className="btn btn--primary btn--lg cta-btn"
                    id="cta-manufacturer"
                  >
                    Start Selling Today →
                  </a>
                </div>

                {/* Right: stats */}
                <div className="cta-right">
                  <div className="cta-stats">
                    {CTA_STATS.map((s) => (
                      <div key={s.l} className="cta-stat">
                        <span className="cta-stat__val">{s.v}</span>
                        <span className="cta-stat__label">{s.l}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        /* ── KEYFRAMES ────────────────────────────────────────────────────── */
        @keyframes pulseSoft {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.85); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          33%       { transform: translateY(-18px) scale(1.03); }
          66%       { transform: translateY(10px) scale(0.97); }
        }

        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        /* ── SECTIONS ────────────────────────────────────────────────────── */
        .section {
          padding: var(--space-16) 0;
        }

        .section--alt {
          background: var(--bg-elevated);
        }

        /* ── SECTION HEADER ──────────────────────────────────────────────── */
        .section-hdr {
          margin-bottom: var(--space-8);
        }

        .section-hdr__eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-tertiary);
          margin-bottom: var(--space-3);
        }

        .section-hdr__dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent-success);
          flex-shrink: 0;
          animation: pulseSoft 2s ease-in-out infinite;
        }

        .section-hdr__dot--purple {
          background: var(--accent-premium);
        }

        .section-hdr__title {
          font-family: var(--font-heading), sans-serif;
          font-size: clamp(1.5rem, 3vw, 2.2rem);
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 var(--space-2);
          display: flex;
          align-items: center;
          gap: var(--space-3);
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .section-hdr__badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 12px;
          background: var(--accent-success-light);
          color: var(--accent-success);
          font-size: 0.7rem;
          font-weight: 700;
          border-radius: var(--radius-full);
          font-family: var(--font-body), sans-serif;
          letter-spacing: 0;
          text-transform: none;
        }

        .section-hdr__sub {
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin: 0;
          max-width: 520px;
        }

        /* ── SEGMENTED TABS ──────────────────────────────────────────────── */
        .seg-tabs {
          display: flex;
          gap: var(--space-2);
          margin-bottom: var(--space-6);
          background: var(--bg-elevated);
          padding: var(--space-1);
          border-radius: var(--radius-xl);
          width: fit-content;
          border: 1px solid var(--border-default);
        }

        .seg-tab {
          padding: var(--space-2) var(--space-5);
          border-radius: var(--radius-lg);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
          border: none;
          background: transparent;
          color: var(--text-secondary);
          white-space: nowrap;
          line-height: 1.5;
        }

        .seg-tab:hover:not(.seg-tab--active) {
          color: var(--text-primary);
          background: rgba(0, 0, 0, 0.04);
        }

        .seg-tab--active {
          background: var(--bg-surface);
          color: var(--text-primary);
          box-shadow: var(--shadow-sm);
        }

        /* ── BATCH GRID ──────────────────────────────────────────────────── */
        .batch-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--space-5);
        }

        .batch-grid--featured {
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }

        @media (min-width: 1024px) {
          .batch-grid--featured {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        /* ── CATEGORY TILES ──────────────────────────────────────────────── */
        .cat-tiles {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: var(--space-3);
          margin-bottom: var(--space-8);
        }

        .cat-tile {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-4) var(--space-3);
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          cursor: pointer;
          transition: all var(--transition-base);
          position: relative;
          overflow: hidden;
        }

        .cat-tile::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--cat-color, var(--accent-primary));
          opacity: 0;
          transition: opacity var(--transition-base);
          border-radius: inherit;
        }

        .cat-tile:hover {
          border-color: var(--cat-color, var(--accent-primary));
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          background: var(--bg-elevated);
        }

        .cat-tile:hover::before {
          opacity: 0.05;
        }

        .cat-tile--active {
          border-color: var(--cat-color, var(--accent-primary));
          background: var(--accent-primary-light);
          box-shadow: 0 0 0 1px var(--cat-color, var(--accent-primary));
        }

        .cat-tile--active::before {
          opacity: 0.06;
        }

        .cat-tile__icon {
          font-size: 1.75rem;
          line-height: 1;
          position: relative;
          z-index: 1;
          transition: transform var(--transition-spring);
        }

        .cat-tile:hover .cat-tile__icon {
          transform: scale(1.15);
        }

        .cat-tile__name {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-primary);
          text-align: center;
          position: relative;
          z-index: 1;
          line-height: 1.3;
        }

        .cat-tile--active .cat-tile__name {
          color: var(--cat-color, var(--accent-primary));
        }

        .cat-tile__count {
          font-size: 0.65rem;
          color: var(--text-tertiary);
          font-weight: 500;
          position: relative;
          z-index: 1;
        }

        /* ── EMPTY STATE ─────────────────────────────────────────────────── */
        .empty-state {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--space-16) var(--space-6);
          text-align: center;
        }

        .empty-state__illus {
          font-size: 4rem;
          margin-bottom: var(--space-5);
          opacity: 0.55;
          filter: grayscale(20%);
          line-height: 1;
        }

        .empty-state__title {
          font-family: var(--font-heading), sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 var(--space-2);
          letter-spacing: -0.01em;
        }

        .empty-state__text {
          font-size: 0.9rem;
          color: var(--text-secondary);
          max-width: 380px;
          margin: 0;
          line-height: 1.65;
        }

        /* ── CTA SECTION ─────────────────────────────────────────────────── */
        .cta-section {
          padding: var(--space-16) 0;
        }

        .cta-card {
          position: relative;
          overflow: hidden;
          border-radius: var(--radius-2xl);
          padding: var(--space-12) var(--space-10);
          background: linear-gradient(135deg, #0F1117 0%, #1A1B2E 50%, #111827 100%);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .cta-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
          pointer-events: none;
        }

        .cta-orb--1 {
          width: 350px;
          height: 350px;
          background: #0D6EFD;
          top: -100px;
          right: -50px;
          animation: float 8s ease-in-out infinite;
        }

        .cta-orb--2 {
          width: 280px;
          height: 280px;
          background: #8B5CF6;
          bottom: -80px;
          left: 30%;
          animation: float 10s ease-in-out infinite reverse;
        }

        .cta-layout {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: var(--space-10);
        }

        @media (min-width: 768px) {
          .cta-layout {
            flex-direction: row;
            align-items: center;
          }
        }

        .cta-left {
          flex: 1;
          min-width: 0;
        }

        .cta-right {
          flex-shrink: 0;
        }

        .cta-eyebrow {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.55);
          display: block;
          margin-bottom: var(--space-4);
        }

        .cta-title {
          font-family: var(--font-heading), sans-serif;
          font-size: clamp(1.5rem, 3vw, 2.2rem);
          font-weight: 800;
          margin: 0 0 var(--space-6);
          color: white;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .cta-features {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          margin-bottom: var(--space-8);
        }

        .cta-feature {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        .cta-check {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(52, 211, 153, 0.18);
          color: #34D399;
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-weight: 800;
        }

        .cta-btn {
          background: linear-gradient(135deg, #0D6EFD 0%, #7C3AED 100%);
          border: none;
          color: white;
          transition: opacity var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);
        }

        .cta-btn:hover {
          opacity: 0.92;
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(124, 58, 237, 0.4);
        }

        .cta-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-4);
          min-width: 280px;
        }

        .cta-stat {
          display: flex;
          flex-direction: column;
          padding: var(--space-4) var(--space-5);
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition: background var(--transition-fast), border-color var(--transition-fast);
        }

        .cta-stat:hover {
          background: rgba(255, 255, 255, 0.09);
          border-color: rgba(255, 255, 255, 0.18);
        }

        .cta-stat__val {
          font-family: var(--font-heading), sans-serif;
          font-size: 1.75rem;
          font-weight: 800;
          color: white;
          line-height: 1;
          letter-spacing: -0.03em;
        }

        .cta-stat__label {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.48);
          font-weight: 500;
          margin-top: var(--space-1);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* ── RESPONSIVE TWEAKS ───────────────────────────────────────────── */
        @media (max-width: 640px) {
          .seg-tabs {
            width: 100%;
            justify-content: stretch;
          }
          .seg-tab {
            flex: 1;
            text-align: center;
            padding: var(--space-2) var(--space-3);
            font-size: 0.78rem;
          }

          .cat-tiles {
            grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
          }

          .cta-card {
            padding: var(--space-8) var(--space-5);
          }

          .cta-stats {
            min-width: unset;
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .section-hdr__title {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </>
  );
}
