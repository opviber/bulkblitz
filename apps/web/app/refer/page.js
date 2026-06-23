"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Copy, Gift, Users, Loader2 } from "lucide-react";

export default function ReferPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/referrals")
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  function copy() {
    if (data?.shareUrl) {
      navigator.clipboard.writeText(data.shareUrl);
      toast.success("Referral link copied");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-neutral-300">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-5 py-8">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <Gift className="w-6 h-6 text-[var(--color-brand,#F97316)]" />
          <h1 className="text-2xl font-black tracking-tight">Refer & earn BulkCash</h1>
        </div>
        <p className="text-neutral-400 text-sm mt-1">
          Share your link. When a friend joins their first batch, you earn ₹10 BulkCash.
        </p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <div className="text-xs text-neutral-400">Your code</div>
          <div className="text-2xl font-mono font-black tracking-wider">{data?.referralCode || "—"}</div>
          <button onClick={copy} className="mt-3 w-full h-11 rounded-lg bg-[var(--color-brand,#F97316)] text-black font-bold flex items-center justify-center gap-2">
            <Copy className="w-4 h-4" /> Copy referral link
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <Users className="w-4 h-4 text-neutral-300 mb-2" />
            <div className="text-2xl font-mono font-black">{data?.totalReferred ?? 0}</div>
            <div className="text-xs text-neutral-400">Friends referred</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <Gift className="w-4 h-4 text-green-400 mb-2" />
            <div className="text-2xl font-mono font-black">₹{data?.earned ?? 0}</div>
            <div className="text-xs text-neutral-400">BulkCash earned</div>
          </div>
        </div>
      </div>
    </div>
  );
}
