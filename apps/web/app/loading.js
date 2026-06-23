import Logo from "@/components/ui/Logo";

// =============================================================================
// /loading.js — global Next.js loading UI. Uses brand tokens, not hardcoded
// black. Includes a soft animated pulse on the logo so users see motion
// during route changes rather than a frozen splash.
// =============================================================================

export default function GlobalLoading() {
  return (
    <div
      className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center relative overflow-hidden"
      aria-live="polite"
      aria-busy="true"
    >
      {/* Ambient brand wash */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-[var(--primary)]/15 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 w-[420px] h-[420px] rounded-full bg-[var(--accent)]/10 blur-[140px]" />

      <div className="relative z-10 flex flex-col items-center gap-5">
        {/* Pulsing brand logo (CSS-only — no JS) */}
        <div className="relative">
          <span className="absolute inset-0 rounded-full bg-[var(--primary)]/25 animate-ping" aria-hidden />
          <span className="relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--bg-surface)] border border-[var(--border-default)]">
            <Logo size={28} />
          </span>
        </div>
        <p className="text-[11px] font-bold tracking-[0.24em] uppercase text-[var(--text-tertiary)]">
          Loading
        </p>
      </div>
    </div>
  );
}
