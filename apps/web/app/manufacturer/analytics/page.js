"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, TrendingUp, Coins, Percent, Eye, BarChart3 } from "lucide-react";

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

      <main className="pt-24 pb-16 min-h-screen bg-black text-white font-sans bg-[radial-gradient(circle_at_center_top,rgba(255,107,0,0.03),transparent_50%)]">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
            <div>
              <Link href="/manufacturer" className="text-xs text-primary hover:text-primary-hover font-bold inline-flex items-center gap-1 mb-2 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
              </Link>
              <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Performance Analytics</h1>
              <p className="text-sm text-neutral-400">Track your crowd-buy conversion metrics, sales channels, and batch fill rate curves.</p>
            </div>
            
            <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl shrink-0">
              {["7d", "30d", "90d", "all"].map((t) => (
                <button
                  key={t}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${timeRange === t ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-neutral-400 hover:text-white"}`}
                  onClick={() => setTimeRange(t)}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {analyticsKpis.map((kpi, idx) => {
              const Icon = [TrendingUp, Coins, Percent, Eye][idx] || BarChart3;
              return (
                <div key={idx} className="p-5 bg-white/[0.02] border border-white/5 hover:border-primary/20 backdrop-blur-xl rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{kpi.label}</span>
                    <Icon className="w-4 h-4 text-primary opacity-80" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-1.5">{kpi.value}</h3>
                  <span className={`text-[10px] font-bold ${kpi.isPositive ? "text-green-400" : "text-red-400"}`}>
                    {kpi.benchmark}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Revenue Trend Area Chart */}
            <div className="p-6 bg-white/[0.02] border border-white/5 hover:border-primary/20 backdrop-blur-xl rounded-2xl shadow-xl transition-all">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Revenue Growth Trend (INR)</h3>
              <div className="h-[200px] relative">
                <svg viewBox="0 0 500 200" width="100%" height="100%">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#FF6B00" stopOpacity="0" />
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
                    stroke="#FF6B00"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    filter="url(#glow-line)"
                  />
                  
                  {/* Markers */}
                  <circle cx="300" cy="80" r="5" fill="#050505" stroke="#FF6B00" strokeWidth="2.5" />
                  <circle cx="500" cy="40" r="5" fill="#050505" stroke="#FF6B00" strokeWidth="2.5" />
                </svg>
              </div>
              <div className="flex justify-between text-[10px] text-neutral-500 font-bold uppercase tracking-wider mt-3">
                <span>Week 1</span>
                <span>Week 2</span>
                <span>Week 3</span>
                <span>Week 4</span>
              </div>
            </div>

            {/* Fill Rate Bar Chart */}
            <div className="p-6 bg-white/[0.02] border border-white/5 hover:border-primary/20 backdrop-blur-xl rounded-2xl shadow-xl transition-all">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Average Batch Fill Rates</h3>
              <div className="h-[200px] relative">
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
                    <rect
                      key={bIdx}
                      x={bar.x}
                      y={200 - bar.h}
                      width="40"
                      height={bar.h}
                      rx="6"
                      fill={bar.fill}
                    />
                  ))}
                </svg>
              </div>
              <div className="flex justify-between px-[35px] text-[10px] text-neutral-500 font-bold uppercase tracking-wider mt-3">
                <span>FMCG</span>
                <span>Electronics</span>
                <span>Agriculture</span>
                <span>Apparel</span>
              </div>
            </div>

          </div>

          {/* Top performing batches */}
          <div className="p-6 bg-white/[0.02] border border-white/5 hover:border-primary/20 backdrop-blur-xl rounded-2xl shadow-xl transition-all">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Top Performing Batches</h3>
            <div className="flex flex-col">
              <div className="grid grid-cols-3 font-bold text-[10px] uppercase tracking-wider text-neutral-500 pb-3 border-b border-white/5">
                <span>Batch Title</span>
                <span>Avg Fill Rate</span>
                <span className="text-right">Revenue Generated</span>
              </div>
              {topBatches.map((batch, bIdx) => (
                <div key={bIdx} className="grid grid-cols-3 items-center py-4 border-b border-white/5 last:border-b-0 last:pb-0 hover:bg-white/[0.01] transition-colors rounded-xl px-2">
                  <div className="flex flex-col gap-1">
                    <h4 className="font-bold text-sm text-white">{batch.title}</h4>
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                        {batch.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#FF6B00] to-green-500 rounded-full" style={{ width: `${batch.fill}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-neutral-300 w-8 tabular-nums">{batch.fill}%</span>
                  </div>
                  <span className="text-sm font-bold text-green-400 text-right tabular-nums">{formatPrice(batch.revenue, false)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
