"use client";

import { useRef, type CSSProperties } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { fontsReady } from "@/lib/intro";
import { prefersReducedMotionNow } from "@/lib/hooks";

/* Two passes of 0–9, so every figure (including 0) can roll forward and land. */
const CYCLE = Array.from({ length: 20 }, (_, i) => i % 10);

/**
 * Digits roll like an odometer: each column spins through a full 0-9 cycle and
 * settles on its number. The final value is also plain CSS, so it is correct
 * with no JavaScript and with reduced motion.
 */
export function Odometer({
  value,
  suffix = "",
  className = "",
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const digits = String(value).split("").map(Number);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || prefersReducedMotionNow()) return;
      const strips = Array.from(root.querySelectorAll<HTMLElement>("[data-strip]"));
      const tail = root.querySelector("[data-suffix]");

      let disposed = false;
      let st: ScrollTrigger | undefined;

      const play = () => {
        const tl = gsap.timeline({
          onComplete: () => {
            /* Hand the resting place back to the CSS em offset, which matches
               the measured step, so a resize cannot leave a digit half-clipped. */
            gsap.set(strips, { clearProps: "transform" });
            root.dataset.revealed = "true";
          },
        });
        strips.forEach((strip) => {
          const digit = Number(strip.dataset.digit);
          const slot = strip.firstElementChild?.getBoundingClientRect().height ?? 0;
          if (!slot) return;
          /* Pixel steps, not a percentage of the whole strip. A percent step
             drifts after 9 and parks the column on 0 while the rest wait. */
          tl.fromTo(
            strip,
            { y: 0 },
            { y: -(10 + digit) * slot, duration: 1.15, ease: "power2.out" },
            0
          );
        });
        if (tail) {
          tl.fromTo(tail, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.7 }, 0.35);
        }
      };

      gsap.set(root, { opacity: 1 });
      fontsReady().then(() => {
        if (disposed) return;
        st = ScrollTrigger.create({
          trigger: root,
          start: "top 88%",
          once: true,
          onEnter: play,
        });
      });
      return () => {
        disposed = true;
        st?.kill();
      };
    },
    { scope: rootRef }
  );

  return (
    <span ref={rootRef} data-reveal="odometer" className={`odo ${className}`}>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
      <span className="odo__digits" aria-hidden="true">
        {digits.map((d, i) => (
          <span key={i} className="odo__col">
            <span
              data-strip
              data-digit={d}
              className="odo__strip"
              style={{ "--d": 10 + d } as CSSProperties}
            >
              {CYCLE.map((n, k) => (
                <span key={k}>{n}</span>
              ))}
            </span>
          </span>
        ))}
      </span>
      {suffix ? (
        <span data-suffix className="odo__suffix" aria-hidden="true">
          {suffix}
        </span>
      ) : null}
    </span>
  );
}
