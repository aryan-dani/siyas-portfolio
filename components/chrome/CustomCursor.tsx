"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const activeTargetRef = useRef<HTMLElement | null>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });

  useEffect(() => {
    const isTouchOnly =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (!isTouchOnly) {
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted || !boxRef.current || !dotRef.current) return;

    const box = boxRef.current;
    const dot = dotRef.current;

    const dotX = gsap.quickTo(dot, "x", { duration: 0.035, ease: "none" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.035, ease: "none" });

    const boxX = gsap.quickTo(box, "x", { duration: 0.16, ease: "power3.out" });
    const boxY = gsap.quickTo(box, "y", { duration: 0.16, ease: "power3.out" });
    const boxW = gsap.quickTo(box, "width", {
      duration: 0.2,
      ease: "power3.out",
    });
    const boxH = gsap.quickTo(box, "height", {
      duration: 0.2,
      ease: "power3.out",
    });

    const INTERACTIVE_SELECTOR =
      "[data-cursor-box], a, button, [role='button']";

    const releaseTarget = (el: HTMLElement | null) => {
      if (!el) return;
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.45,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    let rafId = 0;

    const syncCursor = () => {
      rafId = requestAnimationFrame(syncCursor);
      const { x: clientX, y: clientY } = mousePosRef.current;
      if (clientX < 0 && clientY < 0) return;

      const hoveredEl = activeTargetRef.current;
      if (hoveredEl && document.body.contains(hoveredEl)) {
        const rect = hoveredEl.getBoundingClientRect();
        if (rect.width > 0 && rect.width <= 540 && rect.height <= 160) {
          const computed = window.getComputedStyle(hoveredEl);
          const borderW = parseFloat(computed.borderTopWidth) || 0;
          const bg = computed.backgroundColor || "";
          const hasVisibleBox =
            borderW > 0 ||
            (bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent");

          // If element is bare inline text without padding/box, give it a generous pill frame
          const padX = hasVisibleBox ? 0 : 20;
          const padY = hasVisibleBox ? 0 : 10;

          const targetW = rect.width + padX;
          const targetH = rect.height + padY;

          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          // Subtle magnetic pull on both the button and the cursor ring
          const pullX = (clientX - centerX) * 0.14;
          const pullY = (clientY - centerY) * 0.18;

          if (!hoveredEl.hasAttribute("data-no-magnet")) {
            gsap.to(hoveredEl, {
              x: pullX,
              y: pullY,
              duration: 0.25,
              ease: "power2.out",
              overwrite: "auto",
            });
          }

          const rawRadius = computed.borderTopLeftRadius;
          const parsedRadius = parseFloat(rawRadius);
          const finalRadius = hasVisibleBox
            ? Number.isFinite(parsedRadius) && parsedRadius > 0
              ? `${parsedRadius}px`
              : "9999px"
            : "9999px";

          box.style.borderRadius = finalRadius;
          boxX(centerX + pullX * 0.35);
          boxY(centerY + pullY * 0.35);
          boxW(targetW);
          boxH(targetH);
          return;
        }
      }

      // Free-floating sleek cursor state
      box.style.borderRadius = "9999px";
      boxX(clientX);
      boxY(clientY);
      boxW(20);
      boxH(20);
    };

    rafId = requestAnimationFrame(syncCursor);

    const onMouseMove = (e: MouseEvent) => {
      mousePosRef.current.x = e.clientX;
      mousePosRef.current.y = e.clientY;
      setVisible((prev) => (prev ? prev : true));

      dotX(e.clientX);
      dotY(e.clientY);

      const target = e.target as HTMLElement | null;
      const interactiveEl = target?.closest(
        INTERACTIVE_SELECTOR
      ) as HTMLElement | null;

      if (interactiveEl !== activeTargetRef.current) {
        releaseTarget(activeTargetRef.current);

        if (interactiveEl) {
          const rect = interactiveEl.getBoundingClientRect();
          if (rect.width > 0 && rect.width <= 540 && rect.height <= 160) {
            activeTargetRef.current = interactiveEl;
            setIsLocked(true);
            return;
          }
        }

        activeTargetRef.current = null;
        setIsLocked(false);
      }
    };

    const onScroll = () => {
      if (activeTargetRef.current) {
        releaseTarget(activeTargetRef.current);
        activeTargetRef.current = null;
        setIsLocked(false);
      }
    };

    const onMouseLeave = () => {
      releaseTarget(activeTargetRef.current);
      activeTargetRef.current = null;
      setIsLocked(false);
      setVisible(false);
    };
    const onMouseEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      cancelAnimationFrame(rafId);
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
      <style>{`
        html, body, *, *::before, *::after, a, button, input, select, textarea, label, [role="button"] {
          cursor: none !important;
        }
      `}</style>

      {/* Magnetic Morphing Halo Frame */}
      <div
        ref={boxRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9998] -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{
          width: 20,
          height: 20,
          borderRadius: 9999,
          opacity: visible ? 1 : 0,
          border: isLocked
            ? "1.5px solid rgba(250, 245, 240, 0.85)"
            : "1.5px solid rgba(250, 245, 240, 0.35)",
          background: isLocked
            ? "rgba(255, 255, 255, 0.03)"
            : "rgba(255, 255, 255, 0.02)",
          boxShadow: isLocked
            ? "0 0 20px rgba(255, 107, 74, 0.28)"
            : "0 0 10px rgba(255, 107, 74, 0.12)",
          backdropFilter: "none",
          transition:
            "opacity 180ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease, border-radius 160ms ease",
        }}
      />

      {/* Precision Center Pointer Dot (Fades out cleanly when locked onto a button so it never overlaps text) */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
        style={{
          width: isLocked ? 3 : 5,
          height: isLocked ? 3 : 5,
          opacity: visible ? (isLocked ? 0 : 0.95) : 0,
          backgroundColor: "#faf5f0",
          boxShadow: "0 0 8px rgba(255, 255, 255, 0.7)",
          transition: "opacity 140ms ease, width 140ms ease, height 140ms ease",
        }}
      />
    </>
  );
}
