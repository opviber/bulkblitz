"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CATEGORIES } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";
import { 
  Loader2, ArrowRight, ArrowLeft, Plus, Trash2, Calendar, 
  FileText, Package, Check, AlertCircle, ChevronDown,
  Info, Tag, Upload, Sparkles
} from "lucide-react";

const STEP_CONFIG = [
  { num: 1, label: "Product Info",     icon: Package },
  { num: 2, label: "Price Tiers",      icon: Tag },
  { num: 3, label: "Preview & Launch", icon: Sparkles },
];

const CERTIFICATION_OPTIONS = [
  "FSSAI", "ISO 9001", "BIS", "Agmark", "ISI Mark",
  "CE Mark", "GI Tag", "Organic India", "None"
];

export default function CreateBatchWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadedImages, setUploadedImages] = useState([]);

  const [batchData, setBatchData] = useState({
    title: "",
    description: "",
    category: "fmcg",
    moq: 10,
    maxSlots: 100,
    endTime: "",
    weight: "",
    material: "",
    certification: "None",
    shippingNote: "",
  });

  const [tiers, setTiers] = useState([
    { minSlots: 1,  maxSlots: 20,  price: "" },
    { minSlots: 21, maxSlots: 50,  price: "" },
    { minSlots: 51, maxSlots: 100, price: "" },
  ]);

  const handleAddTier = () => {
    const last = tiers[tiers.length - 1];
    const nextMin = last ? parseInt(last.maxSlots) + 1 : 1;
    const nextMax = last ? parseInt(last.maxSlots) * 2 : 50;
    setTiers([...tiers, { minSlots: nextMin, maxSlots: nextMax, price: "" }]);
  };

  const handleRemoveTier = (idx) => {
    if (tiers.length === 1) return;
    setTiers(tiers.filter((_, i) => i !== idx));
  };

  const handleTierChange = (idx, field, val) => {
    const updated = [...tiers];
    updated[idx][field] = val;
    setTiers(updated);
  };

  const handleFileChange = (files) => {
    const newFiles = Array.from(files).slice(0, 5 - uploadedImages.length);
    const readers = newFiles.map((file) => {
      return new Promise((res) => {
        const reader = new FileReader();
        reader.onloadend = () => res(reader.result);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then((imgs) => {
      setUploadedImages((prev) => [...prev, ...imgs]);
    });
  };

  const handleLaunch = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
            price: parseFloat(t.price),
          })),
        }),
      });

      if (res.ok) {
        alert("🎉 Batch launched successfully! Your listing is now LIVE.");
        router.push("/manufacturer");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to launch batch listing");
      }
    } catch (err) {
      console.error("Error launching batch:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const step1Valid = batchData.title.trim() && batchData.description.trim() && batchData.endTime;
  const step2Valid = tiers.length > 0 && tiers.every((t) => t.price && t.minSlots && t.maxSlots);

  // Savings % between highest and lowest tier
  const highestPrice = tiers[0]?.price ? parseFloat(tiers[0].price) : 0;
  const lowestPrice = tiers[tiers.length - 1]?.price ? parseFloat(tiers[tiers.length - 1].price) : 0;
  const savingsPct = highestPrice > 0 && lowestPrice > 0
    ? Math.round(((highestPrice - lowestPrice) / highestPrice) * 100)
    : 0;

  return (
    <>
      <Header />

      <main className="pt-24 pb-16 min-h-screen bg-black text-white font-sans bg-[radial-gradient(circle_at_top_right,rgba(255,107,0,0.06),transparent_50%)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* ── Page Header ── */}
          <div className="mb-8">
            <Link
              href="/manufacturer"
              className="text-xs text-primary hover:text-orange-400 font-bold inline-flex items-center gap-1 mb-3 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1.5">
              Launch a New Batch
            </h1>
            <p className="text-sm text-neutral-400">
              Create a crowd-powered, dynamic pricing batch in minutes.
            </p>

            {/* ── Multi-Step Indicator ── */}
            <div className="flex justify-between items-center relative max-w-xl mt-8">
              {/* Track */}
              <div className="absolute top-[18px] left-[5%] right-[5%] h-[2px] bg-white/10 z-0" />
              <div
                className="absolute top-[18px] left-[5%] h-[2px] bg-primary transition-all duration-500 z-0"
                style={{ width: `${((step - 1) / 2) * 90}%` }}
              />
              {STEP_CONFIG.map((s) => {
                const StepIcon = s.icon;
                const done = step > s.num;
                const active = step === s.num;
                return (
                  <div key={s.num} className="flex flex-col items-center gap-2 relative z-10">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all border-2 ${
                        done
                          ? "bg-primary border-primary text-white"
                          : active
                          ? "bg-primary border-primary text-white shadow-lg shadow-primary/40 scale-110"
                          : "bg-neutral-900 border-white/10 text-neutral-500"
                      }`}
                    >
                      {done ? <Check className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        active ? "text-primary" : done ? "text-neutral-300" : "text-neutral-500"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Form Card ── */}
          <div className="p-6 sm:p-8 bg-white/[0.02] border border-white/5 backdrop-blur-xl rounded-3xl shadow-2xl">

            {/* ═══ STEP 1: PRODUCT INFO ═══ */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-0.5">Step 1 — Catalog Details</h3>
                  <p className="text-xs text-neutral-400">
                    Enter product information, metadata, and your target batch timeline.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Title */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest">
                      Batch Listing Title <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Premium Basmati Rice (100% Organic, 1kg Bag)"
                      value={batchData.title}
                      onChange={(e) => setBatchData({ ...batchData, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 font-semibold text-sm text-white focus:outline-none focus:border-primary focus:bg-white/10 focus:ring-4 focus:ring-primary/10 transition-all placeholder-neutral-600"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest">
                      Product Description <span className="text-primary">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Describe raw materials, certifications, bulk shipping packaging, quality guarantees…"
                      value={batchData.description}
                      onChange={(e) => setBatchData({ ...batchData, description: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 font-semibold text-sm text-white focus:outline-none focus:border-primary focus:bg-white/10 focus:ring-4 focus:ring-primary/10 transition-all placeholder-neutral-600 resize-none"
                      required
                    />
                    <p className="text-[10px] text-neutral-500">{batchData.description.length}/500 characters</p>
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest">
                      Product Category
                    </label>
                    <div className="relative">
                      <select
                        value={batchData.category}
                        onChange={(e) => setBatchData({ ...batchData, category: e.target.value })}
                        className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl py-3 px-4 font-semibold text-sm text-white focus:outline-none focus:border-primary focus:bg-white/10 focus:ring-4 focus:ring-primary/10 transition-all"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id} className="bg-neutral-900 text-white">
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Batch Close Date */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest">
                      Batch Close Date <span className="text-primary">*</span>
                    </label>
                    <input
                      type="date"
                      value={batchData.endTime}
                      onChange={(e) => setBatchData({ ...batchData, endTime: e.target.value })}
                      min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 font-semibold text-sm text-white focus:outline-none focus:border-primary focus:bg-white/10 focus:ring-4 focus:ring-primary/10 transition-all"
                      required
                    />
                  </div>

                  {/* MOQ */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest">
                      Min. Order Quantity (MOQ)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={batchData.moq}
                      onChange={(e) => setBatchData({ ...batchData, moq: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 font-semibold text-sm text-white focus:outline-none focus:border-primary focus:bg-white/10 focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                  </div>

                  {/* Max Slots */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest">
                      Max Batch Slots
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={batchData.maxSlots}
                      onChange={(e) => setBatchData({ ...batchData, maxSlots: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 font-semibold text-sm text-white focus:outline-none focus:border-primary focus:bg-white/10 focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                  </div>

                  {/* Material */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest">
                      Material / Composition
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 100% Cotton, 304-Grade Steel"
                      value={batchData.material}
                      onChange={(e) => setBatchData({ ...batchData, material: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 font-semibold text-sm text-white focus:outline-none focus:border-primary focus:bg-white/10 focus:ring-4 focus:ring-primary/10 transition-all placeholder-neutral-600"
                    />
                  </div>

                  {/* Weight */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest">
                      Weight / Size per Unit
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1 kg, 500 ml, 200×300mm"
                      value={batchData.weight}
                      onChange={(e) => setBatchData({ ...batchData, weight: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 font-semibold text-sm text-white focus:outline-none focus:border-primary focus:bg-white/10 focus:ring-4 focus:ring-primary/10 transition-all placeholder-neutral-600"
                    />
                  </div>

                  {/* Certifications */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest">
                      Product Certification
                    </label>
                    <div className="relative">
                      <select
                        value={batchData.certification}
                        onChange={(e) => setBatchData({ ...batchData, certification: e.target.value })}
                        className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl py-3 px-4 font-semibold text-sm text-white focus:outline-none focus:border-primary focus:bg-white/10 focus:ring-4 focus:ring-primary/10 transition-all"
                      >
                        {CERTIFICATION_OPTIONS.map((c) => (
                          <option key={c} value={c} className="bg-neutral-900 text-white">{c}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Shipping Note */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest">
                      Shipping Note (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ships from Surat within 48hrs of batch lock"
                      value={batchData.shippingNote}
                      onChange={(e) => setBatchData({ ...batchData, shippingNote: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 font-semibold text-sm text-white focus:outline-none focus:border-primary focus:bg-white/10 focus:ring-4 focus:ring-primary/10 transition-all placeholder-neutral-600"
                    />
                  </div>

                  {/* Product Images upload */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest">
                      Product Images (up to 5)
                    </label>
                    <div
                      className={`border border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                        isDragOver
                          ? "border-primary bg-primary/5"
                          : "border-white/15 bg-white/[0.01] hover:bg-white/[0.02] hover:border-primary/30"
                      }`}
                      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleFileChange(e.dataTransfer.files); }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="text-3xl mb-2">📁</div>
                      <p className="text-sm font-semibold text-neutral-200">
                        Drag & drop product images, or{" "}
                        <span className="text-primary hover:underline">browse files</span>
                      </p>
                      <span className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mt-1">
                        PNG, JPG · Max 2MB each · Up to 5 images
                      </span>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileChange(e.target.files)}
                    />
                    {uploadedImages.length > 0 && (
                      <div className="flex gap-3 flex-wrap mt-3">
                        {uploadedImages.map((src, i) => (
                          <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10 group">
                            <img src={src} alt="" className="w-full h-full object-cover" />
                            <button
                              onClick={(e) => { e.stopPropagation(); setUploadedImages(prev => prev.filter((_, j) => j !== i)); }}
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white text-lg"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/5">
                  <button
                    className="bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-neutral-800 disabled:to-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer text-sm shadow-lg shadow-primary/20"
                    onClick={() => setStep(2)}
                    disabled={!step1Valid}
                  >
                    Next: Pricing Tiers <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ═══ STEP 2: PRICING TIERS ═══ */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-0.5">Step 2 — Dynamic Pricing Ladder</h3>
                  <p className="text-xs text-neutral-400">
                    Set pricing tiers. As more buyers join, the price drops for <em>everyone</em> in the batch.
                  </p>
                </div>

                {/* Tip Banner */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
                  <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    <strong className="text-white">Pro Tip:</strong> Create 3–5 tiers with at least a 10% price drop between each. Larger discounts drive faster slot fills.
                  </p>
                </div>

                <div className="space-y-3">
                  {tiers.map((tier, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row items-end gap-4 p-4 bg-white/[0.01] border border-white/5 rounded-2xl group relative"
                    >
                      <div className="absolute -top-2.5 -left-2 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary">
                        Tier {idx + 1}
                        {idx === 0 && " (Starter)"}
                        {idx === tiers.length - 1 && tiers.length > 1 && " (Best Deal)"}
                      </div>

                      <div className="w-full sm:flex-1 space-y-1.5 mt-2">
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Min Slots</label>
                        <input
                          type="number"
                          min={1}
                          value={tier.minSlots}
                          onChange={(e) => handleTierChange(idx, "minSlots", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 font-semibold text-sm text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-all"
                        />
                      </div>

                      <div className="w-full sm:flex-1 space-y-1.5 mt-2">
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Max Slots</label>
                        <input
                          type="number"
                          min={1}
                          value={tier.maxSlots}
                          onChange={(e) => handleTierChange(idx, "maxSlots", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 font-semibold text-sm text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-all"
                        />
                      </div>

                      <div className="w-full sm:flex-1 space-y-1.5 mt-2">
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                          Price / Unit (₹)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-bold">₹</span>
                          <input
                            type="number"
                            min={0}
                            placeholder="e.g. 250"
                            value={tier.price}
                            onChange={(e) => handleTierChange(idx, "price", e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-7 pr-3 font-semibold text-sm text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-all placeholder-neutral-600"
                          />
                        </div>
                      </div>

                      <button
                        className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0 mt-6 sm:mt-0"
                        onClick={() => handleRemoveTier(idx)}
                        disabled={tiers.length === 1}
                        title="Remove tier"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs"
                  onClick={handleAddTier}
                >
                  <Plus className="w-3.5 h-3.5" /> Add Price Drop Tier
                </button>

                {/* Savings preview */}
                {savingsPct > 0 && (
                  <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/15 flex items-center gap-3">
                    <span className="text-2xl">💰</span>
                    <div>
                      <p className="text-sm font-bold text-white">
                        Buyers save up to <span className="text-green-400">{savingsPct}%</span> at max slots
                      </p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">
                        Price drops from {formatPrice(highestPrice, false)} → {formatPrice(lowestPrice, false)} per unit
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-4 border-t border-white/5">
                  <button
                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer text-sm"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    className="bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-neutral-800 disabled:to-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer text-sm shadow-lg shadow-primary/20"
                    onClick={() => setStep(3)}
                    disabled={!step2Valid}
                  >
                    Preview & Launch <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ═══ STEP 3: PREVIEW & LAUNCH ═══ */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-0.5">Step 3 — Confirm & Launch</h3>
                  <p className="text-xs text-neutral-400">
                    Review your batch details. Launching will immediately list it on the homepage discovery feed.
                  </p>
                </div>

                {/* Summary Card */}
                <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-0 divide-y divide-white/5">
                  {[
                    { label: "Product Name",    value: batchData.title },
                    { label: "Category",        value: batchData.category.toUpperCase() },
                    { label: "Close Date",      value: batchData.endTime },
                    { label: "MOQ / Max Slots", value: `${batchData.moq} / ${batchData.maxSlots} slots` },
                    { label: "Material",        value: batchData.material || "—" },
                    { label: "Weight",          value: batchData.weight || "—" },
                    { label: "Certification",   value: batchData.certification },
                    { label: "Shipping",        value: batchData.shippingNote || "Standard (5–7 days)" },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between py-3 first:pt-0 last:pb-0 gap-4">
                      <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider shrink-0">{row.label}</span>
                      <span className="text-xs font-semibold text-white text-right">{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing Tiers Preview */}
                <div>
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Pricing Tiers</h4>
                  <div className="space-y-2">
                    {tiers.map((t, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold ${
                          idx === tiers.length - 1
                            ? "border-green-500/25 bg-green-500/5 text-green-400"
                            : "border-primary/15 bg-primary/5 text-primary"
                        }`}
                      >
                        <span>
                          Tier {idx + 1}: <strong>{t.minSlots}–{t.maxSlots}</strong> slots
                        </span>
                        <span className="font-black">
                          {formatPrice(t.price, false)}/unit
                          {idx === tiers.length - 1 && tiers.length > 1 && (
                            <span className="ml-2 text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full font-black">
                              BEST DEAL
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="flex items-start gap-2 p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                  <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    <strong className="text-amber-400">Note:</strong> Once launched, you cannot modify pricing tiers. You may close the batch early from your dashboard if needed.
                  </p>
                </div>

                <div className="flex justify-between pt-4 border-t border-white/5">
                  <button
                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer text-sm"
                    onClick={() => setStep(2)}
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    className="bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-neutral-800 disabled:to-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-sm shadow-lg shadow-primary/25"
                    onClick={handleLaunch}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Launching…</span>
                      </>
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
