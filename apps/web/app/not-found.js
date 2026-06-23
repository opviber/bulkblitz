import Link from "next/link";
import { Compass } from "lucide-react";

// =============================================================================
// /not-found.js — brand-aligned 404 with a clear way back.
// =============================================================================

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full bg-[var(--primary)]/12 blur-[160px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[480px] h-[480px] rounded-full bg-[var(--accent)]/10 blur-[160px]" />

      <div className="relative z-10 max-w-md">
        <h1
          className="text-7xl sm:text-8xl font-black tracking-[-0.04em] bg-gradient-to-br from-[var(--primary)] via-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent mb-2"
          style={{ fontFamily: "ui-monospace, SFMono-Regular, monospace" }}
        >
          404
        </h1>
        <p className="text-[11px] font-bold tracking-[0.24em] uppercase text-[var(--text-tertiary)] mb-4">
          Page not found
        </p>
        <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto mb-7 leading-relaxed">
          That page doesn&apos;t exist or has been moved. The crowd is still buying — let&apos;s get you back to the action.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full bg-[var(--primary)] text-white font-semibold text-sm hover:bg-[var(--accent)] transition-colors shadow-[0_8px_24px_rgba(255,106,0,0.22)]"
        >
          <Compass className="w-4 h-4" /> Browse live batches
        </Link>
      </div>
    </div>
  );
}
