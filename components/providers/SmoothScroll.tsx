"use client";

import { ReactLenis } from "lenis/react";
// Required Lenis stylesheet. Its `html.lenis, html.lenis body { height: auto }`
// rule overrides the root layout's `h-full` (height: 100%) on <html> - that
// clamp was what capped the scroll height last time Lenis was tried here.
import "lenis/dist/lenis.css";
import { useIsomorphicReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Smooth-scroll seam (DOSS-style weighted momentum).
 *
 * Lenis was removed once before: in `root` mode it intermittently capped the
 * document scroll height (you couldn't scroll past mid-page). That was stale
 * dimensions - content grows after mount (web-font reflow, whileInView reveals,
 * images) but the cached scroll height didn't. Lenis ≥1.3 fixes this with
 * `autoResize` (default): a ResizeObserver on the content re-measures on every
 * layout change, so the bug can't recur. We keep this the single seam for the
 * library so there's one place to tune or pull it.
 *
 * Reduced-motion: when the OS prefers reduced motion we skip Lenis entirely and
 * fall back to native scrolling - no RAF loop, no eased wheel.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useIsomorphicReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        // Slightly weighted, DOSS-like glide. Lower lerp = heavier/slower catch-up.
        lerp: 0.09,
        wheelMultiplier: 1,
        // Leave touch devices on native scrolling - smoothing touch feels laggy.
        syncTouch: false,
        autoResize: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
