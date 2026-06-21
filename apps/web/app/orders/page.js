"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { formatPrice, formatDate } from "@/lib/utils";
import { 
  Package, Calendar, Check, ExternalLink, MapPin, Building2, 
  ChevronDown, ChevronUp, Loader2, Truck, Clock, Search,
  Filter, Download, RefreshCw, AlertCircle, ShieldCheck, 
  ArrowUpRight, Copy, CheckCircle2, X, Star
} from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [refreshing, setRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });

  async function loadOrders() {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    alert(`Review submitted! Rating: ${reviewData.rating}/5\n"${reviewData.comment}"`);
    setShowReviewModal(null);
    setReviewData({ rating: 5, comment: "" });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED": return "#22c55e";
      case "SHIPPED":   return "#f59e0b";
      case "CONFIRMED": return "#FF6B00";
      default:          return "#6b7280";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "DELIVERED": return <CheckCircle2 className="w-3.5 h-3.5" />;
      case "SHIPPED":   return <Truck className="w-3.5 h-3.5" />;
      case "CONFIRMED": return <Check className="w-3.5 h-3.5" />;
      default:          return <Clock className="w-3.5 h-3.5" />;
    }
  };

  const getStepIndex = (status) => {
    switch (status) {
      case "DELIVERED": return 4;
      case "SHIPPED":   return 3;
      case "CONFIRMED": return 2;
      default:          return 1;
    }
  };

  const STEPS = [
    { label: "Ordered",   desc: "Hold authorized",   icon: "📋" },
    { label: "Confirmed", desc: "Batch locked",       icon: "✅" },
    { label: "Shipped",   desc: "In transit",         icon: "🚚" },
    { label: "Delivered", desc: "Received",           icon: "📦" },
  ];

  const filteredOrders = orders.filter((o) => {
    const matchStatus = filterStatus === "ALL" || o.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      o.batchTitle?.toLowerCase().includes(q) ||
      o.id?.toLowerCase().includes(q) ||
      o.manufacturer?.name?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  // Stats derived from orders
  const totalSpend = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const activeOrders = orders.filter((o) => o.status !== "DELIVERED").length;
  const deliveredCount = orders.filter((o) => o.status === "DELIVERED").length;

  return (
    <>
      <Header />

      <main className="pt-28 pb-20 min-h-[calc(100vh-150px)] bg-[#050505] text-left">
        <div className="max-w-5xl mx-auto px-4">

          {/* ── Page Header ── */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-black text-white tracking-tight flex items-center gap-3">
                My Orders
                {!loading && (
                  <span className="text-xs font-bold bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full">
                    {orders.length}
                  </span>
                )}
              </h1>
              <p className="text-sm text-neutral-400 mt-1.5">
                Track your crowd-buy reservations and order status in real-time.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/10 hover:border-white/20 text-neutral-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <Link
                href="/"
                className="px-4 py-2 text-xs font-bold rounded-xl border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white transition-all bg-white/2 cursor-pointer"
              >
                Browse Batches
              </Link>
            </div>
          </div>

          {/* ── Summary Stats ── */}
          {!loading && orders.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: "Total Spend", value: formatPrice(totalSpend, false), sub: "across all orders", color: "text-primary" },
                { label: "Active Orders", value: activeOrders, sub: "awaiting delivery", color: "text-amber-400" },
                { label: "Delivered", value: deliveredCount, sub: "completed orders", color: "text-green-400" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-5 rounded-2xl border border-white/5 bg-neutral-900/30 backdrop-blur-sm"
                >
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">
                    {stat.label}
                  </span>
                  <span className={`text-xl font-display font-black ${stat.color}`}>{stat.value}</span>
                  <span className="block text-[10px] text-neutral-600 mt-0.5">{stat.sub}</span>
                </div>
              ))}
            </div>
          )}

          {/* ── Filters & Search ── */}
          {!loading && orders.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search orders by title, ID, or manufacturer…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900/40 border border-white/5 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-primary transition-all"
                />
              </div>
              {/* Status Filter */}
              <div className="flex p-0.5 rounded-xl bg-neutral-950 border border-white/5 shrink-0">
                {["ALL", "CONFIRMED", "SHIPPED", "DELIVERED"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer capitalize ${
                      filterStatus === s
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Orders List ── */}
          {loading ? (
            <div className="flex flex-col gap-5">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-52 w-full rounded-2xl bg-neutral-900/40 border border-white/5 animate-pulse" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center text-center p-14 rounded-2xl border border-white/5 bg-neutral-900/10 backdrop-blur-xl max-w-md mx-auto my-12 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-2">
                {orders.length === 0 ? "No orders yet" : "No matching orders"}
              </h3>
              <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
                {orders.length === 0
                  ? "Join active batches to unlock massive manufacturer discounts together!"
                  : "Try adjusting your search or filter to find orders."}
              </p>
              {orders.length === 0 && (
                <Link
                  href="/"
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-accent text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all cursor-pointer"
                >
                  Explore Batches
                </Link>
              )}
              {orders.length > 0 && (
                <button
                  onClick={() => { setSearchQuery(""); setFilterStatus("ALL"); }}
                  className="px-6 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white text-sm font-bold transition-all cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {filteredOrders.map((order) => {
                const isActive = selectedOrder?.id === order.id;
                const stepIndex = getStepIndex(order.status);
                const statusColor = getStatusColor(order.status);

                return (
                  <div
                    key={order.id}
                    className={`rounded-2xl border transition-all duration-300 ${
                      isActive
                        ? "bg-neutral-950 border-primary shadow-lg shadow-primary/5"
                        : "bg-neutral-900/40 border-white/5 hover:border-white/12 hover:bg-neutral-900/60 shadow-xl"
                    }`}
                  >
                    {/* ── Card Header ── */}
                    <div
                      className="p-6 cursor-pointer"
                      onClick={() => setSelectedOrder(isActive ? null : order)}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 pb-4 border-b border-white/5">
                        <div className="flex flex-col gap-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-neutral-500">Order</span>
                            <span className="font-mono text-xs text-primary font-bold bg-primary/5 border border-primary/10 px-2 py-0.5 rounded truncate max-w-[220px]">
                              #{order.id}
                            </span>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleCopyId(order.id); }}
                              className="p-1 rounded hover:bg-white/5 text-neutral-500 hover:text-white transition-colors cursor-pointer"
                              title="Copy order ID"
                            >
                              {copiedId === order.id ? (
                                <Check className="w-3 h-3 text-green-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mt-0.5">
                            <Calendar className="w-3.5 h-3.5 opacity-60" />
                            <span>Placed on {formatDate(order.orderedAt)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider border uppercase"
                            style={{
                              backgroundColor: `${statusColor}12`,
                              color: statusColor,
                              borderColor: `${statusColor}30`,
                            }}
                          >
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                          {isActive ? (
                            <ChevronUp className="w-4 h-4 text-neutral-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-neutral-500" />
                          )}
                        </div>
                      </div>

                      {/* ── Card Body ── */}
                      <div className="flex flex-col gap-4">
                        <div>
                          <h3 className="text-base font-display font-bold text-white hover:text-primary transition-colors duration-200">
                            {order.batchTitle}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1">
                            <Building2 className="w-3.5 h-3.5 text-neutral-500" />
                            <span>by {order.manufacturer?.name}</span>
                            {order.manufacturer?.gstVerified && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary/10 border border-primary/15 text-primary">
                                <ShieldCheck className="w-2.5 h-2.5" /> GST Verified
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-white/3 border border-white/5">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Quantity</span>
                            <span className="text-sm font-semibold text-neutral-200">{order.quantity} units</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Per Unit</span>
                            <span className="text-sm font-semibold text-neutral-200">{formatPrice(order.pricePerUnit, false)}</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Total Paid</span>
                            <span className="text-sm font-bold text-green-400">{formatPrice(order.totalAmount, false)}</span>
                          </div>
                        </div>
                      </div>

                      {/* ── Progress Stepper ── */}
                      <div className="relative mt-7 pt-4">
                        {/* Track line */}
                        <div className="absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-neutral-800 -translate-y-1/2 z-0">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-green-500 transition-all duration-700 ease-out"
                            style={{ width: `${Math.min(((stepIndex - 1) / 3) * 100, 100)}%` }}
                          />
                        </div>
                        <div className="relative grid grid-cols-4 z-10">
                          {STEPS.map((step, sIdx) => {
                            const isCompleted = stepIndex > sIdx;
                            const isCurrent = stepIndex === sIdx + 1;
                            return (
                              <div key={step.label} className="flex flex-col items-center text-center">
                                <div className="relative flex items-center justify-center h-8">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 text-sm ${
                                      isCompleted
                                        ? "bg-primary border-2 border-primary text-white shadow-[0_0_12px_rgba(255,106,0,0.3)]"
                                        : isCurrent
                                        ? "bg-neutral-950 border-2 border-primary text-primary shadow-[0_0_0_4px_rgba(255,106,0,0.15)]"
                                        : "bg-neutral-900 border-2 border-neutral-800 text-neutral-600"
                                    }`}
                                  >
                                    {isCompleted ? (
                                      <Check className="w-4 h-4" />
                                    ) : isCurrent ? (
                                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    ) : (
                                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                                    )}
                                  </div>
                                </div>
                                <div className="mt-3 flex flex-col items-center gap-0.5">
                                  <span className={`text-xs font-bold transition-colors ${isCurrent ? "text-primary" : isCompleted ? "text-neutral-200" : "text-neutral-600"}`}>
                                    {step.label}
                                  </span>
                                  <span className="hidden sm:block text-[10px] text-neutral-500">{step.desc}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* ── Expanded Detail Section ── */}
                    {isActive && (
                      <div
                        className="px-6 pb-6 pt-4 border-t border-white/5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Shipping Info */}
                          <div className="space-y-4">
                            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                              Shipping Details
                            </h4>
                            <div className="space-y-2 text-xs text-neutral-300 p-4 rounded-xl bg-white/3 border border-white/5">
                              <div className="flex items-center gap-2">
                                <Building2 className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                                <span><strong className="text-neutral-300">Manufacturer:</strong> {order.manufacturer?.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                                <span>{order.manufacturer?.city}, {order.manufacturer?.state}</span>
                              </div>
                              {order.trackingNumber && (
                                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5 mt-2">
                                  <Truck className="w-3.5 h-3.5 text-primary shrink-0" />
                                  <span className="text-neutral-400">Tracking:</span>
                                  <code className="font-mono font-bold text-primary">{order.trackingNumber}</code>
                                  <span className="text-[10px] text-neutral-500">(UPS Ground)</span>
                                </div>
                              )}
                            </div>

                            {/* Delivery estimate */}
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/15">
                              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span className="text-xs text-amber-300">
                                Estimated delivery: <strong>5–7 business days</strong>
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2.5">
                            <Link
                              href={`/batch/${order.batchId}`}
                              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white text-xs font-bold transition-all bg-white/2 cursor-pointer w-full"
                            >
                              <span>View Original Batch</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>

                            {order.status === "DELIVERED" && (
                              <button
                                onClick={() => setShowReviewModal(order)}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-amber-500/20 hover:border-amber-500/40 text-amber-400 hover:text-amber-300 text-xs font-bold transition-all bg-amber-500/5 hover:bg-amber-500/10 cursor-pointer w-full"
                              >
                                <Star className="w-3.5 h-3.5" />
                                <span>Leave a Review</span>
                              </button>
                            )}

                            <button
                              onClick={() => alert("Connecting to support team…")}
                              className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white text-xs font-bold transition-all cursor-pointer w-full"
                            >
                              Contact Support
                            </button>

                            {order.invoice && (
                              <button
                                onClick={() => alert("Downloading invoice PDF…")}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 text-neutral-400 hover:text-white text-xs font-bold transition-all cursor-pointer w-full"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download Invoice</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* ── Review Modal ── */}
      {showReviewModal && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setShowReviewModal(null)}
        >
          <div
            className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-neutral-950 shadow-2xl relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-neutral-400 hover:text-white cursor-pointer"
              onClick={() => setShowReviewModal(null)}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-display font-black text-white mb-1">Write a Review</h3>
            <p className="text-xs text-neutral-400 mb-6">
              For: <strong className="text-neutral-200">{showReviewModal.batchTitle}</strong>
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  Your Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating: r })}
                      className="cursor-pointer transition-all"
                    >
                      <Star
                        className={`w-7 h-7 transition-all ${
                          r <= reviewData.rating
                            ? "text-amber-400 fill-current"
                            : "text-neutral-700"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  Your Comment
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share your experience with product quality, delivery speed, manufacturer communication…"
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/5 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-primary transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-primary hover:bg-accent text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-primary/20"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
