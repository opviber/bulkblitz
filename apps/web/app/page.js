"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import BatchCard from "@/components/batch/BatchCard";
import {
  CATEGORIES,
  STATS,
} from "@/lib/mock-data";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("trending");
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBatches() {
      try {
        const res = await fetch("/api/batches");
        if (res.ok) {
          const data = await res.json();
          setBatches(data);
        }
      } catch (err) {
        console.error("Failed to load batches:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBatches();
  }, []);

  const filteredBatches =
    activeCategory === "all"
      ? batches.filter((b) => b.status !== "CLOSED")
      : batches.filter(
          (b) => b.category === activeCategory && b.status !== "CLOSED"
        );

  const getTrending = () => {
    return [...batches].sort((a, b) => (b.velocity || 0) - (a.velocity || 0));
  };

  const getEnding = () => {
    return [...batches]
      .filter((b) => b.status === "LIVE")
      .sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
  };

  const getNew = () => {
    return [...batches].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const tabBatches = {
    trending: getTrending(),
    ending: getEnding(),
    new: getNew(),
  };

  const currentTabBatches = tabBatches[activeTab] || getTrending();

  return (
    <>
      <Header />

      <main>
        <HeroSection stats={STATS} />

        {/* Featured Batches Section */}
        <section className="section" id="batches">
          <div className="container">
            {/* Section Header with Tabs */}
            <div className="section__header">
              <div className="section__header-left">
                <h2 className="section__title">
                  Live Batches
                  <span className="section__title-badge">
                    {batches.filter((b) => b.status === "LIVE").length} active
                  </span>
                </h2>
                <p className="section__subtitle">
                  Join a batch, share with friends, and watch the price drop in
                  real time
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="tabs" id="batch-tabs">
              <button
                className={`tabs__btn ${activeTab === "trending" ? "tabs__btn--active" : ""}`}
                onClick={() => setActiveTab("trending")}
                id="tab-trending"
              >
                🔥 Trending
              </button>
              <button
                className={`tabs__btn ${activeTab === "ending" ? "tabs__btn--active" : ""}`}
                onClick={() => setActiveTab("ending")}
                id="tab-ending"
              >
                ⏰ Ending Soon
              </button>
              <button
                className={`tabs__btn ${activeTab === "new" ? "tabs__btn--active" : ""}`}
                onClick={() => setActiveTab("new")}
                id="tab-new"
              >
                ✨ New
              </button>
            </div>

            {/* Featured Grid */}
            <div className="batch-grid batch-grid--featured">
              {loading ? (
                Array(4)
                  .fill(0)
                  .map((_, idx) => (
                    <div key={idx} className="skeleton-card skeleton" style={{ height: "360px", borderRadius: "var(--radius-lg)" }}></div>
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
                <p className="empty-text">No active batches available.</p>
              )}
            </div>
          </div>
        </section>

        {/* Category Browse Section */}
        <section className="section section--alt" id="categories-section">
          <div className="container">
            <div className="section__header">
              <div className="section__header-left">
                <h2 className="section__title">Browse by Category</h2>
                <p className="section__subtitle">
                  Find batches in your favorite product categories
                </p>
              </div>
            </div>

            {/* Category Chips */}
            <div className="category-chips" id="category-filters">
              <button
                className={`chip ${activeCategory === "all" ? "chip--active" : ""}`}
                onClick={() => setActiveCategory("all")}
                id="chip-all"
              >
                🌟 All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`chip ${activeCategory === cat.id ? "chip--active" : ""}`}
                  onClick={() => setActiveCategory(cat.id)}
                  id={`chip-${cat.id}`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>

            {/* Filtered Batch Grid */}
            <div className="batch-grid">
              {loading ? (
                Array(4)
                  .fill(0)
                  .map((_, idx) => (
                    <div key={idx} className="skeleton-card skeleton" style={{ height: "360px", borderRadius: "var(--radius-lg)" }}></div>
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
                  <div className="empty-state__icon">📦</div>
                  <h3 className="empty-state__title">No batches yet</h3>
                  <p className="empty-state__text">
                    No active batches in this category right now. Check back soon
                    or browse other categories!
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section cta-section" id="cta-section">
          <div className="container">
            <div className="cta-card">
              <div className="cta-card__bg">
                <div className="cta-card__orb cta-card__orb--1"></div>
                <div className="cta-card__orb cta-card__orb--2"></div>
              </div>
              <div className="cta-card__content">
                <h2 className="cta-card__title">
                  Are You a Manufacturer?
                </h2>
                <p className="cta-card__text">
                  List your products, set your bulk tiers, and let India&apos;s
                  buyers fill your order book. First batch is free. 4% fee only
                  on successful batches.
                </p>
                <div className="cta-card__actions">
                  <a
                    href="/manufacturer"
                    className="btn btn--primary btn--lg"
                    id="cta-manufacturer"
                  >
                    Start Selling →
                  </a>
                  <div className="cta-card__stats">
                    <span className="cta-card__stat">
                      💰 Payout in 3 days
                    </span>
                    <span className="cta-card__stat">
                      📊 Only 4% fee
                    </span>
                    <span className="cta-card__stat">
                      🆓 First batch free
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .section {
          padding: var(--space-12) 0;
        }

        .section--alt {
          background: var(--bg-elevated);
        }

        .section__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--space-6);
        }

        .section__title {
          font-family: var(--font-heading), sans-serif;
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 var(--space-2);
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .section__title-badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          background: var(--accent-success-light);
          color: var(--accent-success);
          font-size: 0.7rem;
          font-weight: 700;
          border-radius: var(--radius-full);
          font-family: var(--font-body), sans-serif;
        }

        .section__subtitle {
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin: 0;
          max-width: 500px;
        }

        /* Tabs */
        .tabs {
          display: flex;
          gap: var(--space-2);
          margin-bottom: var(--space-6);
          overflow-x: auto;
          padding-bottom: var(--space-2);
          -webkit-overflow-scrolling: touch;
        }

        .tabs__btn {
          padding: var(--space-2) var(--space-5);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-full);
          background: var(--bg-surface);
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all var(--transition-fast);
        }

        .tabs__btn:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }

        .tabs__btn--active {
          background: var(--accent-primary);
          color: white;
          border-color: var(--accent-primary);
        }

        /* Category Chips */
        .category-chips {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
          margin-bottom: var(--space-6);
        }

        /* Batch Grid */
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

        /* Empty State */
        .empty-state {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--space-12) var(--space-6);
          text-align: center;
        }

        .empty-state__icon {
          font-size: 3rem;
          margin-bottom: var(--space-4);
          opacity: 0.6;
        }

        .empty-state__title {
          font-family: var(--font-heading), sans-serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 var(--space-2);
        }

        .empty-state__text {
          font-size: 0.9rem;
          color: var(--text-secondary);
          max-width: 400px;
          margin: 0;
        }

        /* CTA Section */
        .cta-section {
          padding: var(--space-12) 0 var(--space-4);
        }

        .cta-card {
          position: relative;
          overflow: hidden;
          border-radius: var(--radius-2xl);
          padding: var(--space-10) var(--space-8);
          background: linear-gradient(135deg, #0F1117, #1A1B2E);
          color: white;
        }

        .cta-card__bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .cta-card__orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.3;
        }

        .cta-card__orb--1 {
          width: 300px;
          height: 300px;
          background: #0D6EFD;
          top: -50px;
          right: -50px;
          animation: float 6s ease-in-out infinite;
        }

        .cta-card__orb--2 {
          width: 250px;
          height: 250px;
          background: #8B5CF6;
          bottom: -80px;
          left: 20%;
          animation: float 8s ease-in-out infinite reverse;
        }

        .cta-card__content {
          position: relative;
          z-index: 1;
          max-width: 600px;
        }

        .cta-card__title {
          font-family: var(--font-heading), sans-serif;
          font-size: clamp(1.5rem, 3vw, 2.2rem);
          font-weight: 800;
          margin: 0 0 var(--space-4);
          line-height: 1.2;
        }

        .cta-card__text {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.7;
          margin: 0 0 var(--space-6);
        }

        .cta-card__actions {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .cta-card__stats {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-4);
        }

        .cta-card__stat {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
        }
      `}</style>
    </>
  );
}
