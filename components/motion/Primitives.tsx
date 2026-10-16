"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/hooks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const SIYA_EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

export function HeartSvg({
  className = "w-4 h-4",
  filled = true,
}: {
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? "0" : "1.8"}
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

export function SparkleOrnamentSvg({
  className = "w-3.5 h-3.5",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M12 1L14.6 9.4L23 12L14.6 14.6L12 23L9.4 14.6L1 12L9.4 9.4L12 1Z" />
    </svg>
  );
}

export function LiveClock({
  timezone = "Asia/Kolkata",
  className = "",
}: {
  timezone?: string;
  className?: string;
}) {
  const [timeStr, setTimeStr] = useState<string>("pune · ist");

  useEffect(() => {
    const updateClock = () => {
      try {
        const formatted = new Intl.DateTimeFormat("en-IN", {
          timeZone: timezone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
          .format(new Date())
          .toLowerCase();
        setTimeStr(`${formatted} ist`);
      } catch {
        setTimeStr("ist local");
      }
    };

    updateClock();
    const timer = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(timer);
  }, [timezone]);

  return (
    <span className={`font-mono tabular-nums ${className}`}>{timeStr}</span>
  );
}

export function MaskedHeadline({
  before,
  accent,
  after = "",
  as: Tag = "h2",
  className = "",
  accentClassName = "text-marigold",
  delay = 0,
}: {
  before: string;
  accent: string;
  after?: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  accentClassName?: string;
  delay?: number;
}) {
  const containerRef = useRef<HTMLElement | null>(null);
  const innerRef = useRef<HTMLSpanElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || !containerRef.current || !innerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        innerRef.current,
        {
          yPercent: 108,
          rotateZ: 1.5,
          opacity: 0,
        },
        {
          yPercent: 0,
          rotateZ: 0,
          opacity: 1,
          duration: 1.1,
          delay,
          ease: "power4.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [delay, reducedMotion]);

  return (
    <Tag
      ref={containerRef as React.RefObject<HTMLHeadingElement>}
      className={`overflow-hidden pb-1 leading-[0.96] tracking-[-0.04em] lowercase ${className}`}
    >
      <span ref={innerRef} className="block will-change-transform">
        <span>{before}</span>
        <em
          className={`font-serif italic font-normal tracking-[-0.01em] px-[0.06em] ${accentClassName}`}
        >
          {accent}
        </em>
        {after ? <span>{after}</span> : null}
      </span>
    </Tag>
  );
}

export function MagneticButton({
  children,
  onClick,
  href,
  cursorLabel = "go",
  variant = "marigold",
  className = "",
  type = "button",
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  cursorLabel?: string;
  variant?: "marigold" | "cranberry" | "cream" | "espresso" | "ghost";
  className?: string;
  type?: "button" | "submit";
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    gsap.to(ref.current, {
      x: x * 0.24,
      y: y * 0.28,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  const handleMouseLeave = () => {
    if (reducedMotion || !ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.65,
      ease: "elastic.out(1, 0.4)",
    });
  };

  const variantClasses: Record<typeof variant, string> = {
    marigold:
      "bg-marigold text-espresso border border-marigold/40 hover:text-cream",
    cranberry:
      "bg-cranberry text-cream border border-cranberry/50 hover:text-espresso",
    cream:
      "bg-cream text-espresso border border-cream/40 hover:text-cream",
    espresso:
      "bg-espresso text-cream border border-cream/20 hover:border-marigold/60 hover:text-espresso",
    ghost:
      "bg-cream/10 text-cream border border-cream/20 backdrop-blur-md hover:border-marigold/60 hover:text-espresso",
  };

  const sweepClasses: Record<typeof variant, string> = {
    marigold: "bg-cranberry",
    cranberry: "bg-marigold",
    cream: "bg-cranberry",
    espresso: "bg-marigold",
    ghost: "bg-marigold",
  };

  const sharedClassName = `group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full px-6 py-3.5 text-sm font-medium lowercase tracking-[-0.01em] transition-colors duration-500 ${variantClasses[variant]} ${className}`;

  const innerContent = (
    <>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 translate-y-[102%] rounded-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0 ${sweepClasses[variant]}`}
      />
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        data-cursor={cursorLabel}
        aria-label={ariaLabel}
        className={sharedClassName}
      >
        {innerContent}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor={cursorLabel}
      aria-label={ariaLabel}
      className={sharedClassName}
    >
      {innerContent}
    </button>
  );
}
