"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Radio, AlertTriangle, Factory, Users, FileCheck } from "lucide-react";
import AdminGuard from "@/components/admin/AdminGuard";

const CARDS = [
  { key: "pendingBatches", label: "Pending approvals", icon: Package, href: "/admin/batches", accent: "text-amber-400" },
  { key: "liveBatches", label: "Live batches", icon: Radio, href: "/admin/batches?status=LIVE", accent: "text-green-400" },
  { key: "openDisputes", label: "Open disputes", icon: AlertTriangle, href: "/admin/disputes", accent: "text-red-400" },
  { key: "pendingKyc", label: "Pending KYC", icon: FileCheck, href: "/admin/manufacturers", accent: "text-blue-400" },
  { key: "manufacturers", label: "Manufacturers", icon: Factory, href: "/admin/manufacturers", accent: "text-neutral-300" },
  { key: "users", label: "Users", icon: Users, href: "/admin", accent: "text-neutral-300" },
];

export default function AdminOverview() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then(setStats).catch(() => {});
  }, []);

  return (
    <AdminGuard active="/admin">
      <h1 className="text-2xl font-black tracking-tight mb-1">Operator overview</h1>
      <p className="text-neutral-400 text-sm mb-6">Live platform health and moderation queues.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CARDS.map(({ key, label, icon: Icon, href, accent }) => (
          <Link
            key={key}
            href={href}
            className="rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] p-5 transition-colors"
          >
            <Icon className={`w-5 h-5 mb-3 ${accent}`} />
            <div className="text-3xl font-mono font-black">
              {stats ? (stats[key] ?? 0) : "—"}
            </div>
            <div className="text-sm text-neutral-400 mt-1">{label}</div>
          </Link>
        ))}
      </div>
    </AdminGuard>
  );
}
