"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";

const INTRO_MAIN_TEXT = "hearts from siya.";
const INTRO_HANDLE_TEXT = "@HEARTSFROMSIYA · PUNE, INDIA";
const INTRO_SUB_TEXT = "Warm stories people actually finish.";
const CIPHER_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789✦·/@#";

function buildScrambledSlice(
  target: string,
  progress: number,
  tick: number,
  frontierSize = 3
): { locked: string; scrambled: string } {
  if (progress >= 1) {
    return { locked: target, scrambled: "" };
  }
  const lockedCount = Math.floor(progress * target.length);
  const locked = target.slice(0, lockedCount);
  const count = Math.min(frontierSize, target.length - lockedCount);
  let scrambled = "";
  for (let i = 0; i < count; i++) {
    const ch = target[lockedCount + i];
    if (ch === " " || ch === "·") {
      scrambled += ch;
    } else {
      const idx = (tick + i * 7 + lockedCount * 3) % CIPHER_GLYPHS.length;
      scrambled += CIPHER_GLYPHS[idx];
    }
  }
  return { locked, scrambled };
}

export type NavTransitionMeta = {
  chapter: string;
  titleBefore: string;
  titleAccent: string;
  sub: string;
};

export const SECTION_TRANSITION_META: Record<string, NavTransitionMeta> = {
  "#top": {
    chapter: "00 · STUDIO HOME",
    titleBefore: "SIYA ",
    titleAccent: "PAWAR.",
    sub: "@heartsfromsiya · Creator & Storyteller",
  },
  "#work": {
    chapter: "01 · SELECTED REELS",
    titleBefore: "STORIES PEOPLE ",
    titleAccent: "FINISH.",
    sub: "1.8M+ & 319K-Like Viral Reels · Brand Collaborations",
  },
  "#proof": {
    chapter: "02 · AUDIENCE & PROOF",
    titleBefore: "10M+ MONTHLY ",
    titleAccent: "REACH.",
    sub: "PharmEasy · Mokobara · Consumer Startups",
  },
  "#about": {
    chapter: "03 · BEHIND THE CAMERA",
    titleBefore: "GOLDEN HOUR IN ",
    titleAccent: "PUNE.",
    sub: "Unscripted warmth & high-retention storytelling",
  },
  "#services": {
    chapter: "04 · TRANSPARENT RATES",
    titleBefore: "WAYS TO ",
    titleAccent: "COLLABORATE.",
    sub: "₹8,000 / 3 Reels · +₹2,000 each · ₹24,000 / Month",
  },
  "#contact": {
    chapter: "05 · DIRECT INBOX",
    titleBefore: "LET'S MAKE IT ",
    titleAccent: "HAPPEN.",
    sub: "siyapawar@gmail.com · Instant Scope & Subject Autofill",
  },
  "/copyright": {
    chapter: "06 · LEGAL & IP DOSSIER",
    titleBefore: "COPYRIGHT & ",
    titleAccent: "IP.",
    sub: "Creator Likeness · Brand Licensing · Digital Architecture",
  },
};

/**
 * IntroTypingPreloader
 * Frosted-glass background blur (`backdrop-filter: blur(44px) saturate(165%)`) over the live
 * Hero stage, featuring a dual-font "hearts from siya." scramble-typewriter sequence
 * and a GPU-composited shutter + de-blur reveal into the home page.
 */
