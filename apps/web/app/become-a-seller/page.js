"use client";

// =============================================================================
// /become-a-seller — pitch + upgrade form for existing BUYERS to gain access to
// the Seller dashboard. Server-side gated by middleware (must be authenticated).
// =============================================================================

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Loader2, Factory, TrendingUp, ShieldCheck, Zap, ArrowRight, CheckCircle2,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useSession } from "@/lib/useSession";

const PERKS = [
  {
    icon: TrendingUp,
    title: "Sell more by selling less",
    body: "Crowd-pool orders unlock your volume pricing without you committing your own working capital.",
  },
  {
    icon: ShieldCheck,
    title: "Get paid in 3 days",
    body: "We capture, you ship. Funds settle in 72 hours of batch close — no 60-day payment terms.",
  },
  {
    icon: Zap,
    title: "Real demand signal",
    body: "Every buyer in your batch has authorized payment. No window-shoppers, no flake-outs.",
  },
];

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
  "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh",
  "Puducherry","Chandigarh","Andaman & Nicobar","Dadra & Nagar Haveli","Daman & Diu","Lakshadweep",
];

export default function BecomeSellerPage() {
  const router = useRouter();
  const { user, manufacturer, loading, refresh } = useSession();
  const [form, setForm] = useState({ businessName: "", city: "", state: "" });
  const [submitting, setSubmitting] = useState(false);

  // If already a seller, send them straight in.
  useEffect(() => {
    if (!loading && manufacturer) {
      router.replace("/manufacturer");
    }
  }, [loading, manufacturer, router]);

  async function submit(e) {
    e.preventDefault();
    if (!form.businessName.trim() || !form.city.trim() || !form.state.trim()) {
      toast.error("Fill all fields to continue");
      return;
    }
    setSubmitting(true);
    try {
      const r = await fetch("/api/auth/upgrade-to-seller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Could not upgrade account");
      toast.success("Welcome aboard! Your Seller Hub is ready.");
      await refresh();
      router.push("/manufacturer/onboarding");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* ── Hero ── */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] text-xs font-bold uppercase tracking-wider mb-5">
              <Factory className="w-3.5 h-3.5" />
              Sell on BulkBlitz
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05] mb-5">
              Turn idle capacity
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
                into pre-paid orders.
              </span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              List a tier-priced batch. Buyers pool together. You ship the volume that actually fills.
              4% fee. 3-day payout. Zero unsold inventory risk.
            </p>
          </div>

          {/* ── Perks ── */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {PERKS.map((p) => (
              <div
                key={p.title}
                className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] hover:border-[var(--primary)]/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/12 text-[var(--primary)] flex items-center justify-center mb-4">
                  <p.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-1.5">{p.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>

          {/* ── Form ── */}
          <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
            <h2 className="text-xl font-bold mb-1">Tell us about your business</h2>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              Takes 30 seconds. KYC + bank details come next.
            </p>

            <form onSubmit={submit} className="space-y-4">
              <Field
                label="Business name"
                placeholder="e.g. Rajesh Cotton Mills"
                value={form.businessName}
                onChange={(v) => setForm((f) => ({ ...f, businessName: v }))}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field
                  label="City"
                  placeholder="e.g. Nagpur"
                  value={form.city}
                  onChange={(v) => setForm((f) => ({ ...f, city: v }))}
                />
                <SelectField
                  label="State"
                  value={form.state}
                  onChange={(v) => setForm((f) => ({ ...f, state: v }))}
                  options={INDIAN_STATES}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 h-12 rounded-xl bg-[var(--primary)] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[var(--accent)] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_8px_24px_rgba(255,106,0,0.25)]"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Open my Seller Hub <ArrowRight className="w-4 h-4" /></>}
              </button>

              <p className="text-[11px] text-[var(--text-tertiary)] text-center pt-1">
                By continuing you agree to the <Link href="/legal/terms" className="underline">Seller Terms</Link>.
              </p>
            </form>

            {/* ── What happens next ── */}
            <div className="mt-7 pt-5 border-t border-[var(--border-default)] space-y-2">
              {[
                "We create your Seller Hub instantly.",
                "Submit GSTIN, PAN and bank details (5 min KYC).",
                "Launch your first batch — listing fee waived.",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-[var(--success)] shrink-0" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, placeholder, value, onChange }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 px-3.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--primary)]/60 focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 px-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]/60 focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
      >
        <option value="">Select state</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
