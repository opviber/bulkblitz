"use client";

import { useState, useEffect, use, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LiveTimer from "@/components/batch/LiveTimer";
import TierDropBurst from "@/components/ui/TierDropBurst";
import {
  formatPrice,
  getCurrentTier,
  getSavingsPercent,
  getSlotsToNextTier,
  getInitials,
} from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Star, MapPin, Check, Plus, Minus, Share2, Clock, Loader2,
  ShieldCheck, ChevronLeft, X, AlertCircle, Heart, ChevronDown,
  ChevronUp, Copy, Truck, Package, Users, Info
} from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "When will I be charged?",
    a: "Your wallet is held in escrow when you reserve slots. You are only fully charged once the batch reaches its minimum order quantity (MOQ) and locks.",
  },
  {
    q: "What if the batch doesn't fill up?",
    a: "If the batch closes without reaching its MOQ, your full payment is automatically refunded to your BulkCash wallet within 24 hours.",
  },
  {
    q: "Can I cancel my reservation?",
    a: "You can cancel your reservation at any time before the batch locks. Once locked (MOQ reached), cancellations are subject to the manufacturer's return policy.",
  },
  {
    q: "How does the price drop work?",
    a: "Each pricing tier activates when the slot count crosses a threshold. When a new tier unlocks, EVERYONE in the batch — including you — gets that lower price automatically.",
  },
];

