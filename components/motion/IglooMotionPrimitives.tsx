"use client";

import React, { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/hooks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Clean Editorial Text Primitive
 * Renders crisp, un-glitched typography with zero alphanumeric cipher scrambling,
 * ensuring 100% legibility at all times and steady bounding boxes for magnetic cursor locks.
 */
export function ScrambleText({
  text,
  as: Tag = "span",
  className = "",
}: {
  text: string;
  as?: "span" | "p" | "div" | "h3" | "h4";
  className?: string;
  scrambleOnHover?: boolean;
  scrambleOnMount?: boolean;
  durationMs?: number;
}) {
  return <Tag className={`inline-block ${className}`}>{text}</Tag>;
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
      {/* Warm Champagne-Peach Refractive Lobe */}
      <div
        ref={orbPrimaryRef}
        style={{
          width: "520px",
          height: "520px",
          background:
            "radial-gradient(circle, rgba(245, 200, 160, 0.14) 0%, rgba(232, 122, 144, 0.06) 45%, transparent 72%)",
          filter: "blur(75px)",
        }}
        className="absolute top-[12%] left-[16%] rounded-full will-change-transform"
      />
      {/* Soft Rose-Plum Refractive Lobe */}
      <div
        style={{
          width: "560px",
          height: "560px",
          background:
            "radial-gradient(circle, rgba(212, 82, 118, 0.13) 0%, rgba(110, 32, 68, 0.06) 48%, transparent 72%)",
          filter: "blur(85px)",
        }}
        className="absolute right-[10%] bottom-[12%] rounded-full"
      />
    </div>
  );
}