export function IntroTypingPreloader({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);
  const [tick, setTick] = useState(0);
  const [phase, setPhase] = useState<"typing" | "hold" | "done">("typing");

  useEffect(() => {
    if (phase !== "done") {
      document.documentElement.setAttribute("data-overlay-active", "true");
    } else {
      document.documentElement.removeAttribute("data-overlay-active");
    }
    return () => {
      document.documentElement.removeAttribute("data-overlay-active");
    };
  }, [phase]);

  useEffect(() => {
    const hasHashTarget =
      typeof window !== "undefined" && window.location.hash.length > 1;
    if (reducedMotion || hasHashTarget) {
      setPhase("done");
      onComplete?.();
      return;
    }

    const durationMs = 760;
    const startTime = performance.now();
    let rafId = 0;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const p = Math.min(1, elapsed / durationMs);
      setProgress(p);
      setTick(Math.floor(elapsed / 28));

      if (p < 1) {
        rafId = window.requestAnimationFrame(step);
      } else {
        setProgress(1);
        setPhase("hold");
      }
    };

    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [onComplete, reducedMotion]);

  useEffect(() => {
    if (phase === "done") return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        setPhase("done");
        onComplete?.();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onComplete, phase]);

  useEffect(() => {
    if (phase !== "hold") return;
    const holdTimer = window.setTimeout(() => {
      setPhase("done");
      onComplete?.();
    }, 340);
    return () => window.clearTimeout(holdTimer);
  }, [onComplete, phase]);

  const progressPct = Math.round(progress * 100);
  const mainTyped = buildScrambledSlice(INTRO_MAIN_TEXT, progress, tick, 3);
  const handleTyped = buildScrambledSlice(
    INTRO_HANDLE_TEXT,
    Math.min(1, progress * 1.15),
    tick,
    3
  );
  const subTyped = buildScrambledSlice(
    INTRO_SUB_TEXT,
    Math.max(0, (progress - 0.12) / 0.88),
    tick,
    3
  );

  // Split "hearts from " (first 12 chars) and "siya." (last 5 chars) so "siya." renders in italic serif
  const combinedMain = mainTyped.locked + mainTyped.scrambled;
  const mainSansPart = combinedMain.slice(0, 12);
  const mainSerifPart = combinedMain.slice(12);

  return (
    <AnimatePresence>
      {phase !== "done" ? (
        <motion.div
          key="studio-intro-preloader"
          initial={{ y: "0%", opacity: 1 }}
          exit={{
            y: "-102%",
            opacity: 0.92,
            transition: {
              duration: 0.68,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
          onClick={() => {
            setPhase("done");
            onComplete?.();
          }}
          style={{
            background:
              "radial-gradient(circle at 50% 42%, rgba(82, 20, 44, 0.56) 0%, rgba(12, 8, 12, 0.72) 62%, rgba(7, 6, 8, 0.84) 100%)",
            backdropFilter: "blur(44px) saturate(165%)",
            WebkitBackdropFilter: "blur(44px) saturate(165%)",
            transform: "translate3d(0,0,0)",
            backfaceVisibility: "hidden",
          }}
          className="fixed inset-0 z-[200] flex flex-col justify-between overflow-hidden border-b border-white/20 px-6 py-8 text-[#FAF6F2] shadow-[0_30px_90px_rgba(0,0,0,0.9)] will-change-transform select-none sm:px-12 sm:py-10"
        >
          {/* Top Studio Telemetry Bar */}
          <div className="flex items-center justify-between text-xs text-white/70">
            <span className="glass-pill rounded-full px-3.5 py-1 font-mono text-[10px] tracking-[0.22em] text-white/85 uppercase">
              ✦ Siya Pawar · 18.5204° N, 73.8567° E
            </span>
            <span className="glass-pill rounded-full px-3.5 py-1 font-mono text-[11px] tabular-nums text-[#f5b88f]">
              {String(progressPct).padStart(3, "0")}%
            </span>
          </div>

          {/* Center Monumental Frosted Glass Card */}
          <div className="my-auto mx-auto w-full max-w-[1220px]">
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.975 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -26, scale: 0.985 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background:
                  "linear-gradient(145deg, rgba(255, 255, 255, 0.11) 0%, rgba(255, 255, 255, 0.035) 55%, rgba(245, 184, 143, 0.06) 100%)",
                boxShadow:
                  "inset 0 1px 0 0 rgba(255, 255, 255, 0.42), 0 32px 84px -12px rgba(0, 0, 0, 0.82)",
              }}
              className="relative overflow-hidden rounded-[32px] border border-white/20 px-5 py-12 text-center will-change-transform sm:px-12 sm:py-16"
            >
              {/* Specular Light Sweep When Typing Finishes */}
              <motion.div
                aria-hidden="true"
                initial={{ x: "-110%" }}
                animate={{
                  x: phase === "hold" ? "110%" : "-110%",
                }}
                transition={{ duration: 0.48, ease: "easeOut" }}
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(245, 184, 143, 0.22) 50%, transparent 100%)",
                }}
                className="pointer-events-none absolute inset-0 will-change-transform"
              />

              {/* Top Handle Scramble Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 font-mono text-[10px] tracking-[0.24em] text-white/80 uppercase sm:text-[11px]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#f5b88f] shadow-[0_0_8px_#f5b88f]" />
                <span className="inline-grid items-center">
                  <span
                    aria-hidden="true"
                    className="invisible col-start-1 row-start-1 select-none"
                  >
                    {INTRO_HANDLE_TEXT}
                  </span>
                  <span className="col-start-1 row-start-1">
                    {handleTyped.locked}
                    <span className="text-[#f5b88f]">
                      {handleTyped.scrambled}
                    </span>
                  </span>
                </span>
              </div>

              {/* Monumental "hearts from siya." Wordmark (Zero Layout Shift via Invisible Sizer) */}
              <div
                style={{ fontSize: "clamp(2rem, 7.4vw, 7.6rem)" }}
                className="mt-5 inline-grid items-center justify-center leading-[1.02] tracking-[-0.045em] text-white"
              >
                <span
                  aria-hidden="true"
                  className="invisible col-start-1 row-start-1 select-none px-2"
                >
                  <span className="font-display font-bold">hearts from </span>
                  <em className="font-serif font-normal italic">siya.</em>
                </span>

                <span className="col-start-1 row-start-1 inline-flex items-center justify-center">
                  <span className="font-display font-bold">{mainSansPart}</span>
                  <em className="font-serif font-normal italic text-[#f5b88f] pr-1">
                    {mainSerifPart}
                  </em>
                  <span
                    aria-hidden="true"
                    className={`ml-1.5 inline-block h-[0.78em] w-[3px] rounded-full bg-[#f5b88f] shadow-[0_0_14px_rgba(245,184,143,0.95)] sm:w-[5px] ${
                      phase === "hold" ? "animate-pulse" : ""
                    }`}
                  />
                </span>
              </div>

              {/* Editorial Subtitle Scramble-Typing Reveal */}
              <p className="mt-5 font-serif text-lg italic text-white/85 sm:text-2xl">
                <span className="inline-grid items-center justify-center">
                  <span
                    aria-hidden="true"
                    className="invisible col-start-1 row-start-1 select-none"
                  >
                    {INTRO_SUB_TEXT}
                  </span>
                  <span className="col-start-1 row-start-1 inline-flex items-center justify-center">
                    <span>{subTyped.locked}</span>
                    <span className="font-mono text-sm not-italic text-[#f5b88f]/85">
                      {subTyped.scrambled}
                    </span>
                  </span>
                </span>
              </p>

              {/* GPU-Composited Progress Hairline */}
              <div className="mx-auto mt-8 h-[2px] w-full max-w-xs overflow-hidden rounded-full bg-white/15">
                <div
                  style={{
                    transform: `scaleX(${progress})`,
                    transformOrigin: "0% 50%",
                  }}
                  className="h-full w-full bg-gradient-to-r from-[#f5b88f] via-[#ff9a85] to-[#f5b88f] transition-transform duration-75 ease-out will-change-transform"
                />
              </div>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <div className="flex items-center justify-between text-[11px] text-white/60">
            <span>10M+ Monthly Views · Brand Collaborations</span>
            <span className="font-mono text-[10px] tracking-wider uppercase">
              Click or press Esc to enter
            </span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/**
 * SectionNavigationCurtain
 * Frosted-glass blurred GPU shutter transition with live scramble-typing
 * whenever the user navigates between sections or pages.
 */
export function SectionNavigationCurtain({
  activeMeta,
}: {
  activeMeta: NavTransitionMeta | null;
}) {
  const [progress, setProgress] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!activeMeta) {
      document.documentElement.removeAttribute("data-overlay-active");
      return;
    }
    document.documentElement.setAttribute("data-overlay-active", "true");
    const startTime = performance.now();
    const duration = 260;
    let rafId = 0;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const p = Math.min(1, elapsed / duration);
      setProgress(p);
      setTick(Math.floor(elapsed / 25));
      if (p < 1) {
        rafId = window.requestAnimationFrame(step);
      }
    };

    rafId = window.requestAnimationFrame(step);
    return () => {
      window.cancelAnimationFrame(rafId);
      document.documentElement.removeAttribute("data-overlay-active");
    };
  }, [activeMeta]);

  const subSlice = activeMeta
    ? buildScrambledSlice(activeMeta.sub, progress, tick, 4)
    : { locked: "", scrambled: "" };

  return (
    <AnimatePresence>
      {activeMeta ? (
        <motion.div
          key={activeMeta.chapter}
          aria-hidden="true"
          initial={{ y: "100%" }}
          animate={{
            y: "0%",
            transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
          }}
          exit={{
            y: "-102%",
            transition: { duration: 0.34, ease: [0.76, 0, 0.24, 1] },
          }}
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(74, 18, 38, 0.64) 0%, rgba(9, 6, 10, 0.82) 72%)",
            backdropFilter: "blur(38px) saturate(165%)",
            WebkitBackdropFilter: "blur(38px) saturate(165%)",
            transform: "translate3d(0,0,0)",
            backfaceVisibility: "hidden",
          }}
          className="pointer-events-none fixed inset-0 z-[180] flex flex-col items-center justify-center border-y border-white/20 px-6 text-center text-[#FAF6F2] shadow-[0_0_90px_rgba(0,0,0,0.9)] will-change-transform"
        >
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.99 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background:
                "linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 55%, rgba(245, 184, 143, 0.05) 100%)",
              boxShadow:
                "inset 0 1px 0 0 rgba(255, 255, 255, 0.38), 0 28px 72px -12px rgba(0, 0, 0, 0.8)",
            }}
            className="mx-auto w-full max-w-4xl rounded-[28px] border border-white/20 px-6 py-10 will-change-transform sm:px-12 sm:py-14"
          >
            <span className="glass-pill inline-block rounded-full px-3.5 py-1 font-mono text-[10px] tracking-[0.24em] text-[#f5b88f] uppercase">
              {activeMeta.chapter}
            </span>

            <p
              style={{ fontSize: "clamp(1.85rem, 6vw, 5.2rem)" }}
              className="mt-4 font-display leading-[1.04] font-bold tracking-[-0.045em] text-white"
            >
              <span>{activeMeta.titleBefore}</span>
              <em className="font-serif font-normal italic text-[#f5b88f] pr-1.5">
                {activeMeta.titleAccent}
              </em>
            </p>

            <p className="mt-3 inline-grid items-center justify-center font-mono text-xs text-white/80 sm:text-sm">
              <span
                aria-hidden="true"
                className="invisible col-start-1 row-start-1 select-none"
              >
                {activeMeta.sub}
              </span>
              <span className="col-start-1 row-start-1 inline-flex items-center justify-center">
                <span>{subSlice.locked}</span>
                <span className="text-[#f5b88f]">{subSlice.scrambled}</span>
                <span
                  aria-hidden="true"
                  className="ml-1 inline-block h-[0.85em] w-[2px] rounded-full bg-[#f5b88f]"
                />
              </span>
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
