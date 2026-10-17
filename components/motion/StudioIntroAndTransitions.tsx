"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";

const INTRO_TARGET_TEXT = "@HEARTSFROMSIYA";
const INTRO_SUB_TEXT = "Warm stories people actually finish.";

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
 * 100% GPU-Composited (translate3d / scaleX / opacity) kinetic typing intro
 * ("@HEARTSFROMSIYA") followed by a hardware-accelerated shutter lift into Home.
 */
export function IntroTypingPreloader({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const [typedCount, setTypedCount] = useState(0);
  const [subTypedCount, setSubTypedCount] = useState(0);
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

    const totalChars = INTRO_TARGET_TEXT.length;
    const stepMs = 36;
    let current = 0;

    const interval = window.setInterval(() => {
      current += 1;
      setTypedCount(current);
      setSubTypedCount(
        Math.min(
          INTRO_SUB_TEXT.length,
          Math.round((current / totalChars) * INTRO_SUB_TEXT.length)
        )
      );
      if (current >= totalChars) {
        window.clearInterval(interval);
        setSubTypedCount(INTRO_SUB_TEXT.length);
        setPhase("hold");
      }
    }, stepMs);

    return () => window.clearInterval(interval);
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
    }, 280);
    return () => window.clearTimeout(holdTimer);
  }, [onComplete, phase]);

  const progressRatio = Math.min(1, typedCount / INTRO_TARGET_TEXT.length);
  const progressPct = Math.round(progressRatio * 100);
  const typedSlice = INTRO_TARGET_TEXT.slice(0, typedCount);
  const subSlice = INTRO_SUB_TEXT.slice(0, subTypedCount);

  return (
    <AnimatePresence>
      {phase !== "done" ? (
        <motion.div
          key="studio-intro-preloader"
          initial={{ y: "0%" }}
          exit={{
            y: "-102%",
            transition: {
              duration: 0.64,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
          onClick={() => {
            setPhase("done");
            onComplete?.();
          }}
          style={{
            background:
              "radial-gradient(circle at 50% 42%, rgba(74, 18, 38, 0.92) 0%, rgba(12, 8, 11, 0.99) 62%, #070608 100%)",
            transform: "translate3d(0,0,0)",
            backfaceVisibility: "hidden",
          }}
          className="fixed inset-0 z-[200] flex flex-col justify-between overflow-hidden border-b border-white/15 px-6 py-8 text-[#FAF6F2] shadow-[0_30px_90px_rgba(0,0,0,0.95)] will-change-transform select-none sm:px-12 sm:py-10"
        >
          {/* Top Studio Bar */}
          <div className="flex items-center justify-between text-xs text-white/60">
            <span className="font-mono text-[10px] tracking-[0.24em] uppercase">
              Siya Pawar · Portfolio
            </span>
            <span className="font-mono text-[11px] tabular-nums text-[#f5b88f]">
              {String(progressPct).padStart(3, "0")}%
            </span>
          </div>

          {/* Center Monumental Footer-Style Glass Typing Card */}
          <div className="my-auto mx-auto w-full max-w-[1280px]">
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.99 }}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background:
                  "linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.025) 55%, rgba(245, 184, 143, 0.04) 100%)",
                boxShadow:
                  "inset 0 1px 0 0 rgba(255, 255, 255, 0.34), 0 28px 72px -12px rgba(0, 0, 0, 0.78)",
              }}
              className="relative overflow-hidden rounded-[28px] border border-white/15 px-5 py-12 text-center will-change-transform sm:px-10 sm:py-16"
            >
              {/* Subtle GPU Specular Light Sweep When Typing Finishes */}
              <motion.div
                aria-hidden="true"
                initial={{ x: "-110%" }}
                animate={{
                  x: phase === "hold" ? "110%" : "-110%",
                }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(245, 184, 143, 0.18) 50%, transparent 100%)",
                }}
                className="pointer-events-none absolute inset-0 will-change-transform"
              />

              <span className="block font-mono text-[10px] tracking-[0.24em] text-white/50 uppercase sm:tracking-[0.28em]">
                Siya Pawar · Pune, India · 10M+ Monthly Views
              </span>

              {/* Monumental Typed Wordmark (Zero Layout Shift via Invisible Sizer) */}
              <div
                style={{ fontSize: "clamp(1.25rem, 6.2vw, 7.2rem)" }}
                className="mt-4 inline-grid items-center justify-center font-display leading-[1.02] font-bold tracking-[-0.045em] text-white"
              >
                <span
                  aria-hidden="true"
                  className="invisible col-start-1 row-start-1 select-none"
                >
                  {INTRO_TARGET_TEXT}
                </span>
                <span className="col-start-1 row-start-1 inline-flex items-center justify-center">
                  <span>{typedSlice}</span>
                  <span
                    aria-hidden="true"
                    className={`ml-1 inline-block h-[0.82em] w-[3px] rounded-full bg-[#f5b88f] sm:w-[5px] ${
                      phase === "hold" ? "animate-pulse" : ""
                    }`}
                  />
                </span>
              </div>

              {/* Editorial Subtitle Typing Reveal */}
              <p className="mt-5 font-serif text-lg italic text-[#f5b88f] sm:text-2xl">
                <span className="inline-grid items-center justify-center">
                  <span
                    aria-hidden="true"
                    className="invisible col-start-1 row-start-1 select-none"
                  >
                    {INTRO_SUB_TEXT}
                  </span>
                  <span className="col-start-1 row-start-1 inline-flex items-center justify-center">
                    <span>{subSlice}</span>
                  </span>
                </span>
              </p>

              {/* GPU-Composited Progress Hairline (scaleX instead of width) */}
              <div className="mx-auto mt-8 h-[2px] w-full max-w-xs overflow-hidden rounded-full bg-white/10">
                <div
                  style={{
                    transform: `scaleX(${progressRatio})`,
                    transformOrigin: "0% 50%",
                  }}
                  className="h-full w-full bg-gradient-to-r from-[#f5b88f] to-[#ff8a70] transition-transform duration-75 ease-out will-change-transform"
                />
              </div>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <div className="flex items-center justify-between text-[11px] text-white/45">
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
 * 100% GPU-Composited (translate3d + scale3d + opacity) shutter transition
 * with live kinetic typing whenever the user navigates between sections or pages.
 */
