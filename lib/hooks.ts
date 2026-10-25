"use client";

import { useSyncExternalStore } from "react";

/**
 * Subscribe to a CSS media query without effects or hydration mismatches.
 * The server snapshot is always `false`, so server HTML never depends on the
 * visitor's device; only effects and handlers read the real value.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** True on devices with a mouse/trackpad (hover + fine pointer). */
export function useFinePointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

/** Non-hook read for use inside effects and event handlers. */
export function prefersReducedMotionNow(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
