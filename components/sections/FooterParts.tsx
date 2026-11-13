"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotionNow } from "@/lib/hooks";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";

export function BackToTop() {
  const { scrollTo } = useSmoothScroll();
  return (
    <button type="button" className="type-label link-u footer__top" onClick={() => scrollTo(0)}>
      back to top ↑
    </button>
  );
}

const TILT = [-11, 7, -6, 10];
/* Gather toward center, then rest in the space-between seats */
const GATHER = ["14vw", "5vw", "-5vw", "-14vw"];

/**
 * Full-bleed poster wordmark. Scroll pulls each letter up from under the crop,
 * eases the tilt off, and fans the name out to the footer edges.
 */
export function FooterMark() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotionNow()) return;
      const letters = el.querySelectorAll<HTMLElement>("[data-letter]");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 0.65,
          invalidateOnRefresh: true,
        },
      });

      letters.forEach((letter, i) => {
        const buried = Math.max(letter.offsetHeight * 1.4, el.offsetHeight * 1.75);
        gsap.set(letter, {
          y: buried,
          x: GATHER[i] ?? 0,
          rotation: TILT[i] ?? 0,
          transformOrigin: "50% 100%",
        });
        tl.to(
          letter,
          {
            y: 0,
            rotation: 0,
            x: 0,
            duration: 1,
            ease: "none",
          },
          i * 0.08,
        );
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="footer__mark type-display" aria-hidden="true">
      {["s", "i", "y", "a"].map((letter) => (
        <span key={letter} data-letter>
          <span className="footer__glyph" data-glyph>
            {letter}
          </span>
        </span>
      ))}
    </div>
  );
}
