"use client";

import Link from "next/link";
import { Loader2, ShieldAlert } from "lucide-react";
import { useSession } from "@/lib/useSession";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/batches", label: "Batch approvals" },
  { href: "/admin/manufacturers", label: "Manufacturers" },
  { href: "/admin/disputes", label: "Disputes" },
];

export default function AdminGuard({ children, active }) {
  const { user, loading } = useSession();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-neutral-300">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading…
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white gap-3 px-6 text-center">
        <ShieldAlert className="w-10 h-10 text-amber-400" />
        <h1 className="text-xl font-bold">Admin access only</h1>
        <p className="text-neutral-400 text-sm max-w-sm">
          This area is restricted to platform operators. Sign in with an admin account.
        </p>
        <Link href="/auth" className="mt-2 px-4 py-2 rounded-lg bg-[var(--color-brand,#F97316)] text-black font-semibold text-sm">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur z-10">
        <Link href="/" className="font-black tracking-tight text-lg">
          BulkBlitz <span className="text-[var(--color-brand,#F97316)]">Admin</span>
        </Link>
        <span className="text-xs text-neutral-400">{user.name}</span>
      </header>
      <nav className="flex gap-1 px-4 sm:px-6 py-3 border-b border-white/5 overflow-x-auto">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
              active === n.href
                ? "bg-[var(--color-brand,#F97316)] text-black font-semibold"
                : "text-neutral-300 hover:bg-white/5"
            }`}
          >
            {n.label}
          </Link>
        ))}
      </nav>
      <main className="p-4 sm:p-6 max-w-6xl mx-auto w-full">{children}</main>
    </div>
  );
}
