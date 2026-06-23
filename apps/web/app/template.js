import PageTransition from "@/components/ui/PageTransition";

// =============================================================================
// app/template.js — Next.js re-renders this on every route change. Drop the
// PageTransition wrapper here so every page slides in smoothly without
// duplicating the boilerplate per route.
//
// Note: keep this lean. Heavy work belongs in /layout.js (renders once).
// =============================================================================

export default function Template({ children }) {
  return <PageTransition>{children}</PageTransition>;
}
