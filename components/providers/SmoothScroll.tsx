"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";

/**
 * Lenis smooth scroll, mounted once around the marketing route group (NOT the
 * RSC root). When the user prefers reduced motion we drop the interpolation
 * (lerp 1 + native wheel) so scrolling is effectively instant/native while the
 * Lenis instance still drives anchor navigation.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <ReactLenis
      root
      options={{
        lerp: reduced ? 1 : 0.1,
        smoothWheel: !reduced,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
