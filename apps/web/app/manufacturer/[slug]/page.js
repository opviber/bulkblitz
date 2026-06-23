"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { BadgeCheck, Star, MapPin, Loader2 } from "lucide-react";

export default function ManufacturerProfilePage({ params }) {
  const { slug } = use(params);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/manufacturers/${slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-neutral-300">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading…
      </div>
    );
  }
  if (!data?.manufacturer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">Manufacturer not found.</div>
    );
  }

  const m = data.manufacturer;
  return (
    <div className="min-h-screen bg-black text-white px-5 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-black">
            {m.businessName?.[0]}
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
              {m.businessName}
              {m.gstVerified && <BadgeCheck className="w-5 h-5 text-blue-400" />}
            </h1>
            <p className="text-neutral-400 text-sm flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {m.city}, {m.state}</span>
              <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {m.rating?.toFixed(1)}</span>
              <span>{m.yearsInBusiness} yrs</span>
            </p>
          </div>
        </div>

        <h2 className="text-lg font-bold mt-8 mb-3">Batches</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {m.batches?.map((b) => (
            <Link key={b.id} href={`/batch/${b.id}`} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 hover:bg-white/[0.04]">
              <div className="font-semibold truncate">{b.title}</div>
              <div className="text-xs text-neutral-400 mt-1">{b.category} · {b.status}</div>
            </Link>
          ))}
          {(!m.batches || m.batches.length === 0) && <p className="text-neutral-500 text-sm">No public batches yet.</p>}
        </div>

        <h2 className="text-lg font-bold mt-8 mb-3">Reviews</h2>
        <div className="space-y-3">
          {data.reviews?.map((r) => (
            <div key={r.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">{r.user?.name || "Buyer"}</span>
                <span className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400" />)}
                </span>
              </div>
              {r.comment && <p className="text-sm text-neutral-300 mt-1">{r.comment}</p>}
            </div>
          ))}
          {(!data.reviews || data.reviews.length === 0) && <p className="text-neutral-500 text-sm">No reviews yet.</p>}
        </div>
      </div>
    </div>
  );
}
