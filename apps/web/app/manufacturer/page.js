"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { BATCHES, MANUFACTURERS } from "@/lib/mock-data";
import { formatPrice, calculateFillPercent } from "@/lib/utils";

export default function ManufacturerDashboard() {
  // Use first manufacturer as our dashboard scope
  const manufacturer = MANUFACTURERS[0] || {
    id: "mfr-001",
    name: "Sharma Industries",
    city: "Nagpur",
    state: "Maharashtra",
    rating: 4.8,
  };

  // Get active batches for this manufacturer
  const activeBatches = BATCHES.filter(
    (b) => b.manufacturerId === manufacturer.id && b.status !== "CLOSED"
  );

  const kpis = [
    {
      label: "Active Batches",
      value: activeBatches.length || "3",
      trend: "Stable",
      isPositive: true,
      icon: "📦",
    },
    {
      label: "Total Revenue",
      value: "₹2,42,500",
      trend: "+18.4% this month",
      isPositive: true,
      icon: "💰",
    },
    {
      label: "Avg. Fill Rate",
      value: "78.2%",
      trend: "+4.1% vs last qtr",
      isPositive: true,
      icon: "📈",
    },
    {
      label: "Repeat Buyers",
      value: "34.5%",
      trend: "+2.3% improvement",
      isPositive: true,
      icon: "👥",
    },
  ];

  const activities = [
    {
      time: "2 hours ago",
      text: "Batch #002 'Chana Dal 1kg' hit Tier 2 pricing (₹62/unit) with 45 slots filled.",
      type: "milestone",
    },
    {
      time: "5 hours ago",
      text: "New reservation: 15 slots booked by Rajesh K., Mumbai.",
      type: "order",
    },
    {
      time: "Yesterday",
      text: "Payout of ₹82,400 initiated for closed Batch #001.",
      type: "payout",
    },
    {
      time: "3 days ago",
      text: "Batch #003 'Organic Turmeric' created and is now LIVE.",
      type: "batch_created",
    },
  ];

  return (
    <>
      <Header />

      <main className="mfr-main">
        <div className="container">
          
          {/* Welcome Banner */}
          <div className="welcome-banner animate-fade-in">
            <div className="welcome-banner__orb welcome-banner__orb--1"></div>
            <div className="welcome-banner__orb welcome-banner__orb--2"></div>
            <div className="welcome-banner__content">
              <span className="banner-context">MANUFACTURER PORTAL</span>
              <h1 className="welcome-title">Welcome back, {manufacturer.name}</h1>
              <p className="welcome-desc">
                Your batches are performing well. You have unlocked ₹2.4L in revenue this month.
              </p>
              <div className="welcome-meta">
                <span className="meta-tag">📍 {manufacturer.city}, {manufacturer.state}</span>
                <span className="meta-tag">⭐ {manufacturer.rating} Rating</span>
                <span className="meta-tag">🛡️ GST Verified</span>
              </div>
            </div>
          </div>

          {/* KPI Dashboard Grid */}
          <div className="kpi-grid animate-fade-in-up">
            {kpis.map((kpi, idx) => (
              <div key={idx} className="kpi-card">
                <div className="kpi-card__header">
                  <span className="kpi-label">{kpi.label}</span>
                  <span className="kpi-icon">{kpi.icon}</span>
                </div>
                <h3 className="kpi-value">{kpi.value}</h3>
                <span className={`kpi-trend ${kpi.isPositive ? "kpi-trend--up" : "kpi-trend--down"}`}>
                  {kpi.isPositive ? "↑ " : "↓ "} {kpi.trend}
                </span>
              </div>
            ))}
          </div>

          {/* Main Dashboard Layout */}
          <div className="mfr-layout">
            
            {/* Left Column: Active Batches */}
            <div className="mfr-layout__left animate-fade-in-up animate-delay-100">
              <div className="card-section">
                <div className="card-section__header">
                  <h3 className="section-title">My Active Batches</h3>
                  <Link href="/manufacturer/batch/new" className="btn btn--primary btn--sm" id="create-batch-link">
                    + New Batch
                  </Link>
                </div>

                <div className="batch-list">
                  {activeBatches.length === 0 ? (
                    <div className="empty-batches">
                      <p>You don&apos;t have any active batches at the moment.</p>
                      <Link href="/manufacturer/batch/new" className="btn btn--secondary btn--sm mt-4">
                        Create Your First Batch
                      </Link>
                    </div>
                  ) : (
                    activeBatches.map((batch) => {
                      const fillPercent = calculateFillPercent(batch.currentSlots, batch.maxSlots);
                      
                      return (
                        <div key={batch.id} className="mfr-batch-card">
                          <div className="mfr-batch-card__header">
                            <div>
                              <h4>{batch.title}</h4>
                              <span className="category-tag">{batch.category}</span>
                            </div>
                            <div className="batch-status-badge">{batch.status}</div>
                          </div>
                          
                          <div className="mfr-batch-card__progress">
                            <div className="progress-labels">
                              <span>Slots Filled: <strong>{batch.currentSlots}</strong> / {batch.maxSlots}</span>
                              <span>{fillPercent}% Filled</span>
                            </div>
                            <div className="progress-track">
                              <div 
                                className="progress-bar-fill" 
                                style={{ width: `${fillPercent}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="mfr-batch-card__pricing">
                            <span className="pricing-label">Current Pricing Tier</span>
                            <div className="pricing-tiers">
                              {batch.tiers.map((tier, tIdx) => {
                                const isUnlocked = batch.currentSlots >= tier.minSlots;
                                return (
                                  <div 
                                    key={tIdx} 
                                    className={`pricing-tier ${isUnlocked ? "pricing-tier--unlocked" : ""}`}
                                  >
                                    <span className="tier-range">{tier.minSlots}+{isUnlocked ? " ✓" : ""}</span>
                                    <span className="tier-price">{formatPrice(tier.price, false)}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Actions & Activity */}
            <div className="mfr-layout__right animate-fade-in-up animate-delay-200">
              
              {/* Quick Actions */}
              <div className="card-section mb-6">
                <h3 className="section-title">Quick Actions</h3>
                <div className="actions-list">
                  <Link href="/manufacturer/batch/new" className="action-item">
                    <span className="action-icon">➕</span>
                    <div>
                      <h5>Create New Batch</h5>
                      <p>Launch a new group buy catalog item</p>
                    </div>
                  </Link>
                  <Link href="#" className="action-item">
                    <span className="action-icon">💳</span>
                    <div>
                      <h5>View Payouts</h5>
                      <p>Track closed batch payouts & bank settlement status</p>
                    </div>
                  </Link>
                  <Link href="#" className="action-item">
                    <span className="action-icon">📊</span>
                    <div>
                      <h5>Analytics Hub</h5>
                      <p>Detailed performance, buyers statistics & trends</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="card-section">
                <h3 className="section-title">Recent Activity</h3>
                <div className="activity-timeline">
                  {activities.map((act, idx) => (
                    <div key={idx} className="timeline-item">
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <span className="timeline-time">{act.time}</span>
                        <p className="timeline-text">{act.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .mfr-main {
          padding-top: calc(64px + var(--space-8));
          padding-bottom: var(--space-16);
          min-height: calc(100vh - 150px);
          background-color: #050505;
        }

        /* Welcome Banner Card styling */
        .welcome-banner {
          background: linear-gradient(135deg, rgba(255, 107, 0, 0.12) 0%, rgba(12, 12, 12, 0.88) 100%);
          border-radius: var(--radius-xl);
          padding: var(--space-8);
          position: relative;
          overflow: hidden;
          color: white;
          border: 1px solid rgba(255, 107, 0, 0.28);
          box-shadow: 0 8px 32px rgba(255, 107, 0, 0.14), var(--shadow-premium);
          margin-bottom: var(--space-8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .welcome-banner__orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(50px);
          opacity: 0.2;
        }

        .welcome-banner__orb--1 {
          width: 250px;
          height: 250px;
          background: var(--accent-primary);
          top: -50px;
          right: -50px;
        }

        .welcome-banner__orb--2 {
          width: 200px;
          height: 200px;
          background: #FF9A3C;
          bottom: -50px;
          left: 30%;
        }

        .welcome-banner__content {
          position: relative;
          z-index: 1;
        }

        .banner-context {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--accent-primary);
          text-transform: uppercase;
          display: block;
          margin-bottom: var(--space-1);
        }

        .welcome-title {
          font-family: var(--font-heading), sans-serif;
          font-size: 2rem;
          font-weight: 800;
          margin: 0 0 var(--space-2);
          letter-spacing: -0.02em;
        }

        .welcome-desc {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 var(--space-4);
          max-width: 600px;
        }

        .welcome-meta {
          display: flex;
          gap: var(--space-4);
          flex-wrap: wrap;
        }

        .meta-tag {
          font-size: 0.8rem;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 4px 12px;
          border-radius: var(--radius-full);
          font-weight: 500;
        }

        /* KPI Grid */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-4);
          margin-bottom: var(--space-8);
        }

        @media (min-width: 1024px) {
          .kpi-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .kpi-card {
          background: rgba(12, 12, 12, 0.82);
          border: 1px solid rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: var(--radius-lg);
          padding: var(--space-5);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          transition: all var(--transition-base);
        }

        .kpi-card:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 107, 0, 0.25);
          box-shadow: 0 8px 32px rgba(255, 107, 0, 0.12);
        }

        .kpi-card__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-2);
        }

        .kpi-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .kpi-icon {
          font-size: 1.25rem;
        }

        .kpi-value {
          font-family: var(--font-heading), sans-serif;
          font-size: clamp(1.4rem, 2.5vw, 1.8rem);
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 2px;
        }

        .kpi-trend {
          font-size: 0.75rem;
          font-weight: 600;
        }

        .kpi-trend--up {
          color: var(--accent-success);
        }

        .kpi-trend--down {
          color: var(--accent-danger);
        }

        /* Layout Grid */
        .mfr-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-8);
        }

        @media (min-width: 1024px) {
          .mfr-layout {
            grid-template-columns: 3.2fr 2fr;
          }
        }

        .card-section {
          background: rgba(12, 12, 12, 0.82);
          border: 1px solid rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .card-section__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-6);
        }

        .section-title {
          font-family: var(--font-heading), sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .section-title::before {
          content: '';
          display: block;
          width: 3px;
          height: 14px;
          background: var(--accent-primary);
          border-radius: 2px;
        }

        /* Mfr Active Batch Card */
        .batch-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .mfr-batch-card {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.02);
          border-radius: var(--radius-lg);
          padding: var(--space-5);
          transition: all var(--transition-base);
        }

        .mfr-batch-card:hover {
          border-color: rgba(255, 107, 0, 0.25);
          background: rgba(255, 255, 255, 0.04);
        }

        .mfr-batch-card__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--space-4);
        }

        .mfr-batch-card__header h4 {
          font-family: var(--font-heading), sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0 0 2px;
          color: var(--text-primary);
        }

        .category-tag {
          font-size: 0.75rem;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.05);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          font-weight: 500;
        }

        .batch-status-badge {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--accent-primary);
          background: rgba(255, 107, 0, 0.12);
          border: 1px solid rgba(255, 107, 0, 0.25);
          padding: 2px 8px;
          border-radius: var(--radius-full);
          text-transform: uppercase;
        }

        .mfr-batch-card__progress {
          margin-bottom: var(--space-4);
        }

        .progress-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: var(--space-2);
        }

        .progress-track {
          height: 8px;
          background-color: rgba(255, 255, 255, 0.07);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-success));
          border-radius: var(--radius-full);
        }

        .mfr-batch-card__pricing {
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding-top: var(--space-3);
        }

        .pricing-label {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          display: block;
          margin-bottom: var(--space-2);
        }

        .pricing-tiers {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-2);
        }

        .pricing-tier {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--space-2);
          border: 1px solid rgba(255, 255, 255, 0.08);
          background-color: rgba(255, 255, 255, 0.03);
          border-radius: var(--radius-md);
          font-size: 0.8rem;
          transition: all var(--transition-fast);
        }

        .pricing-tier--unlocked {
          border-color: var(--accent-success);
          background-color: rgba(34, 197, 94, 0.12);
          color: #22C55E;
          font-weight: 600;
        }

        .tier-range {
          font-size: 0.7rem;
          opacity: 0.8;
        }

        .tier-price {
          font-family: var(--font-heading), sans-serif;
          font-weight: 700;
        }

        /* Quick actions list */
        .actions-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .action-item {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          padding: var(--space-3) var(--space-4);
          border: 1px solid rgba(255, 255, 255, 0.08);
          background-color: rgba(255, 255, 255, 0.02);
          border-radius: var(--radius-lg);
          text-decoration: none;
          transition: all var(--transition-base);
        }

        .action-item:hover {
          border-color: var(--accent-primary);
          background-color: rgba(255, 107, 0, 0.06);
          transform: translateX(4px);
        }

        .action-icon {
          font-size: 1.5rem;
          background-color: rgba(255, 255, 255, 0.05);
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all var(--transition-base);
        }

        .action-item:hover .action-icon {
          background-color: rgba(255, 107, 0, 0.12);
        }

        .action-item h5 {
          font-family: var(--font-heading), sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          margin: 0 0 2px;
          color: var(--text-primary);
        }

        .action-item p {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin: 0;
        }

        /* Activity Timeline */
        .activity-timeline {
          display: flex;
          flex-direction: column;
          position: relative;
          padding-left: var(--space-4);
        }

        .activity-timeline::before {
          content: "";
          position: absolute;
          top: 8px;
          left: 4px;
          bottom: 8px;
          width: 2px;
          background-color: rgba(255, 255, 255, 0.08);
        }

        .timeline-item {
          display: flex;
          position: relative;
          padding-bottom: var(--space-4);
        }

        .timeline-item:last-child {
          padding-bottom: 0;
        }

        .timeline-marker {
          position: absolute;
          left: -16px;
          top: 6px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: var(--text-tertiary);
          border: 2px solid #0f0f0f;
          z-index: 2;
        }

        .timeline-item:first-child .timeline-marker {
          background-color: var(--accent-primary);
          box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.25);
        }

        .timeline-content {
          padding-left: var(--space-2);
        }

        .timeline-time {
          font-size: 0.7rem;
          color: var(--text-tertiary);
          display: block;
          margin-bottom: 2px;
        }

        .timeline-text {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.4;
        }

        .empty-batches {
          text-align: center;
          padding: var(--space-8) 0;
          color: var(--text-secondary);
        }
      `}</style>
    </>
  );
}
