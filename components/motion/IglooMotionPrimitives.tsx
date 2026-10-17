"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/hooks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LOWER_GLYPHS = "abcdefghijklmnopqrstuvwxyz";
const UPPER_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGIT_GLYPHS = "0123456789";

function scrambleCharCaseAware(ch: string, seed: number): string {
  if (ch >= "a" && ch <= "z") {
    return LOWER_GLYPHS[seed % LOWER_GLYPHS.length];
  }
  if (ch >= "A" && ch <= "Z") {
    return UPPER_GLYPHS[seed % UPPER_GLYPHS.length];
  }
  if (ch >= "0" && ch <= "9") {
    return DIGIT_GLYPHS[seed % DIGIT_GLYPHS.length];
  }
  return ch;
}

/**
 * KineticTypewriter / ScrambleText — Zero-Reflow Case-Aware Scramble + Typewriter Reveal
 * - Reserves exact final bounding box via an invisible sizer span (`CLS = 0`, zero magnetic cursor jitter)
 * - Progressively locks real characters from left to right while softly scrambling the 2-character
 *   leading frontier with matching case (`a-z`, `A-Z`, `0-9`) alongside a glowing `#f5b88f` cursor bar.
 * - Strictly time-bounded (`performance.now()` + hard failsafe timeout) so it never loops infinitely.
 */
export function KineticTypewriter({
  text,
  as: Tag = "span",
  className = "",
  speedMs = 36,
  startDelayMs = 0,
  replayOnHover = false,
  showCursorWhenDone = false,
}: {
  text: string;
  as?: "span" | "p" | "div" | "h3" | "h4";
  className?: string;
  speedMs?: number;
  startDelayMs?: number;
  replayOnHover?: boolean;
  showCursorWhenDone?: boolean;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLElement | null>(null);
  const [displayText, setDisplayText] = useState<string>(text);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const hasTriggeredRef = useRef<boolean>(false);
  const lastRunTimeRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const delayTimerRef = useRef<number | null>(null);
  const failsafeTimerRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (delayTimerRef.current !== null) {
      window.clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }
    if (failsafeTimerRef.current !== null) {
      window.clearTimeout(failsafeTimerRef.current);
      failsafeTimerRef.current = null;
    }
  }, []);

  const runScrambleTyping = useCallback(
    (delay = 0) => {
      if (reducedMotion || !text) {
        setDisplayText(text);
        setIsTyping(false);
        return;
      }
      const now = performance.now();
      if (now - lastRunTimeRef.current < 1600) return;
      lastRunTimeRef.current = now;

      clearTimers();

      // Slow, poised, editorial cadence (680ms - 1150ms)
      const totalDuration = Math.min(
        1150,
        Math.max(680, text.length * Math.max(32, speedMs))
      );

      const startAnimation = () => {
        setIsTyping(true);
        const startTime = performance.now();
        let lastScrambleTick = 0;
        let cachedScramble = "";

        // Hard failsafe so text is 100% guaranteed to settle to `text`
        failsafeTimerRef.current = window.setTimeout(() => {
          clearTimers();
          setDisplayText(text);
          setIsTyping(false);
        }, totalDuration + 100);

        const step = (timestamp: number) => {
          const elapsed = timestamp - startTime;
          const progress = Math.min(1, elapsed / totalDuration);

          if (progress >= 1) {
            clearTimers();
            setDisplayText(text);
            setIsTyping(false);
            return;
          }

          const lockedCount = Math.floor(progress * text.length);
          const frontierLen = Math.min(2, text.length - lockedCount);

          if (timestamp - lastScrambleTick > 52 || !cachedScramble) {
            lastScrambleTick = timestamp;
            let scramblePart = "";
            const tick = Math.floor(timestamp / 52);
            for (let i = 0; i < frontierLen; i++) {
              const targetChar = text[lockedCount + i];
              scramblePart += scrambleCharCaseAware(
                targetChar,
                tick + i * 5 + lockedCount * 3
              );
            }
            cachedScramble = scramblePart;
          }

          setDisplayText(text.slice(0, lockedCount) + cachedScramble);
          rafRef.current = window.requestAnimationFrame(step);
        };

        rafRef.current = window.requestAnimationFrame(step);
      };

      if (delay > 0) {
        delayTimerRef.current = window.setTimeout(startAnimation, delay);
      } else {
        startAnimation();
      }
    },
    [clearTimers, reducedMotion, speedMs, text]
  );

  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;
    const el = containerRef.current;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          io.disconnect();
          runScrambleTyping(startDelayMs);
        }
      },
      { threshold: 0.35 }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      clearTimers();
    };
  }, [clearTimers, reducedMotion, runScrambleTyping, startDelayMs]);

  return (
    <Tag
      ref={containerRef as React.RefObject<never>}
      onMouseEnter={replayOnHover ? () => runScrambleTyping(0) : undefined}
      className={`relative inline-grid items-center ${className}`}
    >
      {/* Invisible sizer locks exact width & height so layout never shifts */}
      <span
        aria-hidden="true"
        className="invisible col-start-1 row-start-1 select-none"
      >
        {text}
      </span>
      <span className="col-start-1 row-start-1 inline-flex items-center">
        <span>{displayText}</span>
        <span
          aria-hidden="true"
          className={`ml-0.5 inline-block h-[0.85em] w-[2px] shrink-0 rounded-full bg-[#f5b88f] transition-opacity duration-200 ${
            isTyping
              ? "opacity-100"
              : showCursorWhenDone
                ? "opacity-75"
                : "opacity-0"
          }`}
        />
      </span>
    </Tag>
  );
}