export function SectionNavigationCurtain({
  activeMeta,
}: {
  activeMeta: NavTransitionMeta | null;
}) {
  const [typedSubCount, setTypedSubCount] = useState(0);

  useEffect(() => {
    if (!activeMeta) {
      document.documentElement.removeAttribute("data-overlay-active");
      return;
    }
    document.documentElement.setAttribute("data-overlay-active", "true");
    const targetLen = activeMeta.sub.length;
    setTypedSubCount(4);
    let current = 4;
    const step = Math.max(2, Math.ceil(targetLen / 12));
    const timer = window.setInterval(() => {
      current += step;
      if (current >= targetLen) {
        setTypedSubCount(targetLen);
        window.clearInterval(timer);
      } else {
        setTypedSubCount(current);
      }
    }, 18);

    return () => {
      window.clearInterval(timer);
      document.documentElement.removeAttribute("data-overlay-active");
    };
  }, [activeMeta]);

  return (
    <AnimatePresence>
      {activeMeta ? (
        <motion.div
          key={activeMeta.chapter}
          aria-hidden="true"
          initial={{ y: "100%" }}
          animate={{
            y: "0%",
            transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
          }}
          exit={{
            y: "-102%",
            transition: { duration: 0.36, ease: [0.76, 0, 0.24, 1] },
          }}
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(70, 17, 37, 0.96) 0%, rgba(8, 6, 9, 0.99) 72%)",
            transform: "translate3d(0,0,0)",
            backfaceVisibility: "hidden",
          }}
          className="pointer-events-none fixed inset-0 z-[180] flex flex-col items-center justify-center border-y border-white/15 px-6 text-center text-[#FAF6F2] shadow-[0_0_90px_rgba(0,0,0,0.95)] will-change-transform"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.99 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background:
                "linear-gradient(145deg, rgba(255, 255, 255, 0.085) 0%, rgba(255, 255, 255, 0.025) 55%, rgba(245, 184, 143, 0.04) 100%)",
              boxShadow:
                "inset 0 1px 0 0 rgba(255, 255, 255, 0.34), 0 28px 72px -12px rgba(0, 0, 0, 0.8)",
            }}
            className="mx-auto w-full max-w-4xl rounded-[28px] border border-white/15 px-6 py-10 will-change-transform sm:px-12 sm:py-14"
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

            <p className="mt-3 inline-grid items-center justify-center font-mono text-xs text-white/75 sm:text-sm">
              <span
                aria-hidden="true"
                className="invisible col-start-1 row-start-1 select-none"
              >
                {activeMeta.sub}
              </span>
              <span className="col-start-1 row-start-1 inline-flex items-center justify-center">
                <span>{activeMeta.sub.slice(0, typedSubCount)}</span>
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
