"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/hooks";

export type ScrollTarget = string | number | HTMLElement;

export type ScrollInfo = {
  y: number;
  direction: 1 | -1;
};

type ScrollListener = (info: ScrollInfo) => void;

type SmoothScrollContextValue = {
  scrollTo: (
    target: ScrollTarget,
    options?: { immediate?: boolean; offset?: number }
  ) => void;
  /** Freeze page scroll (menus, the reel player). Calls are reference-counted. */
  lock: () => void;
  unlock: () => void;
  subscribe: (listener: ScrollListener) => () => void;
};

const noop = () => {};
const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  scrollTo: noop,
  lock: noop,
  unlock: noop,
  subscribe: () => noop,
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

declare global {
  interface Window {
    __siyaReady?: boolean;
    __siyaLenis?: Lenis;
  }
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const listenersRef = useRef(new Set<ScrollListener>());
  const lockCountRef = useRef(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Direction tracking works the same with or without Lenis, because Lenis
    // drives the real scroll position and the browser still fires "scroll".
    let lastY = window.scrollY;
    let direction: 1 | -1 = 1;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) > 2) {
        direction = y > lastY ? 1 : -1;
        lastY = y;
      }
      listenersRef.current.forEach((fn) => fn({ y, direction }));
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    if (!reducedMotion) {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.9,
      });
      lenisRef.current = lenis;
      window.__siyaLenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);

      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      if (lockCountRef.current > 0) lenis.stop();
    }

    // Layout shifts (fonts, images) move trigger positions: re-measure.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    if (document.fonts) document.fonts.ready.then(refresh);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("load", refresh);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      lenisRef.current = null;
      delete window.__siyaLenis;
    };
  }, [reducedMotion]);

  const scrollTo = useCallback<SmoothScrollContextValue["scrollTo"]>(
    (target, options) => {
      const immediate = options?.immediate ?? false;
      const offset = options?.offset ?? 0;
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(target, {
          offset,
          immediate,
          force: true,
          duration: immediate ? 0 : 1.6,
          easing: (t: number) => 1 - Math.pow(1 - t, 4),
        });
        if (immediate) ScrollTrigger.update();
        return;
      }
      // Native fallback (reduced motion)
      if (typeof target === "number") {
        window.scrollTo({ top: target + offset, behavior: "auto" });
      } else {
        const el =
          typeof target === "string"
            ? document.querySelector<HTMLElement>(target)
            : target;
        el?.scrollIntoView({ behavior: "auto", block: "start" });
      }
    },
    []
  );

  const lock = useCallback(() => {
    lockCountRef.current += 1;
    if (lockCountRef.current === 1) {
      lenisRef.current?.stop();
      document.documentElement.style.overflow = "hidden";
    }
  }, []);

  const unlock = useCallback(() => {
    lockCountRef.current = Math.max(0, lockCountRef.current - 1);
    if (lockCountRef.current === 0) {
      lenisRef.current?.start();
      document.documentElement.style.overflow = "";
    }
  }, []);

  const subscribe = useCallback((listener: ScrollListener) => {
    listenersRef.current.add(listener);
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  const value = useMemo(
    () => ({ scrollTo, lock, unlock, subscribe }),
    [scrollTo, lock, unlock, subscribe]
  );

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
