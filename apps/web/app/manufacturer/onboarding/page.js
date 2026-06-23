"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, ShieldCheck, ChevronLeft } from "lucide-react";

export default function OnboardingPage() {
  const [form, setForm] = useState({ gstNumber: "", panNumber: "", bankAccount: "", bankIfsc: "" });
  const [kyc, setKyc] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/manufacturer/onboarding")
      .then((r) => r.json())
      .then((d) => d.kyc && setKyc(d.kyc))
      .catch(() => {});
  }, []);

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const r = await fetch("/api/manufacturer/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.issues ? "Check your GST / IFSC / bank details" : d.error);
      setKyc(d.kyc);
      toast.success("KYC submitted for review");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const field = (name, label, placeholder) => (
    <label className="block">
      <span className="text-sm text-neutral-300">{label}</span>
      <input
        value={form[name]}
        onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value.toUpperCase() }))}
        placeholder={placeholder}
        className="mt-1 w-full h-11 px-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[var(--color-brand,#F97316)] focus:ring-2 focus:ring-orange-500/20"
      />
    </label>
  );

  return (
    <div className="min-h-screen bg-black text-white px-5 py-8">
      <div className="max-w-lg mx-auto">
        <Link href="/manufacturer" className="text-neutral-400 text-sm flex items-center gap-1 mb-6 hover:text-white">
          <ChevronLeft className="w-4 h-4" /> Dashboard
        </Link>
        <h1 className="text-2xl font-black tracking-tight">Manufacturer verification</h1>
        <p className="text-neutral-400 text-sm mt-1 mb-6">
          Submit your GST and bank details. We verify before your batches can go live.
        </p>

        {kyc && (
          <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.02] p-4 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-sm font-semibold">KYC status: {kyc.status}</div>
              {kyc.reviewNote && <div className="text-xs text-neutral-400">{kyc.reviewNote}</div>}
            </div>
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          {field("gstNumber", "GSTIN", "27AAAAA1111A1Z1")}
          {field("panNumber", "PAN (optional)", "AAAAA1111A")}
          {field("bankAccount", "Bank account number", "123456789012")}
          {field("bankIfsc", "IFSC code", "HDFC0001234")}
          <button
            disabled={submitting}
            className="w-full h-12 rounded-lg bg-[var(--color-brand,#F97316)] text-black font-bold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Submit for verification
          </button>
        </form>
      </div>
    </div>
  );
}
