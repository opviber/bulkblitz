'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import BatchCard from '@/components/batch/BatchCard';
import { CATEGORIES, STATS } from '@/lib/mock-data';

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const activeCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';

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

  const handleCategoryChange = (catId) => {
    const params = new URLSearchParams(window.location.search);
    if (catId === 'all') {
      params.delete('category');
    } else {
      params.set('category', catId);
    }
    router.push(`/?${params.toString()}`);
  };

  const filteredBatches = batches.filter((b) => {
    const matchesCategory = activeCategory === 'all' || b.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && b.status !== 'CLOSED';
  });


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

  const PROOF_CARDS = [
    { k: 'Demand signal', v: 'Buyers reserve slots before production locks.', tone: 'blue' },
    { k: 'Tier unlock', v: 'Every reservation pushes the whole batch closer to factory pricing.', tone: 'green' },
    { k: 'Shared upside', v: 'When the batch closes, everyone pays the final lowest unlocked price.', tone: 'amber' },
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
                onClick={() => handleCategoryChange('all')}
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
                  onClick={() => handleCategoryChange(cat.id)}
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
                  <div className="empty-state__illus">🔍</div>
                  <h3 className="empty-state__title">No matches found</h3>
                  <p className="empty-state__text">
                    {searchQuery 
                      ? `We couldn't find any batches matching "${searchQuery}".`
                      : "No active batches match this filter right now. Try checking other categories!"}
                  </p>
                  {searchQuery && (
                    <button 
                      onClick={() => router.push('/')}
                      className="btn btn--secondary btn--sm"
                      style={{ marginTop: 'var(--space-4)' }}
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        </section>

        {/* ── SECTION 3: WHY IT DROPS ─────────────────────────────────────── */}
        <section className="proof-section" id="price-drop-proof">
          <div className="container">
            <div className="proof-layout">
              <div className="proof-copy">
                <div className="section-hdr__eyebrow">
                  <span className="section-hdr__dot" />
                  Crowd Mechanics
                </div>
                <h2 className="proof-title">One more buyer can drop the price for everyone.</h2>
                <p className="proof-sub">
                  BulkBlitz turns scattered demand into a live manufacturing signal, so buyers see the batch move toward better tiers instead of waiting for opaque wholesale quotes.
                </p>
              </div>
              <div className="proof-cards">
                {PROOF_CARDS.map((card, index) => (
                  <div key={card.k} className={`proof-card proof-card--${card.tone}`}>
                    <span className="proof-card__num">{String(index + 1).padStart(2, '0')}</span>
                    <h3>{card.k}</h3>
                    <p>{card.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: MANUFACTURER CTA ─────────────────────────────────── */}
        <section className="cta-section" id="cta-section">
          <div className="container">
            <div className="cta-card">

              <div className="cta-pattern" aria-hidden="true" />

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

        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        /* ── SECTIONS ────────────────────────────────────────────────────── */
        .section {
          padding: var(--space-20) 0;
        }

        .section--alt {
          background:
            linear-gradient(180deg, color-mix(in srgb, var(--bg-elevated) 92%, #ffffff) 0%, var(--bg-primary) 100%);
        }

        /* ── SECTION HEADER ──────────────────────────────────────────────── */
        .section-hdr {
          margin-bottom: var(--space-8);
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: var(--space-6);
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
          text-wrap: balance;
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
          box-shadow: var(--shadow-sm);
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
          gap: var(--space-6);
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
          background:
            linear-gradient(180deg, color-mix(in srgb, var(--bg-surface) 96%, #ffffff) 0%, var(--bg-surface) 100%);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          cursor: pointer;
          transition: transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base), background var(--transition-base);
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
          background: var(--bg-surface);
        }

        .cat-tile:hover::before {
          opacity: 0.05;
        }

        .cat-tile--active {
          border-color: var(--cat-color, var(--accent-primary));
          background: var(--accent-primary-light);
          box-shadow: 0 0 0 1px var(--cat-color, var(--accent-primary));
          transform: translateY(-2px);
        }

        /* ── PROOF SECTION ──────────────────────────────────────────────── */
        .proof-section {
          padding: var(--space-20) 0;
          background: var(--bg-primary);
        }

        .proof-layout {
          display: grid;
          grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
          gap: var(--space-8);
          align-items: stretch;
        }

        .proof-copy {
          padding: var(--space-8);
          border: 1px solid color-mix(in srgb, var(--accent-primary) 18%, var(--border-default));
          border-radius: var(--radius-2xl);
          background:
            linear-gradient(135deg, color-mix(in srgb, var(--bg-surface) 96%, #ffffff), var(--bg-surface));
          box-shadow: var(--shadow-premium);
        }

        .proof-title {
          max-width: 560px;
          font-family: var(--font-heading), sans-serif;
          font-size: clamp(2rem, 4vw, 3.4rem);
          font-weight: 900;
          line-height: 1;
          letter-spacing: 0;
          margin: 0 0 var(--space-5);
          color: var(--text-primary);
        }

        .proof-sub {
          font-size: 1rem;
          line-height: 1.75;
          color: var(--text-secondary);
          margin: 0;
        }

        .proof-cards {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: var(--space-4);
        }

        .proof-card {
          min-height: 260px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: var(--space-6);
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-default);
          background:
            linear-gradient(180deg, color-mix(in srgb, var(--bg-surface) 94%, #ffffff), var(--bg-surface));
          box-shadow: var(--shadow-premium);
          position: relative;
          overflow: hidden;
        }

        .proof-card::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: 0.13;
          background:
            repeating-linear-gradient(135deg, currentColor 0 1px, transparent 1px 18px);
          pointer-events: none;
        }

        .proof-card--blue { color: var(--accent-primary); }
        .proof-card--green { color: var(--accent-success); }
        .proof-card--amber { color: var(--accent-warning); }

        .proof-card__num {
          position: absolute;
          top: var(--space-5);
          left: var(--space-5);
          font-family: var(--font-heading), sans-serif;
          font-size: 2.4rem;
          font-weight: 900;
          line-height: 1;
          color: currentColor;
          opacity: 0.28;
        }

        .proof-card h3 {
          font-family: var(--font-heading), sans-serif;
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 var(--space-2);
          letter-spacing: 0;
        }

        .proof-card p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.6;
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
          background:
            radial-gradient(circle at 78% 20%, rgba(16, 185, 129, 0.22), transparent 28%),
            linear-gradient(135deg, #0F1117 0%, #172033 50%, #0b111f 100%);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .cta-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.18;
          background-image:
            linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px);
          background-size: 38px 38px;
          pointer-events: none;
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
          .section-hdr {
            display: block;
          }

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

        @media (max-width: 900px) {
          .proof-layout,
          .proof-cards {
            grid-template-columns: 1fr;
          }

          .proof-card {
            min-height: 180px;
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

export default function HomePage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'var(--text-secondary)', background: 'var(--bg-primary)', fontFamily: 'var(--font-sans)' }}>
        Loading BulkBlitz...
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
