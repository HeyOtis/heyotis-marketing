import { useSyncExternalStore } from "react";

/**
 * Hydration-safe media-query hook. Mirrors `useIsomorphicReducedMotion`:
 * `useSyncExternalStore` keeps server and first client render in agreement
 * (server snapshot is always `false`), then re-renders once mounted if the
 * query matches - so no hydration mismatch.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};
      const mq = window.matchMedia(query);
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
