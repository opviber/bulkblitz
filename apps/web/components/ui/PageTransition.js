"use client";

// =============================================================================
// PageTransition — wraps every route's content so navigations animate.
//
// Mounted by app/template.js, which Next.js re-renders on every route change.
// `key={pathname}` forces a fresh motion mount, so the slide-in plays
// naturally. prefers-reduced-motion users get an instant cross-fade.
// =============================================================================

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  const variants = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 10, filter: "blur(4px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
      };

  return (
    <motion.div
      key={pathname}
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{ duration: reduced ? 0.18 : 0.42, ease: [0.16, 1, 0.3, 1] }}
      style={{ willChange: "transform, opacity, filter" }}
    >
      {children}
    </motion.div>
  );
}
