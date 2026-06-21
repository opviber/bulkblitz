"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { formatPrice } from "@/lib/utils";

export default function ManufacturerAnalytics() {
  const [timeRange, setTimeRange] = useState("30d");

  const analyticsKpis = [
    { label: "Overall Conversion", value: "3.4%", benchmark: "+0.5% vs benchmark", isPositive: true },
    { label: "Average Order Value", value: "₹45,200", benchmark: "+₹3,100 vs last month", isPositive: true },
    { label: "Average Batch Fill Rate", value: "78.2%", benchmark: "+12.1% improvement", isPositive: true },
    { label: "Total Page Views", value: "84,500", benchmark: "-2.4% vs last week", isPositive: false },
  ];

  const topBatches = [
    { title: "Premium Basmati Rice 1kg", category: "FMCG", fill: 92, revenue: 120400 },
    { title: "High-Density Power Bank 10k", category: "Electronics", fill: 84, revenue: 84000 },
    { title: "Pure Organic Seeds Pack", category: "Agriculture", fill: 78, revenue: 38100 },
  ];

  return (
    <>
      <Header />

      <main className="analytics-main">
        <div className="container">
          
          {/* Header */}
          <div className="analytics-header animate-fade-in">
            <div>
              <Link href="/manufacturer" className="back-link">← Back to Dashboard</Link>
              <h1 className="analytics-title">Performance Analytics</h1>
              <p className="analytics-subtitle">Track your crowd-buy conversion metrics, sales channels, and batch fill rate curves.</p>
            </div>
            
            <div className="time-filters">
              {["7d", "30d", "90d", "all"].map((t) => (
                <button
                  key={t}
                  className={`filter-btn ${timeRange === t ? "filter-btn--active" : ""}`}
                  onClick={() => setTimeRange(t)}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="analytics-kpi-grid animate-fade-in-up">
            {analyticsKpis.map((kpi, idx) => (
              <div key={idx} className="kpi-card">
                <span className="kpi-label">{kpi.label}</span>
                <h3 className="kpi-value">{kpi.value}</h3>
                <span className={`kpi-benchmark ${kpi.isPositive ? "kpi-benchmark--positive" : "kpi-benchmark--negative"}`}>
                  {kpi.benchmark}
                </span>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="charts-grid animate-fade-in-up animate-delay-100">
            
            {/* Revenue Trend Area Chart */}
            <div className="chart-card">
              <h3 className="chart-title">Revenue Growth Trend (INR)</h3>
              <div className="svg-chart-container">
                <svg viewBox="0 0 500 200" width="100%" height="100%">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow-line" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.5" strokeDasharray="4" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.5" strokeDasharray="4" />
                  <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.5" strokeDasharray="4" />
                  
                  {/* Area Fill */}
                  <path
                    d="M 0 170 Q 100 130 200 140 T 300 80 T 400 90 T 500 40 L 500 200 L 0 200 Z"
                    fill="url(#chartGrad)"
                  />
                  
                  {/* Trend Line */}
                  <path
                    d="M 0 170 Q 100 130 200 140 T 300 80 T 400 90 T 500 40"
                    fill="none"
                    stroke="var(--accent-primary)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    filter="url(#glow-line)"
                  />
                  
                  {/* Markers */}
                  <circle cx="300" cy="80" r="5" fill="#050505" stroke="var(--accent-primary)" strokeWidth="2.5" />
                  <circle cx="500" cy="40" r="5" fill="#050505" stroke="var(--accent-primary)" strokeWidth="2.5" />
                </svg>
              </div>
              <div className="chart-labels">
                <span>Week 1</span>
                <span>Week 2</span>
                <span>Week 3</span>
                <span>Week 4</span>
              </div>
            </div>

            {/* Fill Rate Bar Chart */}
            <div className="chart-card">
              <h3 className="chart-title">Average Batch Fill Rates</h3>
              <div className="svg-chart-container">
                <svg viewBox="0 0 500 200" width="100%" height="100%">
                  <defs>
                    <linearGradient id="fmcgGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF6B00" />
                      <stop offset="100%" stopColor="#C94E00" />
                    </linearGradient>
                    <linearGradient id="elecGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#6D28D9" />
                    </linearGradient>
                    <linearGradient id="agriGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22C55E" />
                      <stop offset="100%" stopColor="#15803D" />
                    </linearGradient>
                    <linearGradient id="apparelGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#B45309" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.5" strokeDasharray="4" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.5" strokeDasharray="4" />
                  <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.5" strokeDasharray="4" />

                  {/* Bars */}
                  {[
                    { x: 50, h: 140, label: "FMCG", fill: "url(#fmcgGrad)" },
                    { x: 170, h: 110, label: "Elec", fill: "url(#elecGrad)" },
                    { x: 290, h: 160, label: "Agri", fill: "url(#agriGrad)" },
                    { x: 410, h: 80, label: "Apparel", fill: "url(#apparelGrad)" },
                  ].map((bar, bIdx) => (
                    <g key={bIdx}>
                      <rect
                        x={bar.x}
                        y={200 - bar.h}
                        width="40"
                        height={bar.h}
                        rx="6"
                        fill={bar.fill}
                      />
                    </g>
                  ))}
                </svg>
              </div>
              <div className="chart-labels" style={{ paddingInline: "35px" }}>
                <span>FMCG</span>
                <span>Electronics</span>
                <span>Agriculture</span>
                <span>Apparel</span>
              </div>
            </div>

          </div>

          {/* Grid Layout bottom */}
          <div className="analytics-layout-bottom animate-fade-in-up animate-delay-200">
            
            {/* Top performing batches */}
            <div className="card-section">
              <h3 className="section-title mb-6">Top Performing Batches</h3>
              <div className="top-batches-list">
                <div className="batches-table-header">
                  <span>Batch Title</span>
                  <span>Avg Fill Rate</span>
                  <span className="text-right">Revenue Generated</span>
                </div>
                {topBatches.map((batch, bIdx) => (
                  <div key={bIdx} className="batch-performance-row">
                    <div className="batch-meta-info">
                      <h4>{batch.title}</h4>
                      <span className="category-tag">{batch.category}</span>
                    </div>
                    <div className="batch-fill-meter">
                      <div className="fill-bar-track">
                        <div className="fill-bar-fill" style={{ width: `${batch.fill}%` }}></div>
                      </div>
                      <span className="fill-val">{batch.fill}%</span>
                    </div>
                    <span className="batch-revenue text-right">{formatPrice(batch.revenue, false)}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />

      <style jsx>{`
        .analytics-main {
          padding-top: calc(64px + var(--space-8));
          padding-bottom: var(--space-16);
          min-height: calc(100vh - 150px);
          background-color: #050505;
          background-image: radial-gradient(circle at 50% 0%, rgba(255, 107, 0, 0.05) 0%, transparent 50%);
        }

        .analytics-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: var(--space-8);
          flex-wrap: wrap;
          gap: var(--space-4);
        }

        .back-link {
          font-size: 0.85rem;
          color: var(--accent-primary);
          text-decoration: none;
          font-weight: 700;
          display: inline-block;
          margin-bottom: var(--space-2);
          transition: color var(--transition-fast);
        }

        .back-link:hover {
          color: var(--accent-primary-hover);
        }

        .analytics-title {
          font-family: var(--font-heading), sans-serif;
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 var(--space-2);
          letter-spacing: -0.02em;
        }

        .analytics-subtitle {
          color: var(--text-secondary);
          font-size: 1.05rem;
          margin: 0;
        }

        /* Time filter tags */
        .time-filters {
          display: flex;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 3px;
          border-radius: var(--radius-md);
        }

        .filter-btn {
          border: none;
          background: transparent;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          padding: 6px 16px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .filter-btn:hover {
          color: var(--text-primary);
        }

        .filter-btn--active {
          background: var(--accent-primary);
          color: #FFFFFF !important;
          box-shadow: 0 4px 12px rgba(255, 107, 0, 0.25);
        }

        /* KPI section */
        .analytics-kpi-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-4);
          margin-bottom: var(--space-8);
        }

        @media (min-width: 1024px) {
          .analytics-kpi-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .kpi-card {
          background: var(--bg-card-glass);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: var(--radius-lg);
          padding: var(--space-5);
          box-shadow: var(--shadow-premium);
          transition: border-color var(--transition-base), box-shadow var(--transition-base), transform var(--transition-base);
        }

        .kpi-card:hover {
          border-color: var(--border-orange);
          box-shadow: var(--shadow-premium), 0 0 24px rgba(255, 107, 0, 0.08);
          transform: translateY(-2px);
        }

        .kpi-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-secondary);
          display: block;
          margin-bottom: var(--space-2);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .kpi-value {
          font-family: var(--font-heading), sans-serif;
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 4px;
        }

        .kpi-benchmark {
          font-size: 0.75rem;
          font-weight: 600;
        }

        .kpi-benchmark--positive {
          color: var(--accent-success);
        }

        .kpi-benchmark--negative {
          color: var(--accent-danger);
        }

        /* Charts grid */
        .charts-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-6);
          margin-bottom: var(--space-8);
        }

        @media (min-width: 1024px) {
          .charts-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .chart-card {
          background: var(--bg-card-glass);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          box-shadow: var(--shadow-premium);
          transition: border-color var(--transition-base), box-shadow var(--transition-base), transform var(--transition-base);
        }

        .chart-card:hover {
          border-color: var(--border-orange);
          box-shadow: var(--shadow-premium), 0 0 24px rgba(255, 107, 0, 0.08);
          transform: translateY(-2px);
        }

        .chart-title {
          font-family: var(--font-heading), sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0 0 var(--space-4);
          color: var(--text-primary);
        }

        .svg-chart-container {
          height: 200px;
          position: relative;
        }

        .chart-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--text-tertiary);
          margin-top: var(--space-3);
          font-weight: 600;
        }

        /* Batches performance table section */
        .card-section {
          background: var(--bg-card-glass);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          box-shadow: var(--shadow-premium);
          transition: border-color var(--transition-base), box-shadow var(--transition-base);
        }

        .card-section:hover {
          border-color: var(--border-orange);
          box-shadow: var(--shadow-premium), 0 0 32px rgba(255, 107, 0, 0.06);
        }

        .section-title {
          font-family: var(--font-heading), sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .top-batches-list {
          display: flex;
          flex-direction: column;
        }

        .batches-table-header {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-tertiary);
          padding-bottom: var(--space-3);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .batch-performance-row {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr;
          align-items: center;
          padding: var(--space-4) 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          gap: var(--space-4);
          transition: background-color var(--transition-fast);
        }

        .batch-performance-row:hover {
          background-color: rgba(255, 255, 255, 0.02);
        }

        .batch-performance-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .batch-meta-info h4 {
          font-family: var(--font-heading), sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          margin: 0 0 2px;
          color: var(--text-primary);
        }

        .category-tag {
          font-size: 0.7rem;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.06);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          font-weight: 500;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .batch-fill-meter {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .fill-bar-track {
          flex: 1;
          height: 6px;
          background-color: rgba(255, 255, 255, 0.06);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .fill-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-success));
          border-radius: var(--radius-full);
        }

        .fill-val {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          width: 32px;
          font-variant-numeric: tabular-nums;
        }

        .batch-revenue {
          font-family: var(--font-heading), sans-serif;
          font-weight: 700;
          color: var(--accent-success);
        }
      `}</style>
    </>
  );
}