export default function BatchDetailPage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();

  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedQty, setSelectedQty] = useState(1);
  const [showShareModal, setShowShareModal] = useState(false);
  const [priceDropped, setPriceDropped] = useState(false);
  const [recentJoinAlert, setRecentJoinAlert] = useState(null);
  const [joiningBatch, setJoiningBatch] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const loadBatch = useCallback(async function loadBatch() {
    try {
      const res = await fetch(`/api/batches/${id}`);
      if (res.ok) {
        const data = await res.json();
        setBatch(data);
      } else {
        setBatch(null);
      }
    } catch (err) {
      console.error("Failed to load batch details:", err);
      setBatch(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    loadBatch();

    const batchChannel = supabase
      .channel(`batch:${id}`)          // must match server broadcastBatchUpdate channel
      .on("broadcast", { event: "PRICE_UPDATED" }, ({ payload }) => {
        setBatch((prev) => {
          if (!prev) return prev;
          const prevPrice = getCurrentTier(prev)?.price || 0;
          const updated = { ...prev, currentSlots: payload.currentSlots };
          const newPrice = getCurrentTier(updated)?.price || 0;
          if (newPrice < prevPrice) {
            setPriceDropped(true);
            setTierBurstKey((k) => k + 1);
            setTimeout(() => setPriceDropped(false), 4000);
          }
          return updated;
        });
        setRecentJoinAlert(`Price dropped to ₹${payload.pricePerUnit}/unit!`);
        setTimeout(() => setRecentJoinAlert(null), 5000);
      })
      .on("broadcast", { event: "SLOT_FILLED" }, ({ payload }) => {
        setBatch((prev) => prev ? { ...prev, currentSlots: payload.currentSlots } : prev);
      })
      .on("broadcast", { event: "BATCH_CLOSED" }, ({ payload }) => {
        setBatch((prev) => prev ? { ...prev, status: payload.fulfilled ? "CLOSED" : "CANCELLED" } : prev);
        if (payload.fulfilled) {
          toast.success(`Batch locked at ₹${payload.finalPrice}/unit!`);
        } else {
          toast.error("Batch didn't fill — no charge made.");
        }
      })
      .subscribe();

    // Reservation-level inserts are covered by the SLOT_FILLED broadcast above.
    // Refetch once as a safety net after 3 s in case a broadcast is missed.
    const fallbackTimer = setTimeout(() => loadBatch(), 3000);

    return () => {
      supabase.removeChannel(batchChannel);
      clearTimeout(fallbackTimer);
    };
  }, [id, loadBatch]);

  /** Load the Razorpay checkout SDK script once. */
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleJoinBatch = async () => {
    setJoiningBatch(true);
    try {
      // 1. Atomically reserve slots + create payment hold
      const idempotencyKey = `${id}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const joinRes = await fetch(`/api/batches/${id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: selectedQty, idempotencyKey }),
      });
      const joinData = await joinRes.json();
      if (!joinRes.ok) {
        toast.error(joinData.error || "Could not reserve slots");
        return;
      }

      const { reservation, razorpayOrder } = joinData;

      // 2a. Sandbox mode (no real Razorpay order) → skip checkout
      if (!razorpayOrder || razorpayOrder.sandbox) {
        toast.success(
          `${selectedQty} slot${selectedQty > 1 ? "s" : ""} reserved! Held at ₹${reservation.pricePerUnit}/unit.`,
          { duration: 5000 }
        );
        router.push("/orders");
        return;
      }

      // 2b. Real payment → launch Razorpay checkout
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Payment gateway failed to load. Try again.");
        return;
      }

      await new Promise((resolve, reject) => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: razorpayOrder.amount,
          currency: "INR",
          name: "BulkBlitz",
          description: `${batch.title} — ${selectedQty} slot(s)`,
          order_id: razorpayOrder.id,
          handler: async (response) => {
            // 3. Verify signature + confirm reservation
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: razorpayOrder.amount / 100,
                reservationId: reservation.id,
              }),
            });
            if (verifyRes.ok) {
              toast.success("Payment confirmed! Your slot is locked.", { duration: 5000 });
              router.push("/orders");
              resolve();
            } else {
              const e = await verifyRes.json();
              toast.error(e.error || "Payment verification failed");
              reject(new Error(e.error));
            }
          },
          modal: {
            ondismiss: () => {
              toast.message("Payment cancelled. Your slot reservation was released.");
              // Cancel the reservation to free slots
              fetch(`/api/batches/${id}/cancel-reservation`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reservationId: reservation.id }),
              }).catch(() => {});
              resolve();
            },
          },
          prefill: { name: "", contact: "" },
          theme: { color: "#F97316" },
        };
        new window.Razorpay(options).open();
      });
    } catch (err) {
      console.error("Join error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setJoiningBatch(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  // ── Loading State ──
  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-24 min-h-screen bg-black text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-5">
                <div className="h-64 bg-neutral-900/50 border border-white/5 rounded-2xl animate-pulse" />
                <div className="h-24 bg-neutral-900/50 border border-white/5 rounded-2xl animate-pulse" />
                <div className="h-40 bg-neutral-900/50 border border-white/5 rounded-2xl animate-pulse" />
              </div>
              <div className="h-[480px] bg-neutral-900/50 border border-white/5 rounded-3xl animate-pulse" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Not Found State ──
  if (!batch) {
    return (
      <>
        <Header />
        <main className="pt-24 min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center space-y-6 p-6 max-w-md">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Batch not found</h1>
            <p className="text-neutral-400 text-sm leading-relaxed">
              This batch may have closed, been cancelled, or does not exist.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all cursor-pointer shadow-lg shadow-primary/20"
            >
              <ChevronLeft className="w-4 h-4" /> Browse Active Batches
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const manufacturer = batch.manufacturer
    ? { ...batch.manufacturer, name: batch.manufacturer.businessName, avatar: getInitials(batch.manufacturer.businessName) }
    : null;

  const currentTier = getCurrentTier(batch);
  const savingsPercent = getSavingsPercent(batch);
  const slotsToNext = getSlotsToNextTier(batch);
  const fillPercent = Math.min((batch.currentSlots / batch.maxSlots) * 100, 100);
  const nextTier = batch.tiers.find((t) => t.minSlots > batch.currentSlots);
  const totalCost = (currentTier?.price || 0) * selectedQty;

  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen bg-black text-white font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

          {/* ── Breadcrumb ── */}
          <nav className="flex items-center gap-2 mb-6 text-xs text-neutral-500">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/" className="hover:text-primary transition-colors">Batches</Link>
            <span>/</span>
            <span className="text-neutral-300 font-medium truncate max-w-[200px]">{batch.title}</span>
          </nav>

          {/* ── Price Drop Banner ── */}
          {priceDropped && (
            <div className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="font-bold text-green-400 text-sm">Price just dropped!</p>
                <p className="text-xs text-neutral-400">A new pricing tier has unlocked. Your cost is now lower!</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* ══════════════════════════════════
                LEFT COLUMN — Product Details (2/3)
                ══════════════════════════════════ */}
            <div className="lg:col-span-2 space-y-6">

              {/* Product Hero Image */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-tr from-neutral-950 to-neutral-900 flex items-center justify-center">
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,107,0,0.08),transparent_65%)]" />
                <span className="text-8xl opacity-90 drop-shadow-[0_0_32px_rgba(255,107,0,0.3)] select-none">
                  {batch.categoryIcon || "📦"}
                </span>

                {/* Status + Savings Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {batch.status === "LIVE" && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/15 border border-green-500/25 text-green-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      LIVE
                    </span>
                  )}
                  {savingsPercent > 0 && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/15 border border-primary/25 text-primary">
                      Save up to {savingsPercent}%
                    </span>
                  )}
                </div>

                {/* Wishlist button */}
                <button
                  className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                    isWishlisted
                      ? "bg-red-500/20 border-red-500/30 text-red-400"
                      : "bg-black/40 border-white/10 text-white/50 hover:text-white hover:border-white/20"
                  }`}
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Manufacturer Card */}
              <div className="flex gap-4 p-5 bg-white/[0.02] border border-white/5 backdrop-blur-xl rounded-2xl shadow-xl hover:border-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-orange-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                  {manufacturer?.avatar || "MF"}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="font-bold text-base flex flex-wrap items-center gap-2 text-white">
                    {manufacturer?.name}
                    {manufacturer?.gstVerified && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 border border-primary/20 text-primary">
                        <ShieldCheck className="w-3 h-3" /> GST Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                      {manufacturer?.city}, {manufacturer?.state}
                    </span>
                    {manufacturer?.yearsInBusiness && (
                      <>
                        <span className="text-neutral-700">•</span>
                        <span>{manufacturer.yearsInBusiness} yrs in business</span>
                      </>
                    )}
                    {manufacturer?.rating && (
                      <>
                        <span className="text-neutral-700">•</span>
                        <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" /> {manufacturer.rating}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right text-[10px] font-bold text-neutral-500 flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 text-neutral-300">
                    <Package className="w-3.5 h-3.5" />
                    <span>{batch.currentSlots} buyers</span>
                  </div>
                </div>
              </div>

              {/* Product Description */}
              {batch.description && (
                <div className="p-6 bg-white/[0.02] border border-white/5 backdrop-blur-xl rounded-2xl shadow-xl">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">About This Product</h3>
                  <p className="text-sm text-neutral-300 leading-relaxed">{batch.description}</p>
                </div>
              )}

              {/* Product Specifications */}
              {batch.specs && (
                <div className="p-6 bg-white/[0.02] border border-white/5 backdrop-blur-xl rounded-2xl shadow-xl">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Specifications</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {Object.entries(batch.specs).map(([key, value]) => (
                      <div key={key} className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">{key}</span>
                        <span className="text-sm text-neutral-200 font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              {batch.reviews?.length > 0 && (
                <div className="p-6 bg-white/[0.02] border border-white/5 backdrop-blur-xl rounded-2xl shadow-xl">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                    Verified Buyer Reviews ({batch.reviews.length})
                  </h3>
                  <div className="divide-y divide-white/5">
                    {batch.reviews.map((review, i) => (
                      <div key={i} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="font-semibold text-sm text-white">{review.user}</span>
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {Array.from({ length: review.rating }).map((_, rIdx) => (
                              <Star key={rIdx} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-neutral-400 leading-relaxed mb-1">{review.comment}</p>
                        <span className="text-[10px] text-neutral-600">{review.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ Accordion */}
              <div className="p-6 bg-white/[0.02] border border-white/5 backdrop-blur-xl rounded-2xl shadow-xl">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" />
                  Frequently Asked Questions
                </h3>
                <div className="space-y-2">
                  {FAQ_ITEMS.map((item, i) => (
                    <div key={i} className="border border-white/5 rounded-xl overflow-hidden">
                      <button
                        className="w-full flex items-center justify-between px-4 py-3 text-left text-xs font-bold text-white hover:bg-white/3 transition-colors cursor-pointer"
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      >
                        <span>{item.q}</span>
                        {openFaq === i ? (
                          <ChevronUp className="w-4 h-4 text-neutral-500 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />
                        )}
                      </button>
                      {openFaq === i && (
                        <div className="px-4 pb-4 text-xs text-neutral-400 leading-relaxed border-t border-white/5 pt-3">
                          {item.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════
                RIGHT COLUMN — Actions (1/3)
                ══════════════════════════════════ */}
            <div className="lg:col-span-1">
              <div
                className={`p-6 bg-white/[0.02] border backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col gap-5 sticky top-24 transition-all duration-300 ${
                  priceDropped
                    ? "border-green-500/40 ring-2 ring-green-500/20 shadow-green-500/10"
                    : "border-white/5 hover:border-primary/15"
                }`}
              >
                {/* Title & Description */}
                <div>
                  <h1 className="text-xl font-black tracking-tight text-white mb-1.5 leading-snug">{batch.title}</h1>
                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">{batch.description}</p>
                </div>

                {/* Timer */}
                <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" /> Batch closes in
                  </span>
                  <LiveTimer endTime={batch.endTime} />
                </div>

                {/* Current Price */}
                <div className="p-4 bg-green-500/5 border border-green-500/15 rounded-2xl">
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <span className="text-3xl font-black text-green-400 tabular-nums">
                      {formatPrice(currentTier?.price)}
                    </span>
                    {savingsPercent > 0 && (
                      <>
                        <span className="text-sm text-neutral-500 line-through">
                          {formatPrice(batch.tiers[0].price)}
                        </span>
                        <span className="px-1.5 py-0.5 rounded-full bg-green-500 text-[10px] font-black text-white">
                          -{savingsPercent}%
                        </span>
                      </>
                    )}
                  </div>
                  <span className="block text-[10px] text-neutral-400 mt-1">per unit · Current pool price</span>
                </div>

                {/* Tiers Ladder */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Price Tiers</h4>
                  <div className="space-y-1">
                    {batch.tiers.map((tier, i) => {
                      const isActive = batch.currentSlots >= tier.minSlots && batch.currentSlots <= tier.maxSlots;
                      const isReached = batch.currentSlots >= tier.minSlots;
                      return (
                        <div
                          key={i}
                          className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                            isActive ? "bg-primary/8 border border-primary/20" : "bg-transparent border border-transparent"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            isReached
                              ? "bg-green-500 border-green-500 text-white shadow-[0_0_8px_rgba(34,197,94,0.25)]"
                              : "border-white/15 bg-white/3"
                          }`}>
                            {isReached && <Check className="w-2.5 h-2.5 stroke-[4]" />}
                          </div>
                          <div className="flex justify-between items-center flex-1 text-xs">
                            <span className={`font-semibold ${isReached ? "text-neutral-200" : "text-neutral-600"}`}>
                              {tier.minSlots}–{tier.maxSlots} slots
                            </span>
                            <span className={`font-bold tabular-nums ${isReached ? "text-white" : "text-neutral-600"}`}>
                              {formatPrice(tier.price)}
                            </span>
                          </div>
                          {isActive && (
                            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-primary/15 border border-primary/25 text-primary uppercase">
                              Now
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {batch.currentSlots} / {batch.maxSlots} slots
                    </span>
                    <span className="text-white tabular-nums">{Math.round(fillPercent)}%</span>
                  </div>
                  <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-green-500 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(255,107,0,0.4)]"
                      style={{ width: `${fillPercent}%` }}
                    />
                  </div>
                  {nextTier && (
                    <div className="p-3 bg-primary/5 border border-primary/12 rounded-xl text-xs text-primary flex items-center gap-1.5 leading-relaxed">
                      🔥 <strong>{slotsToNext} more slots</strong> to unlock <strong>{formatPrice(nextTier.price)}</strong>/unit
                    </div>
                  )}
                </div>

                {/* Quantity Selector */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                    Slots to Reserve
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 shrink-0">
                      <button
                        className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-white font-bold"
                        onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                        disabled={selectedQty <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-black text-base text-white">{selectedQty}</span>
                      <button
                        className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer text-white font-bold"
                        onClick={() => setSelectedQty(Math.min(selectedQty + 1, batch.maxSlots - batch.currentSlots))}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-500">Total</span>
                      <p className="text-base font-black text-white tabular-nums">{formatPrice(totalCost)}</p>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-2.5">
                  <button
                    className="w-full bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-neutral-800 disabled:to-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/20 cursor-pointer text-sm"
                    onClick={handleJoinBatch}
                    disabled={joiningBatch || batch.status !== "LIVE"}
                  >
                    {joiningBatch ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Reserving…</>
                    ) : batch.status !== "LIVE" ? (
                      "Batch Closed"
                    ) : (
                      `Join — ${formatPrice(totalCost)}`
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/8 border border-white/10 text-neutral-300 hover:text-white font-bold py-2.5 px-3 rounded-xl transition-all cursor-pointer text-xs"
                      onClick={() => setShowShareModal(true)}
                    >
                      <Share2 className="w-3.5 h-3.5" /> Share
                    </button>
                    <button
                      className={`flex items-center justify-center gap-1.5 border font-bold py-2.5 px-3 rounded-xl transition-all cursor-pointer text-xs ${
                        isWishlisted
                          ? "bg-red-500/10 border-red-500/25 text-red-400 hover:bg-red-500/15"
                          : "bg-white/5 border-white/10 text-neutral-300 hover:text-white hover:bg-white/8"
                      }`}
                      onClick={() => setIsWishlisted(!isWishlisted)}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-current" : ""}`} />
                      {isWishlisted ? "Saved" : "Save"}
                    </button>
                  </div>
                </div>

                {/* Trust Signals */}
                <div className="p-3.5 bg-white/[0.015] border border-white/5 rounded-xl space-y-2 text-[11px] text-neutral-400 leading-relaxed">
                  <div className="flex items-center gap-2">
                    <span className="text-primary">🔒</span>
                    <span>Wallet held in escrow — not charged until MOQ is met</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">🔄</span>
                    <span>Full refund if batch cancels or doesn't fill</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400">📦</span>
                    <span>Ships in {batch.shipping?.estimatedDays || 5}–{(batch.shipping?.estimatedDays || 5) + 2} business days</span>
                  </div>
                </div>

                {/* Recent Joiners */}
                {batch.recentJoiners?.length > 0 && (
                  <div className="flex items-center gap-2.5 pt-1 border-t border-white/5">
                    <div className="flex -space-x-2">
                      {batch.recentJoiners.slice(0, 5).map((j, i) => (
                        <div key={i} className="w-7 h-7 rounded-full bg-neutral-800 border-2 border-black flex items-center justify-center text-[10px] font-bold text-white">
                          {j.avatar}
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] text-neutral-500 font-semibold">
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

      {/* ── Mobile sticky "Join" bar — visible only on small screens ── */}
      {batch && batch.status === "LIVE" && (
        <div className="fixed bottom-16 left-0 right-0 z-40 flex md:hidden px-4 pb-2 pt-2 bg-gradient-to-t from-black via-black/95 to-transparent pointer-events-none">
          <button
            onClick={() => {
              // Scroll to the desktop join panel so the action is clear on tablet
              document.getElementById("join-panel")?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
            className="pointer-events-auto w-full h-14 rounded-2xl bg-[var(--color-brand,#F97316)] text-black font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30"
          >
            Join batch · {batch.tiers ? `₹${Math.min(...batch.tiers.map(t => t.price))}/unit` : ""}
          </button>
        </div>
      )}

      {/* ── Real-time Toast ── */}
      {recentJoinAlert && (
        <div className="fixed bottom-6 right-6 p-4 bg-neutral-900 border border-green-500/50 rounded-xl shadow-2xl flex items-center gap-3 z-50 backdrop-blur-xl max-w-xs">
          <span className="text-lg shrink-0">⚡</span>
          <p className="text-sm font-semibold text-white leading-snug">{recentJoinAlert}</p>
        </div>
      )}

      {/* ── Share Modal ── */}
      {showShareModal && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-6"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="bg-neutral-950 border border-white/10 p-6 rounded-2xl max-w-sm w-full relative shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
              onClick={() => setShowShareModal(false)}
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-black text-white pr-8">Share This Batch</h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Every new buyer drops the price for <strong className="text-white">everyone</strong> in the batch — including you!
              </p>
            </div>

            {/* Copy link */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/3 border border-white/5">
              <span className="text-xs text-neutral-400 flex-1 truncate font-mono">
                {typeof window !== "undefined" ? window.location.href : ""}
              </span>
              <button
                onClick={handleCopyLink}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  linkCopied
                    ? "bg-green-500 text-white"
                    : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white"
                }`}
              >
                {linkCopied ? <><Check className="w-3.5 h-3.5 inline mr-1" />Copied</> : <><Copy className="w-3.5 h-3.5 inline mr-1" />Copy</>}
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <button
                className="w-full bg-[#128c7e] hover:bg-[#075e54] text-white font-bold py-3 px-4 rounded-xl text-sm transition-all cursor-pointer"
                onClick={() => {
                  const url = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";
                  window.open(`https://api.whatsapp.com/send?text=🔥 Join this batch on BulkBlitz and get up to ${savingsPercent}% off! ${url}`, "_blank");
                  setShowShareModal(false);
                }}
              >
                💬 Share on WhatsApp
              </button>
              <button
                className="w-full bg-neutral-900 hover:bg-neutral-800 border border-white/5 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all cursor-pointer"
                onClick={() => {
                  const url = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";
                  window.open(`https://twitter.com/intent/tweet?text=🔥 Pooling demand to crush prices on BulkBlitz! Join this batch to unlock factory pricing: ${url}`, "_blank");
                  setShowShareModal(false);
                }}
              >
                𝕏 Share on Twitter / X
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
