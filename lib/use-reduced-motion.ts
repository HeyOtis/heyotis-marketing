import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

/**
 * Hydration-safe reduced-motion preference.
 *
 * `useSyncExternalStore` renders the server snapshot (`false`) during SSR and
 * the initial client hydration — so server HTML and first client render always
 * match — then re-renders with the real media-query value. This lets components
 * branch their rendered DOM on reduced-motion without a hydration mismatch
 * (which motion's own `useReducedMotion()` does cause, since it reads the query
 * synchronously on the first client render).
 */
export function useIsomorphicReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