export function ScrambleText({
  text,
  as = "span",
  className = "",
  scrambleOnHover = true,
}: {
  text: string;
  as?: "span" | "p" | "div" | "h3" | "h4";
  className?: string;
  scrambleOnHover?: boolean;
  scrambleOnMount?: boolean;
  durationMs?: number;
}) {
  return (
    <KineticTypewriter
      text={text}
      as={as}
      className={className}
      replayOnHover={scrambleOnHover}
    />
  );
}

/**
 * Scroll-Revealed Specular Glass Hairline
 */
export function AnimatedHairline({
  className = "",
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  const lineRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || !lineRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0, opacity: 0.25, transformOrigin: "0% 50%" },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1.35,
          delay,
          ease: "expo.out",
          scrollTrigger: {
            trigger: lineRef.current,
            start: "top 94%",
            once: true,
          },
        }
      );
    }, lineRef);

    return () => ctx.revert();
  }, [delay, reducedMotion]);

  return (
    <div
      ref={lineRef}
      aria-hidden="true"
      style={{
        height: "1px",
        background:
          "linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(245,208,175,0.28) 35%, rgba(255,255,255,0.32) 50%, rgba(242,128,148,0.28) 65%, rgba(255,255,255,0.02) 100%)",
      }}
      className={`w-full will-change-transform ${className}`}
    />
  );
}

/**
 * Scroll-Velocity Vertical Float Layer (Rectilinear, zero skew distortion)
 */
export function VelocitySkewLayer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  return <div className={className}>{children}</div>;
}

/**
 * Interactive Luxury Glassmorphism Vessel (RefractivePlate)
 * Features:
 * - Cursor-tracking radial specular sheen & rim illumination
 * - Damped 3D perspective spring tilt on desktop pointers (disabled on touch devices for crisp scrolling)
 */
