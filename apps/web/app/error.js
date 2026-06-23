"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

// =============================================================================
// /error.js — global error boundary. Brand-aligned, with a clear path back to
// recovery (retry + home). Logs to console; production should pipe this to
// Sentry / Logflare via a real error reporter.
// =============================================================================

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
      console.error("App error:", error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Ambient warm wash */}
      <div className="pointer-events-none absolute -top-40 -right-40 w-[480px] h-[480px] rounded-full bg-[var(--accent-warning)]/12 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-[480px] h-[480px] rounded-full bg-[var(--primary)]/10 blur-[160px]" />

      <div className="relative z-10 max-w-md">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--accent-warning-light)] text-[var(--accent-warning)] mb-5">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
          Something went sideways
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
          {error?.message || "An unexpected error occurred while loading this page."}
          {error?.digest ? (
            <span className="block mt-2 text-[10px] font-mono text-[var(--text-tertiary)]">ref: {error.digest}</span>
          ) : null}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-[var(--primary)] text-white font-semibold text-sm hover:bg-[var(--accent)] transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)] font-semibold text-sm hover:bg-[var(--bg-elevated)] transition-colors"
          >
            <Home className="w-4 h-4" /> Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
