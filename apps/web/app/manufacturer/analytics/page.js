"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { 
  ArrowLeft, TrendingUp, Coins, Percent, Eye, BarChart3, 
  Users, Package, Download, RefreshCw, ArrowUpRight, 
  ArrowDownRight, ShieldCheck, Calendar, Filter
} from "lucide-react";

const REVENUE_POINTS = [
  { week: "Wk 1", revenue: 38000, orders: 12 },
  { week: "Wk 2", revenue: 62000, orders: 19 },
  { week: "Wk 3", revenue: 54000, orders: 17 },
  { week: "Wk 4", revenue: 91000, orders: 28 },
  { week: "Wk 5", revenue: 74000, orders: 23 },
  { week: "Wk 6", revenue: 120000, orders: 37 },
];

const FILL_RATES = [
  { category: "FMCG",        pct: 92, color: "from-[#FF6B00] to-[#C94E00]" },
  { category: "Electronics", pct: 78, color: "from-violet-500 to-violet-700" },
  { category: "Agriculture", pct: 84, color: "from-green-500 to-green-700" },
  { category: "Apparel",     pct: 61, color: "from-amber-500 to-amber-700" },
];

const TOP_BATCHES = [
  { title: "Premium Basmati Rice 1kg",      category: "FMCG",        fill: 92, revenue: 120400, buyers: 188, trend: "up" },
  { title: "High-Density Power Bank 10k",   category: "Electronics", fill: 84, revenue: 84000,  buyers: 142, trend: "up" },
  { title: "Pure Organic Seeds Pack",       category: "Agriculture", fill: 78, revenue: 38100,  buyers: 96,  trend: "down" },
  { title: "Handloom Cotton Kurta (XL)",    category: "Apparel",     fill: 61, revenue: 22800,  buyers: 58,  trend: "down" },
];

const CHANNEL_DATA = [
  { label: "Direct (Homepage)",      pct: 48, color: "#FF6B00" },
  { label: "Referral / Share Link",  pct: 27, color: "#8B5CF6" },
  { label: "WhatsApp Group",         pct: 15, color: "#22c55e" },
  { label: "Search & Discovery",     pct: 10, color: "#F59E0B" },
];

