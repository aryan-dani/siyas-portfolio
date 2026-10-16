"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/hooks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const UPPER_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const LOWER_GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Kinetic Glyph Scrambler
 * Uses an inline-grid sizer so the bounding box width never jitters during scramble,
 * keeping magnetic cursor locks 100% steady.
 */
export function ScrambleText({
  text,
  as: Tag = "span",
  className = "",
  scrambleOnHover = true,
  scrambleOnMount = true,
  durationMs = 420,
}: {
  text: string;
  as?: "span" | "p" | "div" | "h3" | "h4";
  className?: string;
  scrambleOnHover?: boolean;
  scrambleOnMount?: boolean;
  durationMs?: number;
}) {
  const [display, setDisplay] = useState<string>(text);
  const elRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number>(0);
  const reducedMotion = usePrefersReducedMotion();

  const triggerScramble = useCallback(() => {
    if (reducedMotion) {
      setDisplay(text);
      return;
    }
    cancelAnimationFrame(rafRef.current);
    const start = performance.now();
    const len = text.length;

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / durationMs);
      const revealedCount = Math.floor(progress * len);

      let out = "";
      for (let i = 0; i < len; i++) {
        const ch = text[i];
        if (
          ch === " " ||
          ch === "·" ||
          ch === "—" ||
          ch === "↗" ||
          ch === "→" ||
          ch === "↓" ||
          ch === "↑" ||
          ch === "@" ||
          ch === "|"
        ) {
          out += ch;
        } else if (i < revealedCount || progress >= 1) {
          out += ch;
        } else {
          const isUpper = ch >= "A" && ch <= "Z";
          const pool = isUpper ? UPPER_GLYPHS : LOWER_GLYPHS;
          const randIdx = Math.floor((now * 0.14 + i * 11) % pool.length);
          out += pool[randIdx];
        }
      }

      setDisplay(out);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplay(text);
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [durationMs, reducedMotion, text]);

  useEffect(() => {
    setDisplay(text);
  }, [text]);

  useEffect(() => {
    if (!scrambleOnMount || reducedMotion || !elRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: elRef.current,
        start: "top 92%",
        once: true,
        onEnter: () => triggerScramble(),
      });
    }, elRef);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ctx.revert();
    };
  }, [reducedMotion, scrambleOnMount, triggerScramble]);

  return (
    <Tag
      ref={
        elRef as React.RefObject<
          HTMLSpanElement &
            HTMLParagraphElement &
            HTMLDivElement &
            HTMLHeadingElement
        >
      }
      onMouseEnter={scrambleOnHover ? triggerScramble : undefined}
      className={`inline-grid text-left ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none invisible col-start-1 row-start-1 select-none"
      >
        {text}
      </span>
      <span className="col-start-1 row-start-1">{display}</span>
    </Tag>
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
          "linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.03) 100%)",
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
 * - Damped 3D perspective spring tilt
 */
export function RefractivePlate({
  children,
  className = "",
  maxTilt = 3.2,
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
  const reducedMotion = usePrefersReducedMotion();

  const handlePointerMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = plateRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const nx = x / Math.max(1, rect.width) - 0.5;
      const ny = y / Math.max(1, rect.height) - 0.5;

      if (glareRef.current) {
        glareRef.current.style.background = `radial-gradient(480px circle at ${x}px ${y}px, rgba(255, 240, 235, 0.16), rgba(255, 138, 112, 0.06) 38%, transparent 72%)`;
        glareRef.current.style.opacity = "1";
      }

      if (!reducedMotion && maxTilt > 0) {
        gsap.to(el, {
          rotateY: nx * maxTilt * 2,
          rotateX: -ny * maxTilt * 2,
          y: -3,
          duration: 0.55,
          ease: "power3.out",
          transformPerspective: 1100,
          overwrite: "auto",
        });
      }
    },
    [maxTilt, reducedMotion]
  );

  const handlePointerLeave = useCallback(() => {
    const el = plateRef.current;
    if (glareRef.current) {
      glareRef.current.style.opacity = "0";
    }
    if (el && !reducedMotion) {
      gsap.to(el, {
        rotateY: 0,
        rotateX: 0,
        y: 0,
        duration: 0.75,
        ease: "expo.out",
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
      onMouseEnter={onMouseEnter}
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
 * Soft, slow-drifting crimson and rosewood light spheres behind the page so frosted
 * glass surfaces (`backdrop-filter: blur(28px)`) refract rich studio light.
 */
export function AmbientGlassBacklight() {
  const orbPrimaryRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || !orbPrimaryRef.current) return;

    const xTo = gsap.quickTo(orbPrimaryRef.current, "x", {
      duration: 1.8,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(orbPrimaryRef.current, "y", {
      duration: 1.8,
      ease: "power3.out",
    });

    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 140;
      const ny = (e.clientY / window.innerHeight - 0.5) * 140;
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
      <div
        ref={orbPrimaryRef}
        style={{
          width: "540px",
          height: "540px",
          background:
            "radial-gradient(circle, rgba(225, 29, 72, 0.14) 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
        className="absolute top-1/5 left-1/5 rounded-full will-change-transform"
      />
      <div
        style={{
          width: "580px",
          height: "580px",
          background:
            "radial-gradient(circle, rgba(255, 138, 112, 0.1) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
        className="absolute right-1/6 bottom-1/6 rounded-full"
      />
    </div>
  );
}
