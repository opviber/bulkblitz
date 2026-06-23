"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronLeft, Truck, Package, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const STEPS = ["CONFIRMED", "SHIPPED", "DELIVERED"];

export default function OrderDetailPage({ params }) {
  const { id } = use(params);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [disputeReason, setDisputeReason] = useState("");
  const [showDispute, setShowDispute] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch(`/api/orders/${id}`);
      const d = await r.json();
      setOrder(r.ok ? d.order : null);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function raiseDispute() {
    if (disputeReason.trim().length < 3) return toast.error("Describe the issue");
    const r = await fetch("/api/disputes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: id, reason: disputeReason }),
    });
    if (r.ok) {
      toast.success("Dispute raised");
      setShowDispute(false);
      load();
    } else {
      const d = await r.json();
      toast.error(d.error || "Failed");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-neutral-300">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading order…
      </div>
    );
  }
  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white gap-3">
        <AlertCircle className="w-8 h-8 text-amber-400" />
        <p>Order not found.</p>
        <Link href="/orders" className="text-[var(--color-brand,#F97316)]">Back to orders</Link>
      </div>
    );
  }

  const stepIdx = STEPS.indexOf(order.status);

  return (
    <div className="min-h-screen bg-black text-white px-5 py-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/orders" className="text-neutral-400 text-sm flex items-center gap-1 mb-6 hover:text-white">
          <ChevronLeft className="w-4 h-4" /> Orders
        </Link>

        <h1 className="text-xl font-black tracking-tight">{order.batch?.title}</h1>
        <p className="text-neutral-400 text-sm mt-1">
          {order.quantity} units · ₹{order.pricePerUnit}/unit · Total ₹{order.totalAmount}
        </p>

        {/* Status timeline */}
        <div className="mt-6 flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1.5 rounded-full ${i <= stepIdx ? "bg-[var(--color-brand,#F97316)]" : "bg-white/10"}`} />
              <div className={`mt-2 text-[11px] ${i <= stepIdx ? "text-white" : "text-neutral-500"}`}>{s}</div>
            </div>
          ))}
        </div>

        {/* Tracking */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Truck className="w-4 h-4 text-neutral-300" /> Shipping
          </div>
          {order.trackingNumber ? (
            <p className="text-sm text-neutral-300 mt-2">
              {order.carrier} · AWB <span className="font-mono">{order.trackingNumber}</span>
            </p>
          ) : (
            <p className="text-sm text-neutral-500 mt-2">Awaiting dispatch by the manufacturer.</p>
          )}
        </div>

        {/* Manufacturer */}
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex items-center gap-2 text-sm">
          <Package className="w-4 h-4 text-neutral-300" />
          {order.batch?.manufacturer?.businessName} · {order.batch?.manufacturer?.city}
        </div>

        {/* Dispute */}
        <div className="mt-6">
          {order.dispute ? (
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm">
              <CheckCircle2 className="w-4 h-4 text-amber-400 inline mr-1" />
              Dispute status: <strong>{order.dispute.status}</strong>
              {order.dispute.resolution && <p className="text-neutral-300 mt-1">{order.dispute.resolution}</p>}
            </div>
          ) : showDispute ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <textarea
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="What went wrong with this order?"
                className="w-full h-24 p-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[var(--color-brand,#F97316)]"
              />
              <div className="flex gap-2 mt-3">
                <button onClick={raiseDispute} className="px-4 py-2 rounded-lg bg-[var(--color-brand,#F97316)] text-black font-semibold text-sm">Submit</button>
                <button onClick={() => setShowDispute(false)} className="px-4 py-2 rounded-lg bg-white/5 text-neutral-300 text-sm">Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowDispute(true)} className="text-sm text-neutral-400 hover:text-white underline">
              Report a problem with this order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
