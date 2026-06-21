"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CATEGORIES } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";
import { Loader2, ArrowRight, ArrowLeft, Plus, Trash2, Calendar, FileText } from "lucide-react";

export default function CreateBatchWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [batchData, setBatchData] = useState({
    title: "",
    description: "",
    category: "fmcg",
    moq: 10,
    maxSlots: 100,
    endTime: "",
    weight: "",
    material: "",
    certification: "",
  });

  const [tiers, setTiers] = useState([
    { minSlots: 1, maxSlots: 20, price: "" },
    { minSlots: 21, maxSlots: 50, price: "" },
    { minSlots: 51, maxSlots: 100, price: "" },
  ]);

  const handleAddField = () => {
    const lastTier = tiers[tiers.length - 1];
    const nextMin = lastTier ? parseInt(lastTier.maxSlots) + 1 : 1;
    const nextMax = lastTier ? parseInt(lastTier.maxSlots) * 2 : 50;
    setTiers([...tiers, { minSlots: nextMin, maxSlots: nextMax, price: "" }]);
  };

  const handleRemoveField = (idx) => {
    if (tiers.length === 1) return;
    setTiers(tiers.filter((_, i) => i !== idx));
  };

  const handleTierChange = (idx, field, val) => {
    const updated = [...tiers];
    updated[idx][field] = val;
    setTiers(updated);
  };

  const handleLaunch = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/batches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: batchData.title,
          description: batchData.description,
          category: batchData.category,
          moq: parseInt(batchData.moq),
          maxSlots: parseInt(batchData.maxSlots),
          endTime: new Date(batchData.endTime).toISOString(),
          tiers: tiers.map((t) => ({
            minSlots: parseInt(t.minSlots),
            maxSlots: parseInt(t.maxSlots),
            price: parseFloat(t.price)
          }))
        })
      });

      if (res.ok) {
        alert("Batch Launched successfully! Your listing is now LIVE.");
        router.push("/manufacturer");
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to launch batch listing");
      }
    } catch (err) {
      console.error("Error launching batch:", err);
      alert("An unexpected error occurred during launch. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="pt-24 pb-16 min-h-screen bg-black text-white font-sans bg-[radial-gradient(circle_at_center_top,rgba(255,107,0,0.03),transparent_50%)]">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Page Title & Progress */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Launch a New Batch</h1>
            <p className="text-sm text-neutral-400 mb-8">Create a dynamic, crowd-powered volume pricing batch in minutes.</p>
            
            {/* Stepper Status Indicator */}
            <div className="flex justify-between items-center relative max-w-xl">
              <div className="absolute top-[18px] left-[5%] right-[5%] h-[2px] bg-white/10 z-1" />
              <div 
                className="absolute top-[18px] left-[5%] h-[2px] bg-primary transition-all duration-300 z-1"
                style={{ width: `${((step - 1) / 2) * 90}%` }}
              />

              {[
                { num: 1, label: "Product Info" },
                { num: 2, label: "Price Tiers" },
                { num: 3, label: "Preview & Launch" },
              ].map((s) => (
                <div 
                  key={s.num} 
                  className="flex flex-col items-center gap-2 relative z-2"
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all border-2 ${step >= s.num ? (step === s.num ? "bg-primary border-primary text-white shadow-lg shadow-primary/45 scale-110" : "bg-primary/10 border-primary text-primary") : "bg-neutral-900 border-white/10 text-neutral-500"}`}>
                    {s.num}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${step === s.num ? "text-primary" : (step > s.num ? "text-neutral-300" : "text-neutral-500")}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Wizard Body */}
          <div className="p-6 sm:p-8 bg-white/[0.02] border border-white/5 backdrop-blur-xl rounded-3xl shadow-2xl">
            
            {/* STEP 1: PRODUCT INFO */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Step 1: Catalog Details</h3>
                  <p className="text-xs text-neutral-400">Enter your product information, metadata, and scheduled time window.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest">Batch Listing Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Premium Basmati Rice (100% Organic, 1kg)"
                      value={batchData.title}
                      onChange={(e) => setBatchData({ ...batchData, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 font-semibold text-sm text-white focus:outline-none focus:border-primary focus:bg-white/10 focus:ring-4 focus:ring-primary/10 transition-all placeholder-neutral-600"
                      required
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest">Product Description</label>
                    <textarea
                      rows={4}
                      placeholder="Describe raw materials, certifications, bulk shipping packaging info, etc..."
                      value={batchData.description}
                      onChange={(e) => setBatchData({ ...batchData, description: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 font-semibold text-sm text-white focus:outline-none focus:border-primary focus:bg-white/10 focus:ring-4 focus:ring-primary/10 transition-all placeholder-neutral-600"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest">Product Category</label>
                    <select
                      value={batchData.category}
                      onChange={(e) => setBatchData({ ...batchData, category: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 font-semibold text-sm text-white focus:outline-none focus:border-primary focus:bg-white/10 focus:ring-4 focus:ring-primary/10 transition-all"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id} className="bg-neutral-900 text-white">
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest">Batch Close Date</label>
                    <div className="relative flex items-center">
                      <input
                        type="date"
                        value={batchData.endTime}
                        onChange={(e) => setBatchData({ ...batchData, endTime: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 font-semibold text-sm text-white focus:outline-none focus:border-primary focus:bg-white/10 focus:ring-4 focus:ring-primary/10 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest">Min Order Quantity (MOQ)</label>
                    <input
                      type="number"
                      value={batchData.moq}
                      onChange={(e) => setBatchData({ ...batchData, moq: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 font-semibold text-sm text-white focus:outline-none focus:border-primary focus:bg-white/10 focus:ring-4 focus:ring-primary/10 transition-all placeholder-neutral-600"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest">Max Target Slots Available</label>
                    <input
                      type="number"
                      value={batchData.maxSlots}
                      onChange={(e) => setBatchData({ ...batchData, maxSlots: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 font-semibold text-sm text-white focus:outline-none focus:border-primary focus:bg-white/10 focus:ring-4 focus:ring-primary/10 transition-all placeholder-neutral-600"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest">Material / Composition</label>
                    <input
                      type="text"
                      placeholder="e.g. 100% Cotton, Stainless Steel"
                      value={batchData.material}
                      onChange={(e) => setBatchData({ ...batchData, material: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 font-semibold text-sm text-white focus:outline-none focus:border-primary focus:bg-white/10 focus:ring-4 focus:ring-primary/10 transition-all placeholder-neutral-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest">Weight / Packaging Size</label>
                    <input
                      type="text"
                      placeholder="e.g. 1 kg, 500 ml"
                      value={batchData.weight}
                      onChange={(e) => setBatchData({ ...batchData, weight: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 font-semibold text-sm text-white focus:outline-none focus:border-primary focus:bg-white/10 focus:ring-4 focus:ring-primary/10 transition-all placeholder-neutral-600"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest">Product Images</label>
                    <div className="border border-dashed border-white/15 rounded-2xl p-8 text-center bg-white/[0.01] hover:bg-white/[0.02] hover:border-primary/30 transition-all cursor-pointer">
                      <div className="text-3xl mb-2">📁</div>
                      <p className="text-sm font-semibold text-neutral-200">Drag and drop product images here, or <span className="text-primary hover:underline">browse files</span></p>
                      <span className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mt-1">Supports PNG, JPG (Max 5MB each)</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/5">
                  <button 
                    className="bg-gradient-to-r from-primary to-orange-600 hover:from-primary-hover hover:to-orange-700 disabled:from-neutral-800 disabled:to-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer text-sm"
                    onClick={() => setStep(2)}
                    disabled={!batchData.title || !batchData.description || !batchData.endTime}
                  >
                    Next Step: Pricing Tiers <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PRICING TIERS */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Step 2: Dynamic Pricing Ladder</h3>
                  <p className="text-xs text-neutral-400">Establish different price points. As more buyers reserve slots, the final price drops for everyone.</p>
                </div>

                <div className="space-y-4">
                  {tiers.map((tier, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-end sm:items-center gap-4 p-4 bg-white/[0.01] border border-white/5 rounded-2xl relative group">
                      <div className="absolute top-4 left-4 sm:relative sm:top-0 sm:left-0 px-2.5 py-1 rounded bg-neutral-900 border border-white/10 text-[10px] font-bold text-neutral-300">
                        Tier {idx + 1}
                      </div>
                      
                      <div className="w-full sm:flex-1 space-y-1.5">
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Min Slots</label>
                        <input
                          type="number"
                          value={tier.minSlots}
                          onChange={(e) => handleTierChange(idx, "minSlots", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 font-semibold text-sm text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-all"
                        />
                      </div>
                      
                      <div className="w-full sm:flex-1 space-y-1.5">
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Max Slots</label>
                        <input
                          type="number"
                          value={tier.maxSlots}
                          onChange={(e) => handleTierChange(idx, "maxSlots", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 font-semibold text-sm text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-all"
                        />
                      </div>

                      <div className="w-full sm:flex-1 space-y-1.5">
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Price Per Unit (₹)</label>
                        <input
                          type="number"
                          placeholder="e.g. 250"
                          value={tier.price}
                          onChange={(e) => handleTierChange(idx, "price", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 font-semibold text-sm text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-all placeholder-neutral-600"
                        />
                      </div>

                      <button 
                        className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed shrink-0 mt-6"
                        onClick={() => handleRemoveField(idx)}
                        disabled={tiers.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <button 
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs mb-6" 
                  onClick={handleAddField}
                >
                  <Plus className="w-3.5 h-3.5" /> Add Price Drop Tier
                </button>

                <div className="flex justify-between pt-4 border-t border-white/5">
                  <button 
                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer text-sm" 
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button 
                    className="bg-gradient-to-r from-primary to-orange-600 hover:from-primary-hover hover:to-orange-700 disabled:from-neutral-800 disabled:to-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer text-sm"
                    onClick={() => setStep(3)}
                    disabled={tiers.some((t) => !t.price || !t.minSlots || !t.maxSlots)}
                  >
                    Next Step: Preview & Launch <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PREVIEW & LAUNCH */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Step 3: Confirm and Launch</h3>
                  <p className="text-xs text-neutral-400">Verify your details. Launching will immediately list this batch on the homepage discover feed.</p>
                </div>

                <div className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl space-y-4">
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Product Name</span>
                    <span className="text-sm font-semibold text-white">{batchData.title}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Category</span>
                    <span className="text-sm font-semibold text-white uppercase">{batchData.category}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">MOQ Target</span>
                    <span className="text-sm font-semibold text-white">{batchData.moq} slots</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Closing Date</span>
                    <span className="text-sm font-semibold text-white">{batchData.endTime}</span>
                  </div>
                  <div className="flex flex-col gap-2 py-2">
                    <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Dynamic Pricing Tiers</span>
                    <div className="flex flex-wrap gap-2">
                      {tiers.map((t, idx) => (
                        <div key={idx} className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary font-semibold">
                          {t.minSlots}-{t.maxSlots} slots: {formatPrice(t.price)}/unit
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-white/5">
                  <button 
                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer text-sm" 
                    onClick={() => setStep(2)}
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button 
                    className="bg-gradient-to-r from-primary to-orange-600 hover:from-primary-hover hover:to-orange-700 disabled:from-neutral-800 disabled:to-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer text-sm"
                    onClick={handleLaunch}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>🚀 Launch Batch Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
