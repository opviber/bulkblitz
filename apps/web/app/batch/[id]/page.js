"use client";

import { useState, useEffect, use, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LiveTimer from "@/components/batch/LiveTimer";
import {
  formatPrice,
  getCurrentTier,
  getSavingsPercent,
  getTimeRemaining,
  getSlotsToNextTier,
  getInitials,
} from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Star, MapPin, Check, Plus, Minus, Share2, Clock, Loader2, ShieldCheck, ChevronLeft, X, AlertCircle } from "lucide-react";

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

    // Subscribe to changes in the Batch table
    const batchChannel = supabase
      .channel(`batch-realtime-${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Batch",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          console.log("Realtime batch update received:", payload.new);
          setBatch((prev) => {
            if (!prev) return prev;
            const prevPrice = getCurrentTier(prev)?.price || 0;
            const updatedBatch = {
              ...prev,
              currentSlots: payload.new.currentSlots,
              status: payload.new.status,
            };
            const newPrice = getCurrentTier(updatedBatch)?.price || 0;
            if (newPrice < prevPrice) {
              setPriceDropped(true);
              setTimeout(() => setPriceDropped(false), 4000);
            }
            return updatedBatch;
          });
        }
      )
      .subscribe();

    // Subscribe to insertions in SlotReservation table
    const reservationChannel = supabase
      .channel(`reservation-realtime-${id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "SlotReservation",
          filter: `batchId=eq.${id}`,
        },
        (payload) => {
          console.log("Realtime reservation received:", payload.new);
          const qtyJoined = payload.new.quantity;
          setRecentJoinAlert(`A buyer just reserved ${qtyJoined} slot(s)!`);
          setTimeout(() => setRecentJoinAlert(null), 4000);
          
          // Refresh batch data to display the reservation in the UI
          loadBatch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(batchChannel);
      supabase.removeChannel(reservationChannel);
    };
  }, [id, loadBatch]);

  const handleJoinBatch = async () => {
    setJoiningBatch(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchId: id, quantity: selectedQty }),
      });

      if (res.ok) {
        const order = await res.json();
        alert(`Success! You have reserved ${selectedQty} slots.\n₹${order.totalAmount} was debited from your wallet escrow.`);
        router.push("/orders");
      } else {
        const err = await res.json();
        if (err.error && err.error.includes("Insufficient wallet balance")) {
          const confirmGo = window.confirm(
            `${err.error}\n\nWould you like to go to your wallet to load funds?`
          );
          if (confirmGo) {
            router.push("/wallet");
          }
        } else {
          alert(err.error || "Failed to join batch");
        }
      }
    } catch (err) {
      console.error("Error joining batch:", err);
      alert("Server error occurred while joining batch. Please try again.");
    } finally {
      setJoiningBatch(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-24 min-h-screen bg-black text-white font-sans">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="w-full h-[450px] bg-neutral-900/50 border border-white/5 rounded-3xl animate-pulse" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!batch) {
    return (
      <>
        <Header />
        <main className="pt-24 min-h-screen bg-black text-white font-sans flex items-center justify-center">
          <div className="text-center space-y-6 p-6">
            <AlertCircle className="w-16 h-16 text-primary mx-auto" />
            <h1 className="text-3xl font-extrabold tracking-tight">Batch listing not found</h1>
            <p className="text-neutral-400 max-w-sm mx-auto">
              This batch listing may have closed, been cancelled, or does not exist.
            </p>
            <Link href="/" className="inline-flex bg-gradient-to-r from-primary to-orange-600 hover:from-primary-hover hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all cursor-pointer">
              ← Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const manufacturer = batch.manufacturer
    ? {
        ...batch.manufacturer,
        name: batch.manufacturer.businessName,
        avatar: getInitials(batch.manufacturer.businessName),
      }
    : null;

  const currentTier = getCurrentTier(batch);
  const savingsPercent = getSavingsPercent(batch);
  const slotsToNext = getSlotsToNextTier(batch);
  const fillPercent = Math.min((batch.currentSlots / batch.maxSlots) * 100, 100);
  const nextTier = batch.tiers.find((t) => t.minSlots > batch.currentSlots);

  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen bg-black text-white font-sans">
        <div className="max-w-7xl mx-auto px-6 py-8">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-6 text-xs text-neutral-500">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/" className="hover:text-primary transition-colors">Batches</Link>
            <span>/</span>
            <span className="text-neutral-300 font-medium truncate max-w-[200px]">{batch.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Column — Product (2/3 width on desktop) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Product Image Box */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-tr from-neutral-950 to-neutral-900 flex items-center justify-center">
                {/* Decorative mesh glow */}
                <div className="absolute inset-0 bg-radial-gradient(circle_at_center,rgba(255,107,0,0.1),transparent_60%) pointer-events-none" />
                
                <span className="text-8xl opacity-80 filter drop-shadow-[0_0_24px_rgba(255,107,0,0.25)]">
                  {batch.categoryIcon || "📦"}
                </span>
                
                {/* Badges Overlay */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {batch.status === "LIVE" && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> LIVE
                    </span>
                  )}
                  {savingsPercent > 0 && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 border border-primary/20 text-primary">
                      Save {savingsPercent}%
                    </span>
                  )}
                </div>
              </div>

              {/* Manufacturer Card */}
              <div className="flex gap-4 p-5 bg-white/[0.02] border border-white/5 backdrop-blur-xl rounded-2xl shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-orange-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                  {manufacturer?.avatar || "MF"}
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-base flex items-center gap-2 text-white">
                    {manufacturer?.name}
                    {manufacturer?.gstVerified && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 border border-primary/20 text-primary" title="GST Verified">
                        <ShieldCheck className="w-3 h-3" /> GST Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-neutral-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500" /> {manufacturer?.city}, {manufacturer?.state}
                    </span>
                    <span>•</span>
                    <span>{manufacturer?.yearsInBusiness} yrs in business</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" /> {manufacturer?.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Specifications Card */}
              {batch.specs && (
                <div className="p-6 bg-white/[0.02] border border-white/5 backdrop-blur-xl rounded-2xl shadow-xl">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Product Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(batch.specs).map(([key, value]) => (
                      <div key={key} className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">{key}</span>
                        <span className="text-sm text-neutral-300 font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Card */}
              {batch.reviews && batch.reviews.length > 0 && (
                <div className="p-6 bg-white/[0.02] border border-white/5 backdrop-blur-xl rounded-2xl shadow-xl">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                    Customer Reviews ({batch.reviews.length})
                  </h3>
                  <div className="divide-y divide-white/5">
                    {batch.reviews.map((review, i) => (
                      <div key={i} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="font-semibold text-sm text-white">{review.user}</span>
                          <div className="flex items-center gap-0.5 text-amber-400 text-xs">
                            {Array.from({ length: review.rating }).map((_, rIdx) => (
                              <Star key={rIdx} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-neutral-400 leading-relaxed mb-1">{review.comment}</p>
                        <span className="text-[10px] text-neutral-500">{review.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column — Actions & Tiers (1/3 width on desktop) */}
            <div className="lg:col-span-1">
              <div className={`p-6 bg-white/[0.02] border border-white/5 hover:border-primary/20 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col gap-6 sticky top-24 transition-all duration-300 ${priceDropped ? "ring-2 ring-green-500 shadow-green-500/5 scale-[1.02]" : ""}`}>
                
                {/* Title */}
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-white mb-2 leading-snug">{batch.title}</h1>
                  <p className="text-xs text-neutral-400 leading-relaxed">{batch.description}</p>
                </div>

                {/* Close Timer */}
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" /> Batch closes in
                  </span>
                  <LiveTimer endTime={batch.endTime} />
                </div>

                {/* Current Price */}
                <div className="p-5 bg-green-500/5 border border-green-500/10 rounded-2xl">
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl font-black text-green-400 tabular-nums">
                      {formatPrice(currentTier?.price)}
                    </span>
                    {savingsPercent > 0 && (
                      <span className="text-sm text-neutral-500 line-through">
                        {formatPrice(batch.tiers[0].price)}
                      </span>
                    )}
                    {savingsPercent > 0 && (
                      <span className="px-1.5 py-0.5 rounded bg-green-500 text-[10px] font-black text-white">
                        -{savingsPercent}%
                      </span>
                    )}
                  </div>
                  <span className="block text-[10px] text-neutral-400 font-medium mt-1">
                    per unit · Current pool buying price
                  </span>
                </div>

                {/* Pricing Tiers Ladder */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Price Tiers</h4>
                  <div className="space-y-1.5">
                    {batch.tiers.map((tier, i) => {
                      const isActive = batch.currentSlots >= tier.minSlots && batch.currentSlots <= tier.maxSlots;
                      const isReached = batch.currentSlots >= tier.minSlots;
                      return (
                        <div
                          key={i}
                          className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${isActive ? "bg-primary/5 border border-primary/20" : "bg-transparent border border-transparent"}`}
                        >
                          <div className="flex flex-col items-center shrink-0">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[8px] font-black ${isReached ? "bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/20" : "border-white/15 text-white/40 bg-white/5"}`}>
                              {isReached && <Check className="w-2.5 h-2.5 stroke-[4]" />}
                            </div>
                          </div>
                          <div className="flex justify-between items-center flex-1 text-xs">
                            <span className={`font-semibold ${isReached ? "text-neutral-200" : "text-neutral-500"}`}>
                              {tier.minSlots}–{tier.maxSlots} slots
                            </span>
                            <span className={`font-bold ${isReached ? "text-white" : "text-neutral-500"}`}>
                              {formatPrice(tier.price)}
                            </span>
                          </div>
                          {isActive && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-primary/10 border border-primary/20 text-primary uppercase tracking-wide">
                              Current
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Progress Tracker */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-neutral-400">
                    <span>{batch.currentSlots} of {batch.maxSlots} slots filled</span>
                    <span className="text-white">{Math.round(fillPercent)}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-green-500 rounded-full transition-all duration-1000 shadow-md shadow-primary/50"
                      style={{ width: `${fillPercent}%` }}
                    />
                  </div>
                  {nextTier && (
                    <div className="p-3 bg-primary/5 border border-primary/10 rounded-xl text-xs text-primary flex items-center gap-1.5 leading-relaxed">
                      <span>🔥 <strong>{slotsToNext} more slots</strong> needed to drop the price to <strong>{formatPrice(nextTier.price)}</strong></span>
                    </div>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest">Quantity (slots)</label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 shrink-0">
                      <button
                        className="w-8 h-8 rounded-lg hover:bg-white/10 active:bg-white/5 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-white font-bold"
                        onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                        disabled={selectedQty <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-base text-white">{selectedQty}</span>
                      <button
                        className="w-8 h-8 rounded-lg hover:bg-white/10 active:bg-white/5 flex items-center justify-center transition-colors cursor-pointer text-white font-bold"
                        onClick={() => setSelectedQty(selectedQty + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-xs text-neutral-400">
                      Total: <strong className="text-white text-base ml-1">{formatPrice(currentTier?.price * selectedQty)}</strong>
                    </span>
                  </div>
                </div>

                {/* Reserve & Share Actions */}
                <div className="space-y-3">
                  <button
                    className="w-full bg-gradient-to-r from-primary to-orange-600 hover:from-primary-hover hover:to-orange-700 disabled:from-neutral-800 disabled:to-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 hover:shadow-lg hover:shadow-primary/10 cursor-pointer text-sm"
                    onClick={handleJoinBatch}
                    disabled={joiningBatch}
                  >
                    {joiningBatch ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <span>Join This Batch — {formatPrice(currentTier?.price * selectedQty)}</span>
                    )}
                  </button>
                  <button
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
                    onClick={() => setShowShareModal(true)}
                  >
                    <Share2 className="w-4 h-4 text-neutral-400" />
                    <span>Share to Drop the Price</span>
                  </button>
                </div>

                {/* Trust Features */}
                <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-xl space-y-2 text-[11px] text-neutral-400 leading-relaxed">
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-bold">🔒</span> Card held, not charged until batch closes
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-bold">🔄</span> Full refund if batch cancels
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-bold">📦</span> Ships in {batch.shipping?.estimatedDays || 5}-{(batch.shipping?.estimatedDays || 5) + 2} days
                  </div>
                </div>

                {/* Recent Joiners */}
                {batch.recentJoiners && batch.recentJoiners.length > 0 && (
                  <div className="flex items-center gap-2.5 pt-2 border-t border-white/5">
                    <div className="flex -space-x-2">
                      {batch.recentJoiners.slice(0, 5).map((j, i) => (
                        <div key={i} className="w-7 h-7 rounded-full bg-neutral-800 border-2 border-black flex items-center justify-center text-[10px] font-bold text-white shrink-0">
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

      {/* Real-time Join Notification Toast */}
      {recentJoinAlert && (
        <div className="fixed bottom-6 right-6 p-4 bg-neutral-900 border border-green-500 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-bounce backdrop-blur-xl">
          <span className="text-lg">⚡</span>
          <p className="text-sm font-semibold text-white leading-none">{recentJoinAlert}</p>
        </div>
      )}

      {/* Share Modal Dialog */}
      {showShareModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setShowShareModal(false)}
        >
          <div 
            className="bg-neutral-950 border border-white/10 p-6 rounded-2xl max-w-sm w-full relative shadow-2xl space-y-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
              onClick={() => setShowShareModal(false)}
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold text-white pr-8">Share This Batch</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Every person who joins through your link drops the price for everyone — including you!
            </p>
            <div className="flex flex-col gap-2.5 pt-2">
              <button 
                className="w-full bg-[#128c7e] hover:bg-[#075e54] text-white font-bold py-3 px-4 rounded-xl text-sm transition-all cursor-pointer"
                onClick={() => {
                  alert("WhatsApp share link copied to clipboard!");
                  setShowShareModal(false);
                }}
              >
                💬 Share on WhatsApp
              </button>
              <button 
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                  setShowShareModal(false);
                }}
              >
                📋 Copy Batch Link
              </button>
              <button 
                className="w-full bg-neutral-900 hover:bg-neutral-850 border border-white/5 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all cursor-pointer"
                onClick={() => {
                  alert("Twitter post template copied!");
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
