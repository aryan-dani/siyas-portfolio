"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { prefersReducedMotionNow } from "@/lib/hooks";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";

export function BackToTop() {
  const { scrollTo } = useSmoothScroll();
  return (
    <button type="button" className="type-label link-u footer__top" onClick={() => scrollTo(0)}>
      Back to top ↑
    </button>
  );
}

const TILT = [-7, 5, -4, 6];
const SPREAD = ["-1.15vw", "-0.35vw", "0.35vw", "1.15vw"];

/**
 * The wordmark is set like a poster at the bottom edge. Scrolling composes it:
 * each letter climbs out of the crop, loses its tilt, then the name eases
 * apart. A mouse leans the letters slowly, the way the hero parts.
 */
export function FooterMark() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotionNow()) return;
      const letters = el.querySelectorAll<HTMLElement>("[data-letter]");
      const glyphs = el.querySelectorAll<HTMLElement>("[data-glyph]");
      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 0.65,
        },
      });
      letters.forEach((letter, i) => {
        const buried = letter.offsetHeight * 1.2;
        gsap.set(letter, {
          y: buried,
          x: 0,
          rotation: TILT[i] ?? 0,
          transformOrigin: "50% 100%",
        });
        tl.to(
          letter,
          { y: 0, rotation: 0, x: SPREAD[i] ?? "0vw", duration: 1, ease: "none" },
          i * 0.08
        );
      });

      const xTo = fine
        ? Array.from(glyphs, (glyph) => gsap.quickTo(glyph, "x", { duration: 1.05, ease: "power3.out" }))
        : [];
      const yTo = fine
        ? Array.from(glyphs, (glyph) => gsap.quickTo(glyph, "y", { duration: 1.25, ease: "power3.out" }))
        : [];

      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        glyphs.forEach((_, i) => {
          const side = i - 1.5;
          xTo[i](nx * side * 28);
          yTo[i](ny * -18);
        });
      };
      const onLeave = () => {
        glyphs.forEach((_, i) => {
          xTo[i](0);
          yTo[i](0);
        });
      };

      if (fine) {
        window.addEventListener("pointermove", onMove, { passive: true });
        document.documentElement.addEventListener("mouseleave", onLeave);
      }

      return () => {
        if (fine) {
          window.removeEventListener("pointermove", onMove);
          document.documentElement.removeEventListener("mouseleave", onLeave);
        }
      };
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="footer__mark type-display" aria-hidden="true">
      {["S", "I", "Y", "A"].map((letter) => (
        <span key={letter} data-letter>
          <span className="footer__glyph" data-glyph>
            {letter}
          </span>
        </span>
      ))}
    </div>
  );
}
