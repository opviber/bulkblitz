"use client";

// =============================================================================
// StaggerReveal — drop-in scroll-triggered stagger animator.
//
// Wrap a list of siblings in <StaggerReveal>; each child fades + rises into
// view when the parent enters the viewport, offset by `stagger` ms.
//
//   <StaggerReveal>
//     <Card />
//     <Card />
//     <Card />
//   </StaggerReveal>
//
// Drops the manual IntersectionObserver `.reveal` pattern in app/page.js so
// we don't repeat boilerplate.
// =============================================================================

import { Children, cloneElement, isValidElement } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function StaggerReveal({
  children,
  stagger = 0.07,
  initialDelay = 0,
  distance = 18,
  once = true,
  amount = 0.15,
  className = "",
  as: Tag = "div",
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[Tag] || motion.div;

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduced ? 0 : stagger,
        delayChildren: reduced ? 0 : initialDelay,
      },
    },
  };

  const item = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: distance },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.2 : 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <MotionTag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
    >
      {Children.map(children, (child, i) => {
        if (!isValidElement(child)) return child;
        // If child is already a motion node we wrap so user code stays simple.
        return (
          <motion.div key={child.key ?? i} variants={item}>
            {child}
          </motion.div>
        );
      })}
    </MotionTag>
  );
}
