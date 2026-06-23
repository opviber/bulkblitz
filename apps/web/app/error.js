"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4 px-6 text-center">
      <AlertTriangle className="w-10 h-10 text-amber-400" />
      <h1 className="text-xl font-bold">Something went wrong</h1>
      <p className="text-neutral-400 text-sm max-w-sm">{error?.message || "An unexpected error occurred."}</p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-[var(--color-brand,#F97316)] text-black font-semibold text-sm flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Try again
        </button>
        <Link href="/" className="px-4 py-2 rounded-lg bg-white/5 text-neutral-200 text-sm">
          Home
        </Link>
      </div>
    </div>
  );
}
