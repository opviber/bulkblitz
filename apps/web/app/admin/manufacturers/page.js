"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, Ban, BadgeCheck } from "lucide-react";
import AdminGuard from "@/components/admin/AdminGuard";

export default function AdminManufacturersPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/manufacturers");
      const d = await r.json();
      setItems(d.manufacturers || []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function act(manufacturerId, action) {
    const r = await fetch("/api/admin/manufacturers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ manufacturerId, action }),
    });
    if (r.ok) {
      toast.success("Updated");
      load();
    } else {
      toast.error("Action failed");
    }
  }

  return (
    <AdminGuard active="/admin/manufacturers">
      <h1 className="text-2xl font-black tracking-tight mb-6">Manufacturers</h1>
      {loading ? (
        <p className="text-neutral-500">Loading…</p>
      ) : (
        <div className="space-y-3">
          {items.map((m) => (
            <div key={m.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-semibold flex items-center gap-2">
                  {m.businessName}
                  {m.gstVerified && <BadgeCheck className="w-4 h-4 text-blue-400" />}
                  {m.blacklisted && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">BLACKLISTED</span>}
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">
                  {m.city}, {m.state} · {m._count?.batches ?? 0} batches · KYC: {m.kyc?.status || "UNSUBMITTED"}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                {m.kyc?.status === "PENDING" && (
                  <>
                    <button onClick={() => act(m.id, "kyc_verify")} className="px-3 py-1.5 rounded-lg bg-green-500/15 text-green-400 text-sm font-medium hover:bg-green-500/25">Verify KYC</button>
                    <button onClick={() => act(m.id, "kyc_reject")} className="px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-400 text-sm font-medium hover:bg-amber-500/25">Reject KYC</button>
                  </>
                )}
                <button onClick={() => act(m.id, m.gstVerified ? "unverify" : "verify")} className="px-3 py-1.5 rounded-lg bg-white/5 text-neutral-200 text-sm font-medium flex items-center gap-1 hover:bg-white/10">
                  <ShieldCheck className="w-4 h-4" /> {m.gstVerified ? "Unverify" : "Verify"}
                </button>
                <button onClick={() => act(m.id, m.blacklisted ? "unblacklist" : "blacklist")} className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium flex items-center gap-1 hover:bg-red-500/20">
                  <Ban className="w-4 h-4" /> {m.blacklisted ? "Restore" : "Blacklist"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminGuard>
  );
}
