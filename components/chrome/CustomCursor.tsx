"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * CustomCursor — Refined Magnetic Attachment Halo & Menu Vanish System
 * 1. Free state: Minimal luminous pearl-coral dot cursor.
 * 2. Compact Pill/Button state (`[data-cursor-box]` with height <= 64px):
 *    The dot vanishes and morphs into a tight, non-overlapping outer magnetic halo
 *    (`width + 8px`, `height + 8px`, matching exact `border-radius`) that shifts with
 *    a subtle 1.25x parallax offset relative to the button.
 * 3. Menu item state (`[data-menu-item]`):
 *    The cursor dot and halo vanish completely (`opacity: 0`) while the menu typography
 *    and preview card shift magnetically on their own—never drawing an overlapping box
 *    across the menu rows or preview images.
 */
export function CustomCursor() {
  const haloRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  const activeTargetRef = useRef<HTMLElement | null>(null);
  const cachedRectRef = useRef<DOMRect | null>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const isTouchOnly =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (!isTouchOnly) {
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted || !haloRef.current || !dotRef.current) return;

    const halo = haloRef.current;
    const dot = dotRef.current;

    gsap.set([halo, dot], {
      xPercent: -50,
      yPercent: -50,
      x: -100,
      y: -100,
      opacity: 0,
      scale: 1,
    });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.035, ease: "none" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.035, ease: "none" });
    const haloX = gsap.quickTo(halo, "x", {
      duration: 0.18,
      ease: "power3.out",
    });
    const haloY = gsap.quickTo(halo, "y", {
      duration: 0.18,
      ease: "power3.out",
    });

    const INTERACTIVE_SELECTOR = "[data-cursor-box], [data-menu-item]";

    const computeHaloRadius = (el: HTMLElement, rect: DOMRect): string => {
      const computed = window.getComputedStyle(el).borderTopLeftRadius;
      const numeric = parseFloat(computed) || 12;
      if (numeric >= rect.height * 0.42) {
        return "9999px";
      }
      return `${Math.round(numeric + 4)}px`;
    };

    const showFreeDot = (clientX: number, clientY: number) => {
      gsap.to(halo, {
        width: 18,
        height: 18,
        borderRadius: "9999px",
        opacity: 0,
        scale: 0.75,
        duration: 0.22,
        ease: "power3.out",
        overwrite: "auto",
      });
      haloX(clientX);
      haloY(clientY);

      gsap.to(dot, {
        opacity: 1,
        scale: 1,
        duration: 0.18,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const hideCursorForMenu = () => {
      gsap.to(halo, {
        opacity: 0,
        scale: 0.8,
        duration: 0.18,
        ease: "power3.out",
        overwrite: "auto",
      });
      gsap.to(dot, {
        opacity: 0,
        scale: 0.2,
        duration: 0.16,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const attachHaloToPill = (el: HTMLElement, rect: DOMRect) => {
      // Tight +8px (+4px per side) cushion so adjacent pills never overlap
      const targetW = Math.round(rect.width + 8);
      const targetH = Math.round(rect.height + 8);
      const targetRadius = computeHaloRadius(el, rect);

      halo.style.borderRadius = targetRadius;

      gsap.to(halo, {
        width: targetW,
        height: targetH,
        opacity: 1,
        scale: 1,
        duration: 0.26,
        ease: "power3.out",
        overwrite: "auto",
      });

      gsap.to(dot, {
        opacity: 0,
        scale: 0.2,
        duration: 0.15,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

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

    const onMouseMove = (e: MouseEvent) => {
      const clientX = e.clientX;
      const clientY = e.clientY;
      posRef.current = { x: clientX, y: clientY };

      dotX(clientX);
      dotY(clientY);

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        gsap.set(dot, { opacity: 1, scale: 1 });
      }

      const target = e.target as HTMLElement | null;
      const rawInteractive = target?.closest(
        INTERACTIVE_SELECTOR
      ) as HTMLElement | null;

      let interactiveEl = rawInteractive;
      if (interactiveEl && !interactiveEl.hasAttribute("data-menu-item")) {
        const testRect = interactiveEl.getBoundingClientRect();
        // Only attach halo to compact pill/button elements, never large cards or full-width blocks
        if (testRect.width > 420 || testRect.height > 64) {
          interactiveEl = null;
        }
      }

      if (interactiveEl !== activeTargetRef.current) {
        releaseTarget(activeTargetRef.current);

        if (interactiveEl) {
          gsap.set(interactiveEl, { x: 0, y: 0 });
          const rect = interactiveEl.getBoundingClientRect();
          activeTargetRef.current = interactiveEl;
          cachedRectRef.current = rect;

          if (interactiveEl.hasAttribute("data-menu-item")) {
            hideCursorForMenu();
          } else {
            attachHaloToPill(interactiveEl, rect);
          }
        } else {
          activeTargetRef.current = null;
          cachedRectRef.current = null;
          showFreeDot(clientX, clientY);
        }
      }

      const currentEl = activeTargetRef.current;
      const rect = cachedRectRef.current;

      if (currentEl && rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const isMenuItem = currentEl.hasAttribute("data-menu-item");
        const noMagnet = currentEl.hasAttribute("data-no-magnet");

        const maxPullX = isMenuItem ? 14 : 5.5;
        const maxPullY = isMenuItem ? 4.5 : 4;

        const rawX = (clientX - centerX) * (isMenuItem ? 0.11 : 0.18);
        const rawY = (clientY - centerY) * (isMenuItem ? 0.11 : 0.22);

        const pullX = noMagnet
          ? 0
          : Math.max(-maxPullX, Math.min(maxPullX, rawX));
        const pullY = noMagnet
          ? 0
          : Math.max(-maxPullY, Math.min(maxPullY, rawY));

        if (!noMagnet) {
          gsap.to(currentEl, {
            x: pullX,
            y: pullY,
            duration: 0.24,
            ease: "power2.out",
            overwrite: "auto",
          });
        }

        if (!isMenuItem) {
          haloX(centerX + pullX * 1.28);
          haloY(centerY + pullY * 1.28);
        }
      } else {
        haloX(clientX);
        haloY(clientY);
      }
    };

    const onScroll = () => {
      if (activeTargetRef.current) {
        releaseTarget(activeTargetRef.current);
        activeTargetRef.current = null;
        cachedRectRef.current = null;
        showFreeDot(posRef.current.x, posRef.current.y);
      }
    };

    const onMouseLeave = () => {
      releaseTarget(activeTargetRef.current);
      activeTargetRef.current = null;
      cachedRectRef.current = null;
      gsap.to([halo, dot], {
        opacity: 0,
        duration: 0.15,
        overwrite: "auto",
      });
    };

    const onMouseEnter = () => {
      const { x, y } = posRef.current;
      gsap.set(dot, { x, y, opacity: 1, scale: 1 });
    };

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
      {/* Outer Magnetic Attachment Halo — wraps compact buttons/pills cleanly without overlapping */}
      <div
        ref={haloRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9998] will-change-transform"
        style={{
          width: 18,
          height: 18,
          borderRadius: 9999,
          border: "1.25px solid rgba(245, 184, 143, 0.62)",
          background:
            "linear-gradient(135deg, rgba(245, 184, 143, 0.14) 0%, rgba(255, 126, 112, 0.1) 55%, rgba(255, 255, 255, 0.04) 100%)",
          boxShadow:
            "0 0 18px rgba(245, 184, 143, 0.18), inset 0 0 8px rgba(245, 184, 143, 0.08)",
        }}
      />

      {/* Free-Floating Minimal Luminous Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full will-change-transform"
        style={{
          width: 10,
          height: 10,
          background:
            "radial-gradient(circle at 35% 35%, #ffffff 0%, #f5d0af 55%, #f5b88f 100%)",
          boxShadow:
            "0 0 10px rgba(245, 184, 143, 0.75), 0 0 3px rgba(255, 255, 255, 0.85)",
        }}
      />
    </>
  );
}
