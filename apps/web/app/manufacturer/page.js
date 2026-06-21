"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { formatPrice, formatDate } from "@/lib/utils";
import { 
  Building2, CheckCircle2, Package, Coins, Percent, Users, TrendingUp, Settings, PlusCircle, Calendar, MapPin, ShieldCheck, ArrowUpRight, ArrowDownRight, Check, Truck, AlertCircle, ExternalLink, X, Loader2, CreditCard, BarChart3, Sparkles
} from "lucide-react";

export default function ManufacturerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [manufacturer, setManufacturer] = useState(null);
  const [batches, setBatches] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [payoutBankDetails, setPayoutBankDetails] = useState({
    accountNumber: "",
    ifsc: "",
    bankName: "",
    beneficiaryName: ""
  });
  const [showFulfillModal, setShowFulfillModal] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [submittingFulfillment, setSubmittingFulfillment] = useState(false);
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    businessName: "",
    city: "",
    state: "",
    gstNumber: "",
    yearsInBusiness: 0
  });
  const [settlingFunds, setSettlingFunds] = useState(false);

  // Filter parameters for batches tab
  const [batchFilter, setBatchFilter] = useState("ALL");

  async function loadDashboardData() {
    try {
      // 1. Fetch manufacturer profile
      const mfrRes = await fetch("/api/manufacturer");
      let mfrData = null;
      if (mfrRes.ok) {
        mfrData = await mfrRes.json();
        setManufacturer(mfrData);
        setProfileForm({
          businessName: mfrData.businessName || "",
          city: mfrData.city || "",
          state: mfrData.state || "",
          gstNumber: mfrData.gstNumber || "",
          yearsInBusiness: mfrData.yearsInBusiness || 0
        });

        // Load Bank Account details from localStorage associated with this manufacturer
        const storedBank = localStorage.getItem(`bank_details_${mfrData.id}`);
        if (storedBank) {
          setPayoutBankDetails(JSON.parse(storedBank));
        } else {
          // default bank template
          setPayoutBankDetails({
            accountNumber: "919999999999",
            ifsc: "PYTM0123456",
            bankName: "Paytm Payments Bank",
            beneficiaryName: mfrData.businessName || "Sharma Industries"
          });
        }
      }

      // 2. Fetch batches
      const batchesRes = await fetch("/api/batches");
      if (batchesRes.ok) {
        const batchesData = await batchesRes.json();
        // Filter batches belonging to this manufacturer
        if (mfrData) {
          setBatches(batchesData.filter(b => b.manufacturerId === mfrData.id));
        } else {
          setBatches(batchesData);
        }
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Fetch orders when manufacturer profile is loaded
  useEffect(() => {
    if (!manufacturer) return;
    async function loadOrders() {
      setLoadingOrders(true);
      try {
        const res = await fetch(`/api/orders?manufacturerId=${manufacturer.id}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error("Failed to load manufacturer orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    }
    loadOrders();
  }, [manufacturer]);

  // Handle Close / Stop accepting slots for active batch
  const handleCloseBatch = (batchId) => {
    setBatches(prev => prev.map(b => b.id === batchId ? { ...b, status: "CLOSED" } : b));
    alert("Batch closed successfully! Final pricing locks placed, shipping processing dispatch unlocked.");
  };

  // Profile Save
  const handleSaveProfileSettings = async (e) => {
    e.preventDefault();
    setSubmittingProfile(true);
    try {
      const res = await fetch("/api/manufacturer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: profileForm.businessName,
          city: profileForm.city,
          state: profileForm.state,
          gstNumber: profileForm.gstNumber,
          yearsInBusiness: parseInt(profileForm.yearsInBusiness)
        })
      });

      if (res.ok) {
        alert("Manufacturer profile saved successfully in database!");
        await loadDashboardData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update profile settings");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Server error occurred while saving profile settings");
    } finally {
      setSubmittingProfile(false);
    }
  };

  // Bank preference settings
  const handleSaveBankDetails = (e) => {
    e.preventDefault();
    if (payoutBankDetails.accountNumber.length < 9) {
      alert("Please enter a valid Bank Account Number (minimum 9 digits)");
      return;
    }
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(payoutBankDetails.ifsc.toUpperCase())) {
      alert("Please enter a valid 11-digit IFSC code (e.g., SBIN0001234)");
      return;
    }
    localStorage.setItem(`bank_details_${manufacturer.id}`, JSON.stringify(payoutBankDetails));
    alert("Bank settlement preferences saved successfully!");
  };

  // Withdraw Settled ledger funds
  const handleWithdrawFunds = () => {
    const settledFunds = orders.filter(o => o.status === "DELIVERED").reduce((acc, o) => acc + o.totalAmount, 0);
    if (settledFunds <= 0) {
      alert("You do not have any settled funds available for withdrawal at this time.");
      return;
    }
    setSettlingFunds(true);
    setTimeout(() => {
      setSettlingFunds(false);
      alert(`Settlement request processed! ₹${settledFunds.toLocaleString("en-IN")} has been dispatched to ${payoutBankDetails.bankName} (A/C ...${payoutBankDetails.accountNumber.slice(-4)}).`);
    }, 1500);
  };

  // Fulfillment Modals & update status handlers
  const handleFulfillOrderClick = (order) => {
    setShowFulfillModal(order);
    setTrackingNumber(order.trackingNumber || `TRK-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  const handleSaveFulfillment = async () => {
    if (!showFulfillModal) return;
    setSubmittingFulfillment(true);
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: showFulfillModal.id,
          status: "SHIPPED",
          trackingNumber: trackingNumber
        })
      });

      if (res.ok) {
        alert(`Order #${showFulfillModal.id.slice(0, 8)}... has been marked as SHIPPED with tracking number: ${trackingNumber}`);
        // Reload dashboard orders
        const ordersRes = await fetch(`/api/orders?manufacturerId=${manufacturer.id}`);
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          setOrders(data);
        }
        setShowFulfillModal(null);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update fulfillment details");
      }
    } catch (err) {
      console.error("Fulfillment error:", err);
      alert("Server error occurred during fulfillment");
    } finally {
      setSubmittingFulfillment(false);
    }
  };

  const handleMarkDelivered = async (orderId) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          status: "DELIVERED"
        })
      });

      if (res.ok) {
        alert("Order marked as DELIVERED successfully!");
        const ordersRes = await fetch(`/api/orders?manufacturerId=${manufacturer.id}`);
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          setOrders(data);
        }
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update order status");
      }
    } catch (err) {
      console.error("Delivered status error:", err);
    }
  };

  // KPIs Calculations
  const activeBatchesCount = batches.filter(b => b.status === "LIVE").length;
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const avgFillRate = batches.length 
    ? batches.reduce((acc, b) => acc + (b.currentSlots / b.maxSlots) * 100, 0) / batches.length 
    : 0;
  const repeatBuyersPct = orders.length > 3 ? "34.5%" : "0.0%";

  // Activities timeline simulation
  const activities = [
    {
      time: "2 hours ago",
      text: "Batch 'Basmati Rice' hit Tier 2 pricing with 45 slots filled.",
      icon: TrendingUp,
      color: "text-green-400 bg-green-500/10"
    },
    {
      time: "5 hours ago",
      text: "New client slot reservation placed: 15 units.",
      icon: Users,
      color: "text-primary bg-primary/10"
    },
    {
      time: "Yesterday",
      text: "Payout transfer initiated for completed Batch #001.",
      icon: CreditCard,
      color: "text-blue-400 bg-blue-500/10"
    },
    {
      time: "3 days ago",
      text: "New Batch Catalog listing launched and is now LIVE.",
      icon: Package,
      color: "text-neutral-400 bg-white/5"
    }
  ];

  return (
    <>
      <Header />

      <main className="pt-28 pb-20 min-h-[calc(100vh-150px)] bg-[#050505] text-left">
        <div className="max-w-6xl mx-auto px-4">
          
          {loading ? (
            <div className="w-full h-96 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* Welcome Banner */}
              <div className="relative overflow-hidden p-8 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 to-neutral-950/90 shadow-2xl shadow-primary/5">
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-primary/20 blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-accent-2/10 blur-3xl pointer-events-none"></div>

                <div className="relative z-10 space-y-4">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">MANUFACTURER PORTAL</span>
                  <h1 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight">
                    Welcome back, {manufacturer?.businessName || "Sharma Industries"}
                  </h1>
                  <p className="text-sm text-neutral-300 max-w-2xl">
                    Manage volume tier scheduling, client slot bookings, and monitor settlement transactions.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="text-xs font-semibold bg-white/5 border border-white/10 px-3 py-1 rounded-full text-neutral-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{manufacturer?.city || "Nagpur"}, {manufacturer?.state || "Maharashtra"}</span>
                    </span>
                    <span className="text-xs font-semibold bg-white/5 border border-white/10 px-3 py-1 rounded-full text-neutral-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{manufacturer?.rating || "4.8"} Rating</span>
                    </span>
                    <span className="text-xs font-semibold bg-white/5 border border-white/10 px-3 py-1 rounded-full text-neutral-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                      <span>GST: {manufacturer?.gstNumber || "27AADCS1234F1Z5"}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Monorepo Main Dashboard Layout Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Sidebar Bento Navigation */}
                <div className="lg:col-span-3 flex flex-col gap-1.5 p-3 rounded-2xl border border-white/5 bg-neutral-900/10 backdrop-blur-xl">
                  <div className="px-4 py-2.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest text-left">
                    Portal Navigation
                  </div>
                  {[
                    { id: "dashboard", label: "Dashboard Overview", icon: BarChart3 },
                    { id: "batches", label: "Catalog & Batches", icon: Package },
                    { id: "orders", label: "Order Fulfillment", icon: Truck },
                    { id: "payouts", label: "Payouts & Bank", icon: CreditCard },
                    { id: "settings", label: "Business Settings", icon: Settings },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer border ${
                          isActive 
                            ? "bg-primary/10 text-primary border-primary/20 shadow-md shadow-primary/5" 
                            : "text-neutral-400 hover:text-white hover:bg-white/5 border-transparent"
                        }`}
                      >
                        <Icon className={`w-4.5 h-4.5 ${isActive ? "text-primary" : "text-neutral-500"}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Right Dynamic Tab Content Panel */}
                <div className="lg:col-span-9 p-6 rounded-2xl border border-white/5 bg-neutral-900/20 backdrop-blur-xl shadow-2xl text-left">
                  
                  {/* 1. PORTAL DASHBOARD TAB */}
                  {activeTab === "dashboard" && (
                    <div className="space-y-8">
                      {/* KPIs Overview Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: "Active Batches", value: activeBatchesCount, trend: "Live & Tracking", icon: Package },
                          { label: "Total Revenue", value: formatPrice(totalRevenue, false), trend: "Sales volume", icon: Coins },
                          { label: "Avg. Fill Rate", value: `${avgFillRate.toFixed(1)}%`, trend: "Batch efficiency", icon: Percent },
                          { label: "Repeat Buyers", value: repeatBuyersPct, trend: "Loyalty benchmark", icon: Users },
                        ].map((kpi, idx) => {
                          const Icon = kpi.icon;
                          return (
                            <div key={idx} className="p-4 rounded-xl border border-white/5 bg-neutral-900/40 shadow">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{kpi.label}</span>
                                <Icon className="w-4 h-4 text-primary opacity-80" />
                              </div>
                              <h3 className="text-xl font-display font-black text-white">{kpi.value}</h3>
                              <span className="text-[9px] text-neutral-400 block mt-1">{kpi.trend}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Main Subcolumns */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Summary of Active Batches (Left column, 2/3) */}
                        <div className="md:col-span-2 space-y-4">
                          <div className="flex justify-between items-center flex-wrap gap-2">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                              <Package className="w-4 h-4 text-primary" />
                              <span>Active Catalog Items</span>
                            </h3>
                            <div className="flex items-center gap-3">
                              <Link 
                                href="/manufacturer/analytics" 
                                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                              >
                                <span>Analytics Hub</span>
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                              <span className="text-neutral-700">|</span>
                              <Link href="/manufacturer/batch/new" className="text-xs font-bold text-primary hover:underline">
                                + Create Batch
                              </Link>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {batches.filter(b => b.status === "LIVE").length === 0 ? (
                              <div className="p-8 rounded-xl border border-white/5 bg-neutral-950 text-center text-xs text-neutral-500">
                                No active batches currently running.
                              </div>
                            ) : (
                              batches.filter(b => b.status === "LIVE").slice(0, 2).map((batch) => {
                                const fillPercent = Math.min(Math.round((batch.currentSlots / batch.maxSlots) * 100), 100);
                                return (
                                  <div key={batch.id} className="p-5 rounded-xl border border-white/5 bg-neutral-900/40 space-y-4">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h4 className="text-sm font-bold text-white">{batch.title}</h4>
                                        <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider text-neutral-400 bg-white/5 px-2 py-0.5 rounded">
                                          {batch.category}
                                        </span>
                                      </div>
                                      <span className="text-[9px] font-bold bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">
                                        {batch.status}
                                      </span>
                                    </div>

                                    {/* Progress */}
                                    <div className="space-y-1.5">
                                      <div className="flex justify-between text-xs text-neutral-400">
                                        <span>Slots Occupancy: <strong>{batch.currentSlots}</strong> / {batch.maxSlots}</span>
                                        <span>{fillPercent}%</span>
                                      </div>
                                      <div className="h-1.5 bg-neutral-950 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-primary to-green-500 rounded-full" style={{ width: `${fillPercent}%` }}></div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>

                        {/* Recent Activity Log (Right column, 1/3) */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <Activity className="w-4 h-4 text-primary" />
                            <span>Recent Timeline</span>
                          </h3>

                          <div className="space-y-4">
                            {activities.map((act, idx) => {
                              const Icon = act.icon;
                              return (
                                <div key={idx} className="flex gap-3 text-xs leading-relaxed">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${act.color}`}>
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-neutral-500 block mb-0.5">{act.time}</span>
                                    <p className="text-neutral-300">{act.text}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* 2. CATALOG & BATCHES TAB */}
                  {activeTab === "batches" && (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                            <Package className="w-5 h-5 text-primary" />
                            <span>Catalog Listings</span>
                          </h2>
                          <p className="text-xs text-neutral-500 mt-0.5">Manage live active group buy tiers and historical batches.</p>
                        </div>
                        <Link 
                          href="/manufacturer/batch/new"
                          className="px-4 py-2 rounded-xl bg-primary hover:bg-accent text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>Launch New Batch</span>
                        </Link>
                      </div>

                      {/* Filter Row */}
                      <div className="flex p-0.5 rounded-lg bg-neutral-950 border border-white/5 max-w-fit">
                        {["ALL", "LIVE", "CLOSED"].map((s) => (
                          <button
                            key={s}
                            onClick={() => setBatchFilter(s)}
                            className={`px-3 py-1 rounded-md text-[10px] font-bold tracking-wider cursor-pointer ${
                              batchFilter === s
                                ? "bg-primary/10 text-primary shadow"
                                : "text-neutral-400 hover:text-white"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>

                      {/* Batches Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {batches.filter(b => batchFilter === "ALL" || b.status === batchFilter).length === 0 ? (
                          <div className="col-span-2 p-12 text-center text-xs text-neutral-500 border border-white/5 rounded-xl bg-neutral-950/20">
                            No batch listings found for category filter: {batchFilter}.
                          </div>
                        ) : (
                          batches.filter(b => batchFilter === "ALL" || b.status === batchFilter).map((batch) => {
                            const fillPercent = Math.min(Math.round((batch.currentSlots / batch.maxSlots) * 100), 100);
                            return (
                              <div key={batch.id} className="p-5 rounded-xl border border-white/5 bg-neutral-900/40 space-y-4 hover:border-white/12 transition-all flex flex-col justify-between">
                                <div className="space-y-2">
                                  <div className="flex justify-between items-start">
                                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{batch.category}</span>
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                      batch.status === "LIVE" 
                                        ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                                        : "bg-neutral-800 text-neutral-400"
                                    }`}>
                                      {batch.status}
                                    </span>
                                  </div>
                                  <h4 className="text-sm font-bold text-white">{batch.title}</h4>
                                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">{batch.description}</p>
                                </div>

                                <div className="space-y-4 pt-2">
                                  {/* Progress occupancy bar */}
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-[11px] text-neutral-400">
                                      <span>Occupancy: <strong>{batch.currentSlots}</strong> / {batch.maxSlots}</span>
                                      <span>{fillPercent}%</span>
                                    </div>
                                    <div className="h-1 bg-neutral-950 rounded-full overflow-hidden">
                                      <div className="h-full bg-gradient-to-r from-primary to-green-500" style={{ width: `${fillPercent}%` }}></div>
                                    </div>
                                  </div>

                                  {/* Pricing tiers */}
                                  <div className="border-t border-white/5 pt-3">
                                    <span className="text-[10px] font-bold text-neutral-500 uppercase block mb-2">Tiers Schedule</span>
                                    <div className="grid grid-cols-4 gap-1 text-[10px]">
                                      {batch.tiers?.map((t, idx) => {
                                        const isUnlocked = batch.currentSlots >= t.minSlots;
                                        return (
                                          <div key={idx} className={`p-1 border rounded text-center ${
                                            isUnlocked ? "bg-green-500/5 border-green-500/20 text-green-400 font-bold" : "bg-white/2 border-white/5 text-neutral-500"
                                          }`}>
                                            <div>{t.minSlots}+</div>
                                            <div className="mt-0.5">{formatPrice(t.price, false)}</div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  {batch.status === "LIVE" && (
                                    <div className="flex gap-2 pt-2">
                                      <button 
                                        onClick={() => handleCloseBatch(batch.id)}
                                        className="flex-1 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white text-xs font-bold transition-all cursor-pointer text-center"
                                      >
                                        Close Booking
                                      </button>
                                      <button 
                                        onClick={() => alert("Batch extended successfully (simulated)!")}
                                        className="flex-1 py-1.5 rounded-lg border border-white/5 bg-white/2 text-neutral-300 hover:text-white text-xs font-bold transition-all cursor-pointer text-center"
                                      >
                                        Extend End-Time
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}

                  {/* 3. ORDER FULFILLMENT TAB */}
                  {activeTab === "orders" && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                          <Truck className="w-5 h-5 text-primary" />
                          <span>Order Fulfillment Hub</span>
                        </h2>
                        <p className="text-xs text-neutral-500 mt-0.5">Manage slot bookings, check payment holds, and dispatch shipments.</p>
                      </div>

                      {loadingOrders ? (
                        <div className="w-full h-48 flex items-center justify-center">
                          <Loader2 className="w-6 h-6 text-primary animate-spin" />
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4">
                          {orders.length === 0 ? (
                            <div className="p-12 text-center text-xs text-neutral-500 border border-white/5 rounded-xl bg-neutral-950/20">
                              No client orders placed under your batch listings yet.
                            </div>
                          ) : (
                            orders.map((order) => {
                              return (
                                <div key={order.id} className="p-5 rounded-xl border border-white/5 bg-neutral-900/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-white/10 transition-colors">
                                  <div className="space-y-1 text-left">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="text-xs font-bold text-neutral-400">Order</span>
                                      <span className="font-mono text-xs text-primary font-bold">#{order.id.slice(0, 8)}...</span>
                                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                                        order.status === "DELIVERED"
                                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                                          : order.status === "SHIPPED"
                                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                          : "bg-primary/10 text-primary border-primary/20"
                                      }`}>
                                        {order.status}
                                      </span>
                                    </div>
                                    <h4 className="text-sm font-bold text-white">{order.batchTitle}</h4>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-neutral-400">
                                      <span>Quantity: <strong>{order.quantity} units</strong></span>
                                      <span>Total: <strong className="text-green-400">{formatPrice(order.totalAmount, false)}</strong></span>
                                      <span>Date: <strong>{formatDate(order.orderedAt)}</strong></span>
                                    </div>
                                    {order.trackingNumber && (
                                      <div className="text-[10px] text-neutral-500 mt-1 flex items-center gap-1">
                                        <Truck className="w-3.5 h-3.5" />
                                        <span>Tracking Number: <strong className="text-neutral-400 font-mono">{order.trackingNumber}</strong> (UPS Ground)</span>
                                      </div>
                                    )}
                                  </div>

                                  <div className="self-end sm:self-auto flex items-center gap-2">
                                    {order.status === "CONFIRMED" && (
                                      <button
                                        onClick={() => handleFulfillOrderClick(order)}
                                        className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-accent text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-primary/10 flex items-center gap-1.5"
                                      >
                                        <Truck className="w-3.5 h-3.5" />
                                        <span>Ship Order</span>
                                      </button>
                                    )}
                                    {order.status === "SHIPPED" && (
                                      <button
                                        onClick={() => handleMarkDelivered(order.id)}
                                        className="px-3.5 py-1.5 rounded-lg border border-green-500/30 bg-green-500/5 hover:bg-green-500/10 text-green-400 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                        <span>Mark Delivered</span>
                                      </button>
                                    )}
                                    {order.status === "DELIVERED" && (
                                      <span className="text-xs text-neutral-500 font-medium flex items-center gap-1">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span>Delivered</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 4. PAYOUTS & BANK TAB */}
                  {activeTab === "payouts" && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-primary" />
                          <span>Payout Settlement Preferences</span>
                        </h2>
                        <p className="text-xs text-neutral-500 mt-0.5">Manage bank credentials and monitor ledger payout dispatches.</p>
                      </div>

                      {/* Ledger stats */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-6 rounded-xl border border-white/5 bg-neutral-900/40 space-y-4">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Available Balance (Settled)</span>
                          <h3 className="text-3xl font-display font-black text-white">
                            {formatPrice(orders.filter(o => o.status === "DELIVERED").reduce((acc, o) => acc + o.totalAmount, 0), false)}
                          </h3>
                          <p className="text-[10px] text-neutral-500 leading-normal">
                            Ledger balance is settled as soon as the buyers receive the physical products (Delivered).
                          </p>
                          <button
                            onClick={handleWithdrawFunds}
                            disabled={settlingFunds}
                            className="px-4 py-2 w-full text-center rounded-xl bg-primary hover:bg-accent text-white text-xs font-bold transition-all shadow shadow-primary/10 disabled:bg-neutral-800 disabled:text-neutral-500 cursor-pointer"
                          >
                            {settlingFunds ? "Processing Settlement..." : "Withdraw Ledger Balance"}
                          </button>
                        </div>

                        <div className="p-6 rounded-xl border border-white/5 bg-neutral-900/40 space-y-4">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Pending Escrow Hold</span>
                          <h3 className="text-3xl font-display font-black text-neutral-400">
                            {formatPrice(orders.filter(o => o.status !== "DELIVERED" && o.status !== "CANCELLED").reduce((acc, o) => acc + o.totalAmount, 0), false)}
                          </h3>
                          <p className="text-[10px] text-neutral-500 leading-normal">
                            Escrow holds are locked by the platform and released once order batches complete production and delivery is verified.
                          </p>
                        </div>
                      </div>

                      {/* Link Bank Account Form */}
                      <form onSubmit={handleSaveBankDetails} className="p-6 rounded-xl border border-white/5 bg-neutral-900/40 space-y-5">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-primary" />
                          <span>Bank Account Preferences</span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Beneficiary Account Name</label>
                            <input 
                              type="text"
                              required
                              value={payoutBankDetails.beneficiaryName}
                              onChange={(e) => setPayoutBankDetails({ ...payoutBankDetails, beneficiaryName: e.target.value })}
                              className="px-4 py-2.5 rounded-xl border border-white/10 focus:border-primary bg-white/5 text-xs font-semibold text-white outline-none"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Bank Name</label>
                            <input 
                              type="text"
                              required
                              value={payoutBankDetails.bankName}
                              onChange={(e) => setPayoutBankDetails({ ...payoutBankDetails, bankName: e.target.value })}
                              className="px-4 py-2.5 rounded-xl border border-white/10 focus:border-primary bg-white/5 text-xs font-semibold text-white outline-none"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Account Number</label>
                            <input 
                              type="text"
                              required
                              value={payoutBankDetails.accountNumber}
                              onChange={(e) => setPayoutBankDetails({ ...payoutBankDetails, accountNumber: e.target.value })}
                              className="px-4 py-2.5 rounded-xl border border-white/10 focus:border-primary bg-white/5 text-xs font-mono font-semibold text-white outline-none"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Bank IFSC Code</label>
                            <input 
                              type="text"
                              required
                              value={payoutBankDetails.ifsc}
                              onChange={(e) => setPayoutBankDetails({ ...payoutBankDetails, ifsc: e.target.value })}
                              className="px-4 py-2.5 rounded-xl border border-white/10 focus:border-primary bg-white/5 text-xs font-mono font-semibold text-white outline-none"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="px-4 py-2.5 rounded-xl bg-primary hover:bg-accent text-white text-xs font-bold transition-all cursor-pointer self-start"
                        >
                          Save Bank Credentials
                        </button>
                      </form>
                    </div>
                  )}

                  {/* 5. BUSINESS SETTINGS TAB */}
                  {activeTab === "settings" && (
                    <form onSubmit={handleSaveProfileSettings} className="space-y-6">
                      <div>
                        <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                          <Settings className="w-5 h-5 text-primary" />
                          <span>Business profile Settings</span>
                        </h2>
                        <p className="text-xs text-neutral-500 mt-0.5">Edit factory location parameters, GST credentials, and support details.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Business Name</label>
                          <input 
                            type="text"
                            required
                            value={profileForm.businessName}
                            onChange={(e) => setProfileForm({ ...profileForm, businessName: e.target.value })}
                            className="px-4 py-2.5 rounded-xl border border-white/10 focus:border-primary bg-white/5 text-xs font-semibold text-white outline-none"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Years In Business</label>
                          <input 
                            type="number"
                            required
                            value={profileForm.yearsInBusiness}
                            onChange={(e) => setProfileForm({ ...profileForm, yearsInBusiness: e.target.value })}
                            className="px-4 py-2.5 rounded-xl border border-white/10 focus:border-primary bg-white/5 text-xs font-semibold text-white outline-none"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">City Location</label>
                          <input 
                            type="text"
                            required
                            value={profileForm.city}
                            onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                            className="px-4 py-2.5 rounded-xl border border-white/10 focus:border-primary bg-white/5 text-xs font-semibold text-white outline-none"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">State Location</label>
                          <input 
                            type="text"
                            required
                            value={profileForm.state}
                            onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                            className="px-4 py-2.5 rounded-xl border border-white/10 focus:border-primary bg-white/5 text-xs font-semibold text-white outline-none"
                          />
                        </div>

                        <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">GSTIN Number</label>
                          <input 
                            type="text"
                            required
                            value={profileForm.gstNumber}
                            onChange={(e) => setProfileForm({ ...profileForm, gstNumber: e.target.value })}
                            className="px-4 py-2.5 rounded-xl border border-white/10 focus:border-primary bg-white/5 text-xs font-mono font-semibold text-white outline-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={submittingProfile}
                        className="px-4 py-2.5 rounded-xl bg-primary hover:bg-accent text-white text-xs font-bold transition-all disabled:bg-neutral-800 cursor-pointer"
                      >
                        {submittingProfile ? "Saving Details..." : "Save Profile Settings"}
                      </button>
                    </form>
                  )}

                </div>

              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />

      {/* Carrier Fulfillment Modal Overlay */}
      {showFulfillModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setShowFulfillModal(null)}>
          <div className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-neutral-950 shadow-2xl relative animate-scale-up text-left" onClick={(e) => e.stopPropagation()}>
            <button 
              className="absolute top-4 right-4 text-neutral-400 hover:text-white text-xl cursor-pointer" 
              onClick={() => setShowFulfillModal(null)}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-display font-black text-white mb-2">Ship Order</h3>
            <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
              Fulfill this reservation for client order #{showFulfillModal.id.slice(0, 8)}... Enter the carrier tracking number to notify the buyer.
            </p>
            
            <div className="flex flex-col gap-2 mb-6">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Carrier Tracking Number</label>
              <input
                type="text"
                placeholder="e.g. TRK-123456"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 focus:border-primary bg-white/5 font-mono text-sm font-bold text-white outline-none transition-all focus:shadow-[0_0_0_3px_rgba(255,106,0,0.15)]"
              />
            </div>

            <button 
              className="w-full py-3 rounded-xl bg-primary hover:bg-accent disabled:bg-neutral-800 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              onClick={handleSaveFulfillment}
              disabled={submittingFulfillment}
            >
              {submittingFulfillment ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating Status...</span>
                </>
              ) : (
                <>
                  <Truck className="w-3.5 h-3.5" />
                  <span>Confirm Shipment</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