export function RefractivePlate({
  children,
  className = "",
  maxTilt = 2.8,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  children: React.ReactNode;
  className?: string;
  frameCode?: string;
  maxTilt?: number;
  enableHud?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const plateRef = useRef<HTMLDivElement | null>(null);
  const glareRef = useRef<HTMLDivElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const handlePointerEnter = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      window.innerWidth >= 1024 &&
      plateRef.current
    ) {
      rectRef.current = plateRef.current.getBoundingClientRect();
    }
    onMouseEnter?.();
  }, [onMouseEnter]);

  const handlePointerMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (typeof window !== "undefined" && window.innerWidth < 1024) return;
      const el = plateRef.current;
      if (!el) return;

      const rect = rectRef.current || el.getBoundingClientRect();
      rectRef.current = rect;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const nx = x / Math.max(1, rect.width) - 0.5;
      const ny = y / Math.max(1, rect.height) - 0.5;

      if (glareRef.current) {
        glareRef.current.style.background = `radial-gradient(480px circle at ${Math.round(
          x
        )}px ${Math.round(
          y
        )}px, rgba(255, 246, 238, 0.15), rgba(245, 200, 166, 0.07) 36%, rgba(242, 128, 148, 0.04) 55%, transparent 74%)`;
        glareRef.current.style.opacity = "1";
      }

      if (!reducedMotion && maxTilt > 0) {
        gsap.to(el, {
          rotateY: nx * maxTilt * 1.6,
          rotateX: -ny * maxTilt * 1.6,
          y: -2,
          duration: 0.42,
          ease: "power3.out",
          transformPerspective: 1200,
          overwrite: "auto",
        });
      }
    },
    [maxTilt, reducedMotion]
  );

  const handlePointerLeave = useCallback(() => {
    rectRef.current = null;
    const el = plateRef.current;
    if (glareRef.current) {
      glareRef.current.style.opacity = "0";
    }
    if (el && !reducedMotion) {
      gsap.to(el, {
        rotateY: 0,
        rotateX: 0,
        y: 0,
        duration: 0.65,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
    onMouseLeave?.();
  }, [onMouseLeave, reducedMotion]);

  return (
    <div
      ref={plateRef}
      onClick={onClick}
      onMouseMove={handlePointerMove}
      onMouseEnter={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
      className={`group/plate relative will-change-transform ${className}`}
    >
      {/* Interactive Cursor-Following Specular Glass Sheen */}
      <div
        ref={glareRef}
        aria-hidden="true"
        style={{ borderRadius: "inherit" }}
        className="pointer-events-none absolute inset-0 z-30 opacity-0 transition-opacity duration-500"
      />

      {children}
    </div>
  );
}

/**
 * Ambient Glass Backlight Field
 * High-contrast localized champagne gold, soft blush rose, and velvet plum spheres
 * that drift behind the page so frosted glass surfaces (`backdrop-filter: blur(36px)`)
 * visibly refract defined light edges against the deep obsidian canvas.
 */
export function AmbientGlassBacklight() {
  const orbPrimaryRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (
      reducedMotion ||
      !orbPrimaryRef.current ||
      (typeof window !== "undefined" && window.innerWidth < 768)
    ) {
      return;
    }

    const xTo = gsap.quickTo(orbPrimaryRef.current, "x", {
      duration: 2.0,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(orbPrimaryRef.current, "y", {
      duration: 2.0,
      ease: "power3.out",
    });

    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 160;
      const ny = (e.clientY / window.innerHeight - 0.5) * 160;
      xTo(nx);
      yTo(ny);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Warm Champagne-Peach Refractive Lobe (Zero runtime blur filter overhead) */}
      <div
        ref={orbPrimaryRef}
        style={{
          width: "680px",
          height: "680px",
          background:
            "radial-gradient(circle, rgba(245, 200, 160, 0.13) 0%, rgba(232, 122, 144, 0.06) 36%, rgba(232, 122, 144, 0.02) 56%, transparent 72%)",
        }}
        className="absolute top-[8%] left-[12%] rounded-full will-change-transform"
      />
      {/* Soft Rose-Plum Refractive Lobe */}
      <div
        style={{
          width: "720px",
          height: "720px",
          background:
            "radial-gradient(circle, rgba(212, 82, 118, 0.12) 0%, rgba(110, 32, 68, 0.06) 38%, rgba(110, 32, 68, 0.02) 58%, transparent 72%)",
        }}
        className="absolute right-[6%] bottom-[8%] rounded-full"
      />
    </div>
  );
}
