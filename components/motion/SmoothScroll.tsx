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
import { MQ, usePrefersReducedMotion } from "@/lib/hooks";

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
  }
}

function scrollbarGap(): number {
  return Math.max(0, window.innerWidth - document.documentElement.clientWidth);
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const listenersRef = useRef(new Set<ScrollListener>());
  const lockCountRef = useRef(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    let lastY = window.scrollY;
    let direction: 1 | -1 = 1;
    let pending: ScrollInfo | null = null;
    let raf = 0;

    const flush = () => {
      raf = 0;
      if (!pending) return;
      const info = pending;
      pending = null;
      listenersRef.current.forEach((fn) => fn(info));
    };

    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) > 2) {
        direction = y > lastY ? 1 : -1;
        lastY = y;
      }
      pending = { y, direction };
      if (!raf) raf = requestAnimationFrame(flush);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;
    let disposed = false;

    const coarse =
      typeof window !== "undefined" &&
      window.matchMedia(MQ.coarse).matches;

    if (!reducedMotion && !coarse) {
      lenis = new Lenis({
        duration: 0.95,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.85,
        touchMultiplier: 1.1,
      });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);

      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(500, 33);

      if (lockCountRef.current > 0) lenis.stop();
    }

    const refresh = () => {
      if (!disposed) ScrollTrigger.refresh();
    };
    window.addEventListener("load", refresh);
    let fontsPromise: PromiseLike<void> | undefined;
    if (document.fonts) {
      fontsPromise = document.fonts.ready.then(refresh);
    }

    return () => {
      disposed = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("load", refresh);
      if (raf) cancelAnimationFrame(raf);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      lenisRef.current = null;
      void fontsPromise;
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
      const gap = scrollbarGap();
      document.documentElement.style.setProperty("--scrollbar-gap", `${gap}px`);
      document.documentElement.style.overflow = "hidden";
      document.documentElement.dataset.scrollLocked = "true";
    }
  }, []);

  const unlock = useCallback(() => {
    lockCountRef.current = Math.max(0, lockCountRef.current - 1);
    if (lockCountRef.current === 0) {
      lenisRef.current?.start();
      document.documentElement.style.overflow = "";
      document.documentElement.style.removeProperty("--scrollbar-gap");
      delete document.documentElement.dataset.scrollLocked;
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
