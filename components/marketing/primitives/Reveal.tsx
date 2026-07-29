"use client";

import { motion } from "motion/react";
import { useIsomorphicReducedMotion } from "@/lib/use-reduced-motion";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  /** Render as an `li` when the reveal is a row of a list, so `ul > li`
      stays intact. Defaults to a `div`. */
  as?: "div" | "li";
};

/**
 * Scroll-triggered fade/translate that fires once. Above-the-fold content is
 * already in view on mount, so this doubles as the page-load entrance - give
 * siblings increasing `delay` to choreograph one. Honours reduced-motion by
 * rendering its children statically (no transform, no opacity gate).
 */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
  as = "div",
}: RevealProps) {
  const reduced = useIsomorphicReducedMotion();

  if (reduced) {
    return as === "li" ? (
      <li className={className}>{children}</li>
    ) : (
      <div className={className}>{children}</div>
    );
  }

  const Tag = as === "li" ? motion.li : motion.div;

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}
