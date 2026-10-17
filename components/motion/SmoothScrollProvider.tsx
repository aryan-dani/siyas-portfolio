"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/hooks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type ScrollTelemetry = {
  scrollY: number;
  progress: number;
  velocity: number;
  direction: 1 | -1;
};

type ScrollListener = (telemetry: ScrollTelemetry) => void;

type SmoothScrollContextValue = {
  scrollTo: (target: string | number | HTMLElement, immediate?: boolean) => void;
  subscribeScroll: (listener: ScrollListener) => () => void;
  getTelemetry: () => ScrollTelemetry;
};

const defaultTelemetry: ScrollTelemetry = {
  scrollY: 0,
  progress: 0,
  velocity: 0,
  direction: 1,
};

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  scrollTo: () => {},
  subscribeScroll: () => () => {},
  getTelemetry: () => defaultTelemetry,
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const telemetryRef = useRef<ScrollTelemetry>({ ...defaultTelemetry });
  const listenersRef = useRef<Set<ScrollListener>>(new Set());
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const notify = () => {
      const t = telemetryRef.current;
      listenersRef.current.forEach((fn) => fn(t));
    };

    if (reducedMotion) {
      const onNativeScroll = () => {
        const maxScroll = Math.max(
          document.documentElement.scrollHeight - window.innerHeight,
          1
        );
        telemetryRef.current = {
          scrollY: window.scrollY,
          progress: Math.min(1, Math.max(0, window.scrollY / maxScroll)),
          velocity: 0,
          direction: 1,
        };
        notify();
      };
      window.addEventListener("scroll", onNativeScroll, { passive: true });
      return () => window.removeEventListener("scroll", onNativeScroll);
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", (e: Lenis) => {
      ScrollTrigger.update();
      telemetryRef.current = {
        scrollY: e.scroll,
        progress: e.progress,
        velocity: e.velocity,
        direction: e.direction === -1 ? -1 : 1,
      };
      notify();
    });

    // Also sync on native window.scrollTo (e.g. automated scroll or anchor jumps)
    const onWindowScroll = () => {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      telemetryRef.current.scrollY = window.scrollY;
      telemetryRef.current.progress = Math.min(
        1,
        Math.max(0, window.scrollY / maxScroll)
      );
      notify();
    };
    window.addEventListener("scroll", onWindowScroll, { passive: true });

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener("scroll", onWindowScroll);
      gsap.ticker.remove(update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  const scrollTo = (
    target: string | number | HTMLElement,
    immediate = false
  ) => {
    if (lenisRef.current && !reducedMotion) {
      lenisRef.current.scrollTo(target, {
        offset: -24,
        immediate,
        duration: immediate ? 0 : 1.05,
      });
      if (immediate) {
        ScrollTrigger.update();
      }
      return;
    }

    const behavior = immediate || reducedMotion ? "auto" : "smooth";
    if (typeof target === "string") {
      const el = document.querySelector(target);
      if (el) {
        el.scrollIntoView({ behavior });
      }
    } else if (typeof target === "number") {
      window.scrollTo({
        top: target,
        behavior,
      });
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior });
    }
  };

  const subscribeScroll = (listener: ScrollListener) => {
    listenersRef.current.add(listener);
    listener(telemetryRef.current);
    return () => {
      listenersRef.current.delete(listener);
    };
  };

  const getTelemetry = () => telemetryRef.current;

  return (
    <SmoothScrollContext.Provider
      value={{ scrollTo, subscribeScroll, getTelemetry }}
    >
      {children}
    </SmoothScrollContext.Provider>
  );
}
