"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Loader2 } from "lucide-react";

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/wishlist")
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((d) => setItems(d.items || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-neutral-300">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-5 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Heart className="w-6 h-6 text-[var(--color-brand,#F97316)]" />
          <h1 className="text-2xl font-black tracking-tight">Watching</h1>
        </div>
        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-neutral-400">You aren&apos;t watching any batches yet.</p>
            <Link href="/" className="text-[var(--color-brand,#F97316)] text-sm mt-2 inline-block">Browse batches</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map((w) => (
              <Link key={w.id} href={`/batch/${w.batchId}`} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 hover:bg-white/[0.04]">
                <div className="font-semibold truncate">{w.batch?.title}</div>
                <div className="text-xs text-neutral-400 mt-1">
                  {w.batch?.manufacturer?.businessName} · {w.batch?.category}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
