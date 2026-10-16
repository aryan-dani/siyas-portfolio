"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isHoveringAction, setIsHoveringAction] = useState(false);

  const activeTargetRef = useRef<HTMLElement | null>(null);
  const cachedRectRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    const isTouchOnly =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (!isTouchOnly) {
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted || !ringRef.current || !dotRef.current) return;

    const ring = ringRef.current;
    const dot = dotRef.current;

    const dotX = gsap.quickTo(dot, "x", { duration: 0.03, ease: "none" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.03, ease: "none" });

    const ringX = gsap.quickTo(ring, "x", {
      duration: 0.14,
      ease: "power3.out",
    });
    const ringY = gsap.quickTo(ring, "y", {
      duration: 0.14,
      ease: "power3.out",
    });

    const INTERACTIVE_SELECTOR =
      "[data-cursor-box], [data-menu-item], a, button, [role='button'], input, textarea, select";

    const releaseTarget = (el: HTMLElement | null) => {
      if (!el) return;
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.42,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      const clientX = e.clientX;
      const clientY = e.clientY;

      setVisible((prev) => (prev ? prev : true));

      dotX(clientX);
      dotY(clientY);
      ringX(clientX);
      ringY(clientY);

      const target = e.target as HTMLElement | null;
      const interactiveEl = target?.closest(
        INTERACTIVE_SELECTOR
      ) as HTMLElement | null;

      if (interactiveEl !== activeTargetRef.current) {
        releaseTarget(activeTargetRef.current);

        if (interactiveEl) {
          activeTargetRef.current = interactiveEl;
          cachedRectRef.current = interactiveEl.getBoundingClientRect();
          setIsHoveringAction(true);
        } else {
          activeTargetRef.current = null;
          cachedRectRef.current = null;
          setIsHoveringAction(false);
        }
      }

      // Apply smooth magnetic shift to hovered action without per-frame layout reads
      const currentEl = activeTargetRef.current;
      const rect = cachedRectRef.current;
      if (
        currentEl &&
        rect &&
        !currentEl.hasAttribute("data-no-magnet") &&
        rect.width > 0 &&
        rect.width <= 520 &&
        rect.height <= 160
      ) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const isMenuItem = currentEl.hasAttribute("data-menu-item");
        const maxPullX = isMenuItem ? 18 : 10;
        const maxPullY = isMenuItem ? 6 : 7;

        const rawX = (clientX - centerX) * (isMenuItem ? 0.12 : 0.2);
        const rawY = (clientY - centerY) * (isMenuItem ? 0.12 : 0.24);

        const pullX = Math.max(-maxPullX, Math.min(maxPullX, rawX));
        const pullY = Math.max(-maxPullY, Math.min(maxPullY, rawY));

        gsap.to(currentEl, {
          x: pullX,
          y: pullY,
          duration: 0.24,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    const onScroll = () => {
      if (activeTargetRef.current) {
        releaseTarget(activeTargetRef.current);
        activeTargetRef.current = null;
        cachedRectRef.current = null;
        setIsHoveringAction(false);
      }
    };

    const onMouseLeave = () => {
      releaseTarget(activeTargetRef.current);
      activeTargetRef.current = null;
      cachedRectRef.current = null;
      setIsHoveringAction(false);
      setVisible(false);
    };

    const onMouseEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      releaseTarget(activeTargetRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      {/* Outer Champagne Halo — Smoothly disappears when hovering any interactive action */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
        style={{
          width: 22,
          height: 22,
          opacity: visible ? (isHoveringAction ? 0 : 1) : 0,
          transform: `translate(-50%, -50%) scale(${isHoveringAction ? 0.25 : 1})`,
          border: "1.5px solid rgba(250, 245, 240, 0.42)",
          background: "rgba(255, 255, 255, 0.02)",
          boxShadow: "0 0 12px rgba(245, 184, 143, 0.16)",
          transition:
            "opacity 180ms cubic-bezier(0.22, 1, 0.36, 1), transform 200ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />

      {/* Precision Center Dot — Disappears cleanly when hovering any interactive action */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
        style={{
          width: 5,
          height: 5,
          opacity: visible ? (isHoveringAction ? 0 : 0.95) : 0,
          transform: `translate(-50%, -50%) scale(${isHoveringAction ? 0 : 1})`,
          backgroundColor: "#faf5f0",
          boxShadow: "0 0 8px rgba(255, 255, 255, 0.7)",
          transition:
            "opacity 150ms cubic-bezier(0.22, 1, 0.36, 1), transform 160ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
    </>
  );
}

