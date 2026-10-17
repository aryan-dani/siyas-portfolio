"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";

const INTRO_TARGET_TEXT = "@HEARTSFROMSIYA";

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
};

/**
 * IntroTypingPreloader
 * Monumental footer-inspired kinetic typing intro ("@HEARTSFROMSIYA")
 * followed by a multi-bezel glass curtain reveal into the Home Hero.
 */
export function IntroTypingPreloader({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const [typedCount, setTypedCount] = useState(0);
  const [phase, setPhase] = useState<"typing" | "hold" | "done">("typing");

  useEffect(() => {
    const hasHashTarget =
      typeof window !== "undefined" && window.location.hash.length > 1;
    if (reducedMotion || hasHashTarget) {
      setPhase("done");
      onComplete?.();
      return;
    }

    const totalChars = INTRO_TARGET_TEXT.length;
    const stepMs = 52;
    let current = 0;

    const interval = window.setInterval(() => {
      current += 1;
      setTypedCount(current);
      if (current >= totalChars) {
        window.clearInterval(interval);
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
    }, 460);
    return () => window.clearTimeout(holdTimer);
  }, [onComplete, phase]);

  const progressPct = Math.min(
    100,
    Math.round((typedCount / INTRO_TARGET_TEXT.length) * 100)
  );
  const typedSlice = INTRO_TARGET_TEXT.slice(0, typedCount);

  return (
    <AnimatePresence>
      {phase !== "done" ? (
        <motion.div
          key="studio-intro-preloader"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{
            clipPath: "inset(0% 0% 100% 0%)",
            transition: {
              duration: 0.82,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
          onClick={() => {
            setPhase("done");
            onComplete?.();
          }}
          style={{
            background:
              "radial-gradient(circle at 50% 45%, rgba(68, 16, 36, 0.58) 0%, rgba(12, 8, 11, 0.96) 62%, #070608 100%)",
            backdropFilter: "blur(40px) saturate(185%)",
            WebkitBackdropFilter: "blur(40px) saturate(185%)",
          }}
          className="fixed inset-0 z-[200] flex flex-col justify-between overflow-hidden px-6 py-8 text-[#FAF6F2] select-none sm:px-12 sm:py-10"
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
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -28, scale: 1.03 }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card relative overflow-hidden px-5 py-12 text-center sm:px-10 sm:py-16"
            >
              {/* Subtle Specular Light Sweep When Typing Finishes */}
              <motion.div
                aria-hidden="true"
                initial={{ x: "-120%" }}
                animate={{
                  x: phase === "hold" ? "120%" : "-120%",
                }}
                transition={{ duration: 0.65, ease: "easeInOut" }}
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(245, 184, 143, 0.16) 50%, transparent 100%)",
                }}
                className="pointer-events-none absolute inset-0"
              />

              <span className="block font-mono text-[10px] tracking-[0.24em] text-white/50 uppercase sm:tracking-[0.28em]">
                Siya Pawar · Pune, India · 10M+ Monthly Views
              </span>

              {/* Monumental Typed Wordmark */}
              <div
                style={{ fontSize: "clamp(1.25rem, 6.2vw, 7.2rem)" }}
                className="mt-4 flex items-center justify-center font-display leading-[1.02] font-bold tracking-[-0.045em] text-white"
              >
                <span>{typedSlice}</span>
                <span
                  aria-hidden="true"
                  className={`ml-1 inline-block h-[0.82em] w-[3px] rounded-full bg-[#f5b88f] sm:w-[5px] ${
                    phase === "hold" ? "animate-pulse" : ""
                  }`}
                />
              </div>

              {/* Editorial Subtitle Reveal */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{
                  opacity: typedCount >= 3 ? 1 : 0,
                  y: typedCount >= 3 ? 0 : 8,
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="mt-5 font-serif text-lg italic text-[#f5b88f] sm:text-2xl"
              >
                Warm stories people actually finish.
              </motion.p>

              {/* Bottom Progress Hairline Inside Card */}
              <div className="mx-auto mt-8 h-[2px] w-full max-w-xs overflow-hidden rounded-full bg-white/10">
                <div
                  style={{ width: `${progressPct}%` }}
                  className="h-full bg-gradient-to-r from-[#f5b88f] to-[#ff8a70] transition-[width] duration-75 ease-out"
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
 * Full-screen smoked-glass interstitial with monumental kinetic typography
 * whenever the user navigates between sections.
 */
export function SectionNavigationCurtain({
  activeMeta,
}: {
  activeMeta: NavTransitionMeta | null;
}) {
  return (
    <AnimatePresence>
      {activeMeta ? (
        <motion.div
          key={activeMeta.chapter}
          aria-hidden="true"
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          animate={{
            clipPath: "inset(0% 0% 0% 0%)",
            transition: { duration: 0.38, ease: [0.76, 0, 0.24, 1] },
          }}
          exit={{
            clipPath: "inset(0% 0% 100% 0%)",
            transition: { duration: 0.46, ease: [0.76, 0, 0.24, 1] },
          }}
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(62, 15, 34, 0.82) 0%, rgba(9, 6, 9, 0.96) 70%)",
            backdropFilter: "blur(36px) saturate(185%)",
            WebkitBackdropFilter: "blur(36px) saturate(185%)",
          }}
          className="pointer-events-none fixed inset-0 z-[180] flex flex-col items-center justify-center px-6 text-center text-[#FAF6F2]"
        >
          <motion.div
            initial={{ opacity: 0, y: 22, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -22, scale: 1.02 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card mx-auto w-full max-w-4xl px-6 py-10 sm:px-12 sm:py-14"
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

            <p className="mt-3 font-sans text-xs text-white/65 sm:text-sm">
              {activeMeta.sub}
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
