"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * The normal system cursor everywhere, except over photos and videos: those
 * (marked data-cursor="Play" / "Siya" ...) get a buttermilk disc that follows
 * the pointer, and the arrow is hidden while that disc is the cursor.
 */
export function MediaCursor() {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const dot = dotRef.current;
      const label = labelRef.current;
      if (!dot || !label || !fine) return;

      gsap.set(dot, { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 });
      const xTo = gsap.quickTo(dot, "x", { duration: reduced ? 0 : 0.55, ease: "power3" });
      const yTo = gsap.quickTo(dot, "y", { duration: reduced ? 0 : 0.55, ease: "power3" });

      let active: Element | null = null;
      let x = 0;
      let y = 0;
      let raf = 0;

      const show = (text: string) => {
        label.textContent = text;
        gsap.to(dot, { scale: 1, autoAlpha: 1, duration: 0.55, ease: "expo.out", overwrite: "auto" });
      };
      const hide = () => {
        gsap.to(dot, { scale: 0, autoAlpha: 0, duration: 0.4, ease: "expo.out", overwrite: "auto" });
      };

      const retarget = (target: EventTarget | null) => {
        const el = target instanceof Element ? target.closest("[data-cursor]") : null;
        if (el === active) return;
        active = el;
        if (el) show(el.getAttribute("data-cursor") ?? "");
        else hide();
      };

      const onMove = (e: PointerEvent) => {
        x = e.clientX;
        y = e.clientY;
        xTo(x);
        yTo(y);
        retarget(e.target);
      };

      // Smooth scrolling moves content under a still pointer: re-check then.
      const onScroll = () => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          retarget(document.elementFromPoint(x, y));
        });
      };

      const onLeave = () => {
        active = null;
        hide();
      };

      // A hovered element changed its own label (e.g. Play <-> Pause).
      const onRefresh = () => {
        if (active) label.textContent = active.getAttribute("data-cursor") ?? "";
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("siya:cursor-refresh", onRefresh);
      document.documentElement.addEventListener("mouseleave", onLeave);
      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("siya:cursor-refresh", onRefresh);
        document.documentElement.removeEventListener("mouseleave", onLeave);
        if (raf) cancelAnimationFrame(raf);
      };
    },
    { dependencies: [fine, reduced] }
  );

  if (!fine) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[120] grid size-[84px] place-items-center rounded-full bg-buttermilk text-burgundy opacity-0 shadow-[0_0_0_1px_rgba(67,48,46,0.18)]"
    >
      <span ref={labelRef} className="type-label !text-[0.64rem]" />
    </div>
  );
}
