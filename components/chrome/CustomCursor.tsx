"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * CustomCursor — Magnetic Attachment Halo + Parallax Pull System
 * - Free state: Crisp luminous dot cursor with subtle monospace velocity/offset telemetry (`0 0`),
 *   inspired by luxury creative developer portfolios.
 * - Attached state: When hovering any button, pill, link, menu item, or `[data-cursor-box]`,
 *   the cursor dot disappears and morphs into a padded outer glowing glass halo that wraps
 *   the element's exact geometry (`border-radius`, `width + 12px`, `height + 12px`) and shifts
 *   magnetically with a layered parallax offset alongside the button itself.
 */
export function CustomCursor() {
  const haloRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const coordsRef = useRef<HTMLSpanElement | null>(null);
  const [mounted, setMounted] = useState(false);

  const activeTargetRef = useRef<HTMLElement | null>(null);
  const cachedRectRef = useRef<DOMRect | null>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const prevPosRef = useRef({ x: 0, y: 0 });
  const isVisibleRef = useRef(false);
  const isAttachedRef = useRef(false);

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
    const coords = coordsRef.current;

    gsap.set([halo, dot], {
      xPercent: -50,
      yPercent: -50,
      x: -100,
      y: -100,
      opacity: 0,
      scale: 1,
    });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.03, ease: "none" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.03, ease: "none" });
    const haloX = gsap.quickTo(halo, "x", {
      duration: 0.14,
      ease: "power3.out",
    });
    const haloY = gsap.quickTo(halo, "y", {
      duration: 0.14,
      ease: "power3.out",
    });

    const INTERACTIVE_SELECTOR =
      "[data-cursor-box], [data-menu-item], a, button, [role='button']";

    const computeHaloRadius = (el: HTMLElement, rect: DOMRect): string => {
      const computed = window.getComputedStyle(el).borderTopLeftRadius;
      const numeric = parseFloat(computed) || 12;
      if (numeric >= rect.height * 0.45) {
        return "9999px";
      }
      return `${Math.round(numeric + 5)}px`;
    };

    const detachHalo = (clientX: number, clientY: number) => {
      isAttachedRef.current = false;
      gsap.to(halo, {
        width: 24,
        height: 24,
        borderRadius: "9999px",
        opacity: 0,
        scale: 0.65,
        duration: 0.2,
        ease: "power3.out",
        overwrite: "auto",
      });
      haloX(clientX);
      haloY(clientY);

      gsap.to(dot, {
        opacity: 1,
        scale: 1,
        duration: 0.16,
        ease: "power3.out",
        overwrite: "auto",
      });
      if (coords) {
        gsap.to(coords, {
          opacity: 0.42,
          duration: 0.18,
          overwrite: "auto",
        });
      }
    };

    const attachHaloToRect = (el: HTMLElement, rect: DOMRect) => {
      isAttachedRef.current = true;
      const pad = el.hasAttribute("data-menu-item") ? 8 : 11;
      const targetW = Math.round(rect.width + pad);
      const targetH = Math.round(rect.height + pad);
      const targetRadius = computeHaloRadius(el, rect);

      halo.style.borderRadius = targetRadius;

      gsap.to(halo, {
        width: targetW,
        height: targetH,
        opacity: 1,
        scale: 1,
        duration: 0.22,
        ease: "power3.out",
        overwrite: "auto",
      });

      gsap.to(dot, {
        opacity: 0,
        scale: 0.2,
        duration: 0.14,
        ease: "power3.out",
        overwrite: "auto",
      });

      if (coords) {
        gsap.to(coords, {
          opacity: 0,
          duration: 0.12,
          overwrite: "auto",
        });
      }
    };

    const releaseTarget = (el: HTMLElement | null) => {
      if (!el) return;
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.4,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    let lastCoordUpdate = 0;

    const onMouseMove = (e: MouseEvent) => {
      const clientX = e.clientX;
      const clientY = e.clientY;

      const dx = Math.round((clientX - prevPosRef.current.x) * 0.35);
      const dy = Math.round((clientY - prevPosRef.current.y) * 0.35);
      prevPosRef.current = { x: clientX, y: clientY };
      posRef.current = { x: clientX, y: clientY };

      dotX(clientX);
      dotY(clientY);

      if (coords && !isAttachedRef.current) {
        const now = performance.now();
        if (now - lastCoordUpdate > 45) {
          lastCoordUpdate = now;
          coords.textContent = `${Math.abs(dx)}  ${Math.abs(dy)}`;
        }
      }

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        gsap.set(dot, { opacity: 1, scale: 1 });
        if (coords) gsap.set(coords, { opacity: 0.42 });
      }

      const target = e.target as HTMLElement | null;
      const rawInteractive = target?.closest(
        INTERACTIVE_SELECTOR
      ) as HTMLElement | null;

      // Prefer inner [data-cursor-box] or button/link that fits magnetic halo dimensions
      let interactiveEl = rawInteractive;
      if (interactiveEl) {
        const testRect = interactiveEl.getBoundingClientRect();
        if (testRect.width > 560 || testRect.height > 170) {
          // If it's a huge container (e.g. a whole reel card), check if there's a smaller pill inside or skip halo wrap
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
          attachHaloToRect(interactiveEl, rect);
        } else {
          activeTargetRef.current = null;
          cachedRectRef.current = null;
          detachHalo(clientX, clientY);
        }
      }

      const currentEl = activeTargetRef.current;
      const rect = cachedRectRef.current;

      if (currentEl && rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const isMenuItem = currentEl.hasAttribute("data-menu-item");
        const noMagnet = currentEl.hasAttribute("data-no-magnet");

        const maxPullX = isMenuItem ? 14 : 9;
        const maxPullY = isMenuItem ? 5 : 6;

        const rawX = (clientX - centerX) * (isMenuItem ? 0.12 : 0.22);
        const rawY = (clientY - centerY) * (isMenuItem ? 0.12 : 0.26);

        const pullX = noMagnet
          ? 0
          : Math.max(-maxPullX, Math.min(maxPullX, rawX));
        const pullY = noMagnet
          ? 0
          : Math.max(-maxPullY, Math.min(maxPullY, rawY));

        // Move the element itself magnetically
        if (!noMagnet) {
          gsap.to(currentEl, {
            x: pullX,
            y: pullY,
            duration: 0.2,
            ease: "power2.out",
            overwrite: "auto",
          });
        }

        // Move the outer magnetic halo with a 1.45x parallax offset so its glowing rim shifts around the button!
        haloX(centerX + pullX * 1.48);
        haloY(centerY + pullY * 1.48);
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
        detachHalo(posRef.current.x, posRef.current.y);
      }
    };

    const onMouseLeave = () => {
      releaseTarget(activeTargetRef.current);
      activeTargetRef.current = null;
      cachedRectRef.current = null;
      isAttachedRef.current = false;
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
      {/* Outer Magnetic Attachment Halo — wraps buttons/pills/links on hover with parallax rim offset */}
      <div
        ref={haloRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9998] will-change-transform"
        style={{
          width: 24,
          height: 24,
          borderRadius: 9999,
          border: "1.5px solid rgba(245, 184, 143, 0.72)",
          background:
            "linear-gradient(135deg, rgba(245, 184, 143, 0.18) 0%, rgba(255, 126, 112, 0.14) 55%, rgba(255, 255, 255, 0.06) 100%)",
          boxShadow:
            "0 0 22px rgba(245, 184, 143, 0.24), inset 0 0 10px rgba(245, 184, 143, 0.12)",
        }}
      />

      {/* Free-Floating Luminous Dot + Subtle Telemetry (`0 0`) */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] flex items-center will-change-transform"
      >
        <span
          ref={coordsRef}
          className="mr-2 font-mono text-[9px] tracking-[0.18em] text-white/40 select-none"
          style={{ opacity: 0 }}
        >
          0  0
        </span>
        <span
          className="block rounded-full"
          style={{
            width: 11,
            height: 11,
            background:
              "radial-gradient(circle at 35% 35%, #ffffff 0%, #f5d0af 55%, #f5b88f 100%)",
            boxShadow:
              "0 0 12px rgba(245, 184, 143, 0.8), 0 0 4px rgba(255, 255, 255, 0.9)",
          }}
        />
      </div>
    </>
  );
}
