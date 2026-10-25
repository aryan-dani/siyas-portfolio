"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { setIntroState } from "@/lib/intro";
import { prefersReducedMotionNow } from "@/lib/hooks";
import { SIGNATURE_SIYA } from "@/lib/signature-paths";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";
import {
  SignaturePath,
  buildSignatureTimeline,
} from "@/components/motion/Signature";

/* Counts effect runs so a quick unmount/remount (React Strict Mode) is told
   apart from the page genuinely being left mid-intro. */
let runToken = 0;

/**
 * Opening: "Siya" writes itself on buttermilk, then the panel lifts away with a
 * curved edge. ~1.75s, once per session, home page only, skipped with reduced
 * motion. Click / tap / any key fast-forwards it.
 */
export function Intro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const { lock, unlock } = useSmoothScroll();

  useGSAP(
    () => {
      const root = rootRef.current;
      const svg = svgRef.current;
      const path = pathRef.current;
      if (!root || !svg || !path) return;
      if (document.documentElement.dataset.intro !== "pending") return;
      if (prefersReducedMotionNow()) {
        setIntroState("done");
        return;
      }

      const token = ++runToken;
      let locked = true;
      lock();

      const finish = () => {
        setIntroState("done");
        if (locked) {
          locked = false;
          unlock();
        }
      };

      gsap.set(path, { drawSVG: "0%" });
      gsap.set(svg, { visibility: "visible" });

      const tl = gsap.timeline({ onComplete: finish });
      tl.add(buildSignatureTimeline(path, { draw: 0.85, paused: false }), 0);
      tl.call(() => setIntroState("revealing"), undefined, 0.95);
      tl.to(
        svg,
        { yPercent: -35, autoAlpha: 0, duration: 0.7, ease: "power2.in" },
        0.95
      );
      tl.to(
        root,
        {
          y: () => -window.innerHeight * 1.2,
          duration: 0.85,
          ease: "expo.inOut",
        },
        0.95
      );

      const skip = () => tl.timeScale(5);
      window.addEventListener("pointerdown", skip, { once: true });
      window.addEventListener("keydown", skip, { once: true });

      return () => {
        window.removeEventListener("pointerdown", skip);
        window.removeEventListener("keydown", skip);
        tl.kill();
        if (locked) {
          locked = false;
          unlock();
        }
        // If the page is left mid-intro, don't strand it half-lifted. (A
        // Strict Mode remount bumps runToken first, so it won't trigger this.)
        window.setTimeout(() => {
          if (token === runToken && document.documentElement.dataset.intro !== "done") {
            setIntroState("done");
          }
        }, 60);
      };
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className="intro" aria-hidden="true">
      <svg
        ref={svgRef}
        viewBox={SIGNATURE_SIYA.viewBox}
        className="w-[min(62vw,440px)]"
        style={{ visibility: "hidden" }}
      >
        <SignaturePath pathRef={pathRef} strokeWidth={1.3} />
      </svg>
    </div>
  );
}