export default function ManufacturerAnalytics() {
  const [timeRange, setTimeRange] = useState("30d");

  const kpis = [
    {
      label: "Overall Conversion",
      value: "3.4%",
      benchmark: "+0.5% vs last month",
      isPositive: true,
      icon: TrendingUp,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Avg. Order Value",
      value: "₹45,200",
      benchmark: "+₹3,100 vs prev period",
      isPositive: true,
      icon: Coins,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      label: "Avg. Fill Rate",
      value: "78.2%",
      benchmark: "+12.1% improvement",
      isPositive: true,
      icon: Percent,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      label: "Page Views",
      value: "84,500",
      benchmark: "-2.4% vs last week",
      isPositive: false,
      icon: Eye,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
  ];

  // SVG area chart path computation
  const maxRev = Math.max(...REVENUE_POINTS.map((p) => p.revenue));
  const W = 500, H = 180;
  const pts = REVENUE_POINTS.map((p, i) => ({
    x: (i / (REVENUE_POINTS.length - 1)) * W,
    y: H - (p.revenue / maxRev) * (H - 20),
  }));
  const linePath = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
  const areaPath = `${linePath} L ${W} ${H} L 0 ${H} Z`;

  return (
    <>


      <main className="pt-24 pb-16 min-h-screen bg-black text-white font-sans bg-[radial-gradient(circle_at_center_top,rgba(255,107,0,0.04),transparent_55%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* ── Page Header ── */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
            <div>
              <Link
                href="/manufacturer"
                className="text-xs text-primary hover:text-orange-400 font-bold inline-flex items-center gap-1 mb-3 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
              </Link>
              <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
                Performance Analytics
              </h1>
              <p className="text-sm text-neutral-400">
                Conversion metrics, sales channels, and batch fill rate insights.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => alert("Exporting CSV report…")}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/10 hover:border-white/20 text-neutral-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <div className="flex bg-white/5 border border-white/10 p-0.5 rounded-xl shrink-0">
                {["7d", "30d", "90d", "all"].map((t) => (
                  <button
                    key={t}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      timeRange === t ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-neutral-400 hover:text-white"
                    }`}
                    onClick={() => setTimeRange(t)}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── KPI Grid ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {kpis.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={kpi.label}
                  className="p-5 bg-white/[0.02] border border-white/5 hover:border-primary/20 backdrop-blur-xl rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                      {kpi.label}
                    </span>
                    <div className={`w-7 h-7 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                      <Icon className={`w-3.5 h-3.5 ${kpi.color}`} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-1.5 tracking-tight">{kpi.value}</h3>
                  <span className={`text-[10px] font-bold flex items-center gap-1 ${kpi.isPositive ? "text-green-400" : "text-red-400"}`}>
                    {kpi.isPositive ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {kpi.benchmark}
                  </span>
                </div>
              );
            })}
          </div>

          {/* ── Charts Row ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Area Chart */}
            <div className="p-6 bg-white/[0.02] border border-white/5 hover:border-primary/15 backdrop-blur-xl rounded-2xl shadow-xl transition-all">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Revenue Trend (₹)</h3>
                <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
                  {timeRange.toUpperCase()}
                </span>
              </div>
              <div className="h-[180px] relative overflow-hidden">
                <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#FF6B00" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>
                  {/* Grid */}
                  {[0.25, 0.5, 0.75].map((f) => (
                    <line
                      key={f}
                      x1={0} y1={H * f} x2={W} y2={H * f}
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="0.5"
                      strokeDasharray="4"
                    />
                  ))}
                  {/* Area */}
                  <path d={areaPath} fill="url(#areaGrad)" />
                  {/* Line */}
                  <path d={linePath} fill="none" stroke="#FF6B00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />
                  {/* Dots */}
                  {pts.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="4" fill="#050505" stroke="#FF6B00" strokeWidth="2.5" />
                  ))}
                </svg>
              </div>
              <div className="flex justify-between text-[10px] text-neutral-500 font-bold uppercase tracking-wider mt-3 px-1">
                {REVENUE_POINTS.map((p) => (
                  <span key={p.week}>{p.week}</span>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 flex justify-between">
                <div>
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Peak Revenue</span>
                  <p className="text-sm font-black text-white mt-0.5">₹1,20,000</p>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Total Orders</span>
                  <p className="text-sm font-black text-white mt-0.5">136 orders</p>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Avg Weekly</span>
                  <p className="text-sm font-black text-white mt-0.5">₹73,167</p>
                </div>
              </div>
            </div>

            {/* Fill Rate Bar Chart */}
            <div className="p-6 bg-white/[0.02] border border-white/5 hover:border-primary/15 backdrop-blur-xl rounded-2xl shadow-xl transition-all">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
                Batch Fill Rate by Category
              </h3>
              <div className="space-y-4">
                {FILL_RATES.map((f) => (
                  <div key={f.category}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-bold text-neutral-300">{f.category}</span>
                      <span className="text-xs font-black text-white tabular-nums">{f.pct}%</span>
                    </div>
                    <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${f.color} rounded-full transition-all duration-700`}
                        style={{ width: `${f.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-xl bg-white/3 border border-white/5">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Overall Average</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">78.2%</span>
                  <span className="text-xs text-green-400 font-bold">+12.1% ↑</span>
                </div>
                <p className="text-[10px] text-neutral-500 mt-1">vs 66.1% same period last month</p>
              </div>
            </div>
          </div>

          {/* ── Sales Channel Breakdown ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-white/[0.02] border border-white/5 backdrop-blur-xl rounded-2xl shadow-xl lg:col-span-1">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
                Traffic Sources
              </h3>
              {/* Donut chart SVG */}
              <div className="flex items-center justify-center mb-6">
                <svg viewBox="0 0 120 120" width="140" height="140">
                  {(() => {
                    let offset = 0;
                    const R = 42, CX = 60, CY = 60, circum = 2 * Math.PI * R;
                    return CHANNEL_DATA.map((c, i) => {
                      const dash = (c.pct / 100) * circum;
                      const el = (
                        <circle
                          key={i}
                          cx={CX} cy={CY} r={R}
                          fill="none"
                          stroke={c.color}
                          strokeWidth="14"
                          strokeDasharray={`${dash} ${circum - dash}`}
                          strokeDashoffset={-offset}
                          style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
                        />
                      );
                      offset += dash;
                      return el;
                    });
                  })()}
                  <text x="60" y="56" textAnchor="middle" fill="white" fontSize="14" fontWeight="900" fontFamily="sans-serif">78%</text>
                  <text x="60" y="70" textAnchor="middle" fill="#6b7280" fontSize="7" fontFamily="sans-serif">Fill Rate</text>
                </svg>
              </div>
              <div className="space-y-2.5">
                {CHANNEL_DATA.map((c) => (
                  <div key={c.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                      <span className="text-xs text-neutral-400">{c.label}</span>
                    </div>
                    <span className="text-xs font-bold text-white tabular-nums">{c.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Batches table */}
            <div className="p-6 bg-white/[0.02] border border-white/5 backdrop-blur-xl rounded-2xl shadow-xl lg:col-span-2">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Top Performing Batches</h3>
                <Link
                  href="/manufacturer"
                  className="text-[10px] font-bold text-primary hover:text-orange-400 transition-colors flex items-center gap-1"
                >
                  Manage All <ArrowLeft className="w-3 h-3 rotate-180" />
                </Link>
              </div>
              <div className="flex flex-col">
                {/* Header */}
                <div className="grid grid-cols-4 text-[10px] font-bold uppercase tracking-wider text-neutral-500 pb-3 border-b border-white/5 px-2">
                  <span className="col-span-2">Batch Title</span>
                  <span className="text-center">Buyers</span>
                  <span className="text-right">Revenue</span>
                </div>
                {TOP_BATCHES.map((batch, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-4 items-center py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors rounded-xl px-2"
                  >
                    <div className="flex flex-col gap-1 col-span-2">
                      <h4 className="font-bold text-xs text-white leading-snug">{batch.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-neutral-500 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
                          {batch.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-green-500 rounded-full"
                              style={{ width: `${batch.fill}%` }}
                            />
                          </div>
                          <span className="text-[9px] text-neutral-500 tabular-nums">{batch.fill}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-white tabular-nums">{batch.buyers}</span>
                      <span className="text-[9px] text-neutral-500">buyers</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-green-400 tabular-nums">{formatPrice(batch.revenue, false)}</span>
                      {batch.trend === "up" ? (
                        <ArrowUpRight className="w-3 h-3 text-green-400 ml-auto mt-0.5" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 text-red-400 ml-auto mt-0.5" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Action Footer ── */}
          <div className="flex flex-col sm:flex-row gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-2xl shadow-xl">
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white mb-1">Optimize Your Batches</h4>
              <p className="text-xs text-neutral-400">
                Launch new batches in underperforming categories to boost overall fill rates and revenue.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/manufacturer/batch/new"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-orange-600 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-primary/20"
              >
                <Package className="w-4 h-4" />
                Launch New Batch
              </Link>
              <Link
                href="/manufacturer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                <BarChart3 className="w-4 h-4" />
                All Batches
              </Link>
            </div>
          </div>

        </div>
      </main>


    </>
  );
}
