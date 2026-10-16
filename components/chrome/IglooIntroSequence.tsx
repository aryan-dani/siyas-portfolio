"use client";

import React, { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

export function IglooIntroSequence() {
  const reducedMotion = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"counting" | "opening" | "done">(
    "counting"
  );

  useEffect(() => {
    if (
      reducedMotion ||
      (typeof window !== "undefined" &&
        window.location.search.includes("skipIntro"))
    ) {
      setPhase("done");
      return;
    }

    let rafId = 0;
    const duration = 620;
    const start = performance.now();

    const step = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed < duration) {
        rafId = requestAnimationFrame(step);
      } else {
        setPhase("opening");
        window.setTimeout(() => {
          setPhase("done");
        }, 420);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  if (phase === "done") return null;

  const isOpening = phase === "opening";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[200] flex flex-col justify-between overflow-hidden select-none"
    >
      {/* Top Shutter Panel */}
      <div
        className={`relative flex flex-1 flex-col justify-between border-b border-white/[0.08] bg-[#090506] px-8 pt-8 pb-6 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isOpening ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="flex items-center justify-between font-sans text-xs tracking-wide text-white/45">
          <span>Siya · Portfolio &apos;26</span>
          <span>Pune, India</span>
        </div>

        <div className="flex items-baseline justify-between">
          <span className="font-serif text-xl italic text-[#ff8a70]">
            stories people actually finish.
          </span>
          <span className="font-display text-5xl font-bold tracking-[-0.05em] text-[#FAF5F0] tabular-nums sm:text-6xl">
            {progress}
            <span className="font-serif text-2xl font-normal italic text-[#ff8a70]">
              %
            </span>
          </span>
        </div>
      </div>

      {/* Center Expanding Hairline */}
      <div
        className={`h-[1px] bg-[#ff8a70]/60 transition-opacity duration-300 ${
          isOpening ? "opacity-0" : "opacity-100"
        }`}
        style={{ width: `${progress}%` }}
      />

      {/* Bottom Shutter Panel */}
      <div
        className={`relative flex flex-1 flex-col justify-end bg-[#090506] px-8 pt-6 pb-8 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isOpening ? "translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="flex items-center justify-between font-sans text-xs text-white/40">
          <span>@heartsfromsiya</span>
          <span>Creator &amp; Storyteller</span>
        </div>
      </div>
    </div>
  );
}
