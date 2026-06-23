"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Check, X, Star } from "lucide-react";
import AdminGuard from "@/components/admin/AdminGuard";

function BatchesInner() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "PENDING_APPROVAL";
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/batches?status=${status}`);
      const d = await r.json();
      setBatches(d.batches || []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function act(batchId, action) {
    const r = await fetch("/api/admin/batches", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ batchId, action }),
    });
    if (r.ok) {
      toast.success(`Batch ${action}d`);
      setBatches((b) => b.filter((x) => x.id !== batchId || action === "feature" || action === "unfeature"));
    } else {
      toast.error("Action failed");
    }
  }

  return (
    <>
      <h1 className="text-2xl font-black tracking-tight mb-1">Batch approvals</h1>
      <p className="text-neutral-400 text-sm mb-6">Showing: {status}</p>
      {loading ? (
        <p className="text-neutral-500">Loading…</p>
      ) : batches.length === 0 ? (
        <p className="text-neutral-500">Nothing here. 🎉</p>
      ) : (
        <div className="space-y-3">
          {batches.map((b) => (
            <div key={b.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{b.title}</div>
                <div className="text-xs text-neutral-400 mt-0.5">
                  {b.manufacturer?.businessName} · {b.category} · MOQ {b.moq}/{b.maxSlots} · {b.tiers?.length} tiers
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                {status === "PENDING_APPROVAL" && (
                  <>
                    <button onClick={() => act(b.id, "approve")} className="px-3 py-1.5 rounded-lg bg-green-500/15 text-green-400 text-sm font-medium flex items-center gap-1 hover:bg-green-500/25">
                      <Check className="w-4 h-4" /> Approve
                    </button>
                    <button onClick={() => act(b.id, "reject")} className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 text-sm font-medium flex items-center gap-1 hover:bg-red-500/25">
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </>
                )}
                <button onClick={() => act(b.id, b.featured ? "unfeature" : "feature")} className="px-3 py-1.5 rounded-lg bg-white/5 text-neutral-200 text-sm font-medium flex items-center gap-1 hover:bg-white/10">
                  <Star className={`w-4 h-4 ${b.featured ? "fill-amber-400 text-amber-400" : ""}`} /> {b.featured ? "Unfeature" : "Feature"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default function AdminBatchesPage() {
  return (
    <AdminGuard active="/admin/batches">
      <Suspense fallback={<p className="text-neutral-500">Loading…</p>}>
        <BatchesInner />
      </Suspense>
    </AdminGuard>
  );
}
