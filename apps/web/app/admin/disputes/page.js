"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import AdminGuard from "@/components/admin/AdminGuard";

const STATUS_COLORS = {
  OPEN: "text-amber-400 bg-amber-500/10",
  UNDER_REVIEW: "text-blue-400 bg-blue-500/10",
  RESOLVED: "text-green-400 bg-green-500/10",
  REJECTED: "text-neutral-400 bg-white/5",
};

export default function AdminDisputesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/disputes");
      const d = await r.json();
      setItems(d.disputes || []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function resolve(id, status, refund = false) {
    const resolution = window.prompt(`Resolution note for ${status}:`, "");
    if (resolution === null) return;
    const r = await fetch(`/api/disputes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, resolution, refund }),
    });
    if (r.ok) {
      toast.success(`Marked ${status}`);
      load();
    } else {
      toast.error("Failed");
    }
  }

  return (
    <AdminGuard active="/admin/disputes">
      <h1 className="text-2xl font-black tracking-tight mb-6">Disputes</h1>
      {loading ? (
        <p className="text-neutral-500">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-neutral-500">No disputes.</p>
      ) : (
        <div className="space-y-3">
          {items.map((d) => (
            <div key={d.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold">{d.reason}</div>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    {d.user?.name} · {d.order?.batch?.title} · {d.order?.batch?.manufacturer?.businessName}
                  </div>
                  {d.description && <p className="text-sm text-neutral-300 mt-2">{d.description}</p>}
                </div>
                <span className={`text-[10px] px-2 py-1 rounded shrink-0 ${STATUS_COLORS[d.status] || ""}`}>{d.status}</span>
              </div>
              {["OPEN", "UNDER_REVIEW"].includes(d.status) && (
                <div className="flex flex-wrap gap-2 mt-3">
                  <button onClick={() => resolve(d.id, "UNDER_REVIEW")} className="px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-400 text-sm hover:bg-blue-500/25">Mark reviewing</button>
                  <button onClick={() => resolve(d.id, "RESOLVED", true)} className="px-3 py-1.5 rounded-lg bg-green-500/15 text-green-400 text-sm hover:bg-green-500/25">Resolve + refund</button>
                  <button onClick={() => resolve(d.id, "RESOLVED", false)} className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-300 text-sm hover:bg-green-500/20">Resolve (no refund)</button>
                  <button onClick={() => resolve(d.id, "REJECTED")} className="px-3 py-1.5 rounded-lg bg-white/5 text-neutral-300 text-sm hover:bg-white/10">Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminGuard>
  );
}
