"use client";

import { MotionConfig } from "motion/react";

/**
 * App-wide motion config. `reducedMotion="user"` makes every Motion component
 * honour the OS "reduce motion" setting - transforms collapse to their end
 * state while opacity fades remain, so the site stays legible without movement.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
