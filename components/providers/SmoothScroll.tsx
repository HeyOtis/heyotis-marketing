"use client";

/**
 * Smooth-scroll seam.
 *
 * Lenis was removed: in `root` mode it intermittently capped the document scroll
 * height (you couldn't scroll past mid-page). Native scrolling is bulletproof and
 * every scroll-reveal animation on the site (whileInView reveals, anchor-link
 * navigation, number tickers) works without it. If we want a smooth-scroll
 * library again later, wire it up here — this is the single seam.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
