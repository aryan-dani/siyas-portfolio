"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";

const INTRO_SANS_PART = "hearts from";
const INTRO_SERIF_PART = "siya.";
const INTRO_FULL_LENGTH = INTRO_SANS_PART.length + INTRO_SERIF_PART.length;

const LOWER_GLYPHS = "abcdefghijklmnopqrstuvwxyz";
const UPPER_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGIT_GLYPHS = "0123456789";

function scrambleCharForTarget(targetChar: string, seed: number): string {
  if (targetChar >= "a" && targetChar <= "z") {
    return LOWER_GLYPHS[seed % LOWER_GLYPHS.length];
  }
  if (targetChar >= "A" && targetChar <= "Z") {
    return UPPER_GLYPHS[seed % UPPER_GLYPHS.length];
  }
  if (targetChar >= "0" && targetChar <= "9") {
    return DIGIT_GLYPHS[seed % DIGIT_GLYPHS.length];
  }
  return targetChar;
}

function buildCaseAwareScramble(
  target: string,
  progress: number,
  tick: number,
  frontierSize = 2
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
    scrambled += scrambleCharForTarget(ch, tick + i * 5 + lockedCount * 3);
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
    sub: "Creator & Storyteller · Pune, India",
  },
  "#work": {
    chapter: "01 · SELECTED REELS",
    titleBefore: "SELECTED ",
    titleAccent: "REELS.",
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
 * Slow, deliberate, frosted-glass background blur (`backdrop-filter: blur(48px) saturate(170%)`)
 * over the live Hero stage. Plays once per session so it never repeats on back-navigation.
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
    let alreadySeen = false;
    try {
      alreadySeen = window.sessionStorage.getItem("siya_intro_seen") === "1";
    } catch {
      // Ignore storage restrictions
    }

    if (reducedMotion || hasHashTarget || alreadySeen) {
      setPhase("done");
      onComplete?.();
      return;
    }

    // Slow, luxurious, deliberate pacing (1500ms typing + 520ms hold)
    const durationMs = 1500;
    const startTime = performance.now();
    let rafId = 0;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const rawP = Math.min(1, elapsed / durationMs);
      // Smooth cubic ease-in-out curve so typing feels organic and unhurried
      const easedP =
        rawP < 0.5
          ? 2 * rawP * rawP
          : 1 - Math.pow(-2 * rawP + 2, 2) / 2;

      setProgress(easedP);
      setTick(Math.floor(elapsed / 55));

      if (rawP < 1) {
        rafId = window.requestAnimationFrame(step);
      } else {
        setProgress(1);
        setPhase("hold");
      }
    };

    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [onComplete, reducedMotion]);

  const finishIntro = React.useCallback(() => {
    try {
      window.sessionStorage.setItem("siya_intro_seen", "1");
    } catch {
      // Ignore storage restrictions
    }
    setPhase("done");
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    if (phase === "done") return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        finishIntro();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [finishIntro, phase]);

  useEffect(() => {
    if (phase !== "hold") return;
    const holdTimer = window.setTimeout(() => {
      finishIntro();
    }, 520);
    return () => window.clearTimeout(holdTimer);
  }, [finishIntro, phase]);

  const progressPct = Math.round(progress * 100);

  // Split progress across "hearts from" (11 chars) and "siya." (5 chars)
  const sansProgress = Math.min(
    1,
    (progress * INTRO_FULL_LENGTH) / INTRO_SANS_PART.length
  );
  const serifProgress = Math.max(
    0,
    Math.min(
      1,
      (progress * INTRO_FULL_LENGTH - INTRO_SANS_PART.length) /
        INTRO_SERIF_PART.length
    )
  );

  const sansSlice = buildCaseAwareScramble(
    INTRO_SANS_PART,
    sansProgress,
    tick,
    1
  );
  const serifSlice = buildCaseAwareScramble(
    INTRO_SERIF_PART,
    serifProgress,
    tick,
    1
  );

  return (
    <AnimatePresence>
      {phase !== "done" ? (
        <motion.div
          key="studio-intro-preloader"
          initial={{ y: "0%", opacity: 1 }}
          exit={{
            y: "-102%",
            opacity: 0.96,
            transition: {
              duration: 0.86,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
          onClick={finishIntro}
          style={{
            background:
              "radial-gradient(circle at 50% 45%, rgba(82, 20, 44, 0.52) 0%, rgba(12, 8, 12, 0.68) 62%, rgba(7, 6, 8, 0.8) 100%)",
            backdropFilter: "blur(48px) saturate(170%)",
            WebkitBackdropFilter: "blur(48px) saturate(170%)",
            transform: "translate3d(0,0,0)",
            backfaceVisibility: "hidden",
          }}
          className="fixed inset-0 z-[200] flex flex-col justify-between overflow-hidden border-b border-white/20 px-6 py-8 text-[#FAF6F2] shadow-[0_30px_90px_rgba(0,0,0,0.9)] will-change-transform select-none sm:px-12 sm:py-10"
        >
          {/* Top Minimal Telemetry Bar */}
          <div className="flex items-center justify-between text-xs text-white/70">
            <span className="glass-pill rounded-full px-3.5 py-1 font-mono text-[10px] tracking-[0.22em] text-white/80 uppercase">
              Pune, India · Portfolio
            </span>
            <span className="glass-pill rounded-full px-3.5 py-1 font-mono text-[11px] tabular-nums text-[#f5b88f]">
              {String(progressPct).padStart(3, "0")}%
            </span>
          </div>

          {/* Center Monumental Frosted Glass Card — Properly Stacked Flex Column */}
          <div className="my-auto mx-auto w-full max-w-[1160px]">
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -22, scale: 0.99 }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background:
                  "linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 55%, rgba(245, 184, 143, 0.05) 100%)",
                boxShadow:
                  "inset 0 1px 0 0 rgba(255, 255, 255, 0.38), 0 32px 84px -12px rgba(0, 0, 0, 0.8)",
              }}
              className="relative flex flex-col items-center justify-center overflow-hidden rounded-[32px] border border-white/20 px-6 py-14 text-center will-change-transform sm:px-14 sm:py-20"
            >
              {/* Specular Light Sweep When Typing Finishes */}
              <motion.div
                aria-hidden="true"
                initial={{ x: "-110%" }}
                animate={{
                  x: phase === "hold" ? "110%" : "-110%",
                }}
                transition={{ duration: 0.65, ease: "easeOut" }}
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(245, 184, 143, 0.2) 50%, transparent 100%)",
                }}
                className="pointer-events-none absolute inset-0 will-change-transform"
              />

              <span className="font-mono text-[10px] tracking-[0.28em] text-white/55 uppercase sm:text-[11px]">
                Siya Pawar · 10M+ Monthly Views
              </span>

              {/* Monumental "hearts from siya." Wordmark with Proper Word Spacing & Case-Aware Serif Decode */}
              <div
                style={{ fontSize: "clamp(2.1rem, 7.2vw, 7.2rem)" }}
                className="mt-5 inline-grid items-center justify-items-center leading-[1.04] tracking-[-0.045em] text-white"
              >
                <span
                  aria-hidden="true"
                  className="invisible col-start-1 row-start-1 inline-flex items-baseline select-none px-3"
                >
                  <span className="font-display font-bold">
                    {INTRO_SANS_PART}
                  </span>
                  <em className="ml-[0.26em] font-serif font-normal italic">
                    {INTRO_SERIF_PART}
                  </em>
                </span>

                <span className="col-start-1 row-start-1 inline-flex items-baseline justify-center">
                  <span className="font-display font-bold">
                    {sansSlice.locked}
                    <span className="text-white/60">{sansSlice.scrambled}</span>
                  </span>
                  {serifProgress > 0 ? (
                    <em className="ml-[0.26em] font-serif font-normal italic text-[#f5b88f] pr-1">
                      {serifSlice.locked}
                      <span className="text-[#f5b88f]/65">
                        {serifSlice.scrambled}
                      </span>
                    </em>
                  ) : null}
                  <span
                    aria-hidden="true"
                    className={`ml-1.5 inline-block h-[0.76em] w-[3px] self-center rounded-full bg-[#f5b88f] shadow-[0_0_14px_rgba(245,184,143,0.95)] sm:w-[4px] ${
                      phase === "hold" ? "animate-pulse" : ""
                    }`}
                  />
                </span>
              </div>

              {/* GPU-Composited Progress Hairline */}
              <div className="mt-10 h-[2px] w-full max-w-[240px] overflow-hidden rounded-full bg-white/15">
                <div
                  style={{
                    transform: `scaleX(${progress})`,
                    transformOrigin: "0% 50%",
                  }}
                  className="h-full w-full bg-gradient-to-r from-[#f5b88f] via-[#ff9a85] to-[#f5b88f] transition-transform duration-100 ease-out will-change-transform"
                />
              </div>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <div className="flex items-center justify-between text-[11px] text-white/55">
            <span>Creator · Storyteller · Brand Collaborations</span>
            <span className="font-mono text-[10px] tracking-wider uppercase">
              Click or press Esc to skip
            </span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/**
 * SectionNavigationCurtain
 * Smooth, poised frosted-glass blurred GPU shutter transition
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
    const duration = 360;
    let rafId = 0;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const p = Math.min(1, elapsed / duration);
      setProgress(p);
      setTick(Math.floor(elapsed / 45));
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
    ? buildCaseAwareScramble(activeMeta.sub, progress, tick, 2)
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
            transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
          }}
          exit={{
            y: "-102%",
            transition: { duration: 0.48, ease: [0.76, 0, 0.24, 1] },
          }}
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(74, 18, 38, 0.62) 0%, rgba(9, 6, 10, 0.8) 72%)",
            backdropFilter: "blur(42px) saturate(165%)",
            WebkitBackdropFilter: "blur(42px) saturate(165%)",
            transform: "translate3d(0,0,0)",
            backfaceVisibility: "hidden",
          }}
          className="pointer-events-none fixed inset-0 z-[180] flex flex-col items-center justify-center border-y border-white/20 px-6 text-center text-[#FAF6F2] shadow-[0_0_90px_rgba(0,0,0,0.9)] will-change-transform"
        >
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.99 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background:
                "linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 55%, rgba(245, 184, 143, 0.05) 100%)",
              boxShadow:
                "inset 0 1px 0 0 rgba(255, 255, 255, 0.38), 0 28px 72px -12px rgba(0, 0, 0, 0.8)",
            }}
            className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center rounded-[28px] border border-white/20 px-6 py-10 will-change-transform sm:px-12 sm:py-14"
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
                <span className="text-[#f5b88f]/75">{subSlice.scrambled}</span>
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
