"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CONTENT } from "@/lib/content";
import { RefractivePlate } from "@/components/motion/IglooMotionPrimitives";
import { useSmoothScroll } from "@/components/motion/SmoothScrollProvider";
import { usePrefersReducedMotion } from "@/lib/hooks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function HeroSection({
  onRequestMediaKit,
  onNavigateSection,
}: {
  onRequestMediaKit: (packageName?: string) => void;
  onNavigateSection?: (href: string) => void;
}) {
  const [localTime, setLocalTime] = useState<string>("10:15 PM");
  const sectionRef = useRef<HTMLElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const portraitRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { scrollTo } = useSmoothScroll();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const updateClock = () => {
      try {
        const formatted = new Intl.DateTimeFormat("en-US", {
          timeZone: CONTENT.profile.timezone,
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).format(new Date());
        setLocalTime(formatted);
      } catch {
        setLocalTime("10:15 PM");
      }
    };
    updateClock();
    const timer = window.setInterval(updateClock, 10000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        titleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.95 },
        0.02
      )
        .fromTo(
          portraitRef.current,
          { y: 26, scale: 0.965, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 1.1 },
          0.08
        )
        .fromTo(
          bottomRef.current,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9 },
          0.14
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  useEffect(() => {
    if (
      reducedMotion ||
      !glowRef.current ||
      (typeof window !== "undefined" && window.innerWidth < 768)
    ) {
      return;
    }

    const xTo = gsap.quickTo(glowRef.current, "x", {
      duration: 1.4,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(glowRef.current, "y", {
      duration: 1.4,
      ease: "power3.out",
    });

    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 90;
      const ny = (e.clientY / window.innerHeight - 0.5) * 90;
      xTo(nx);
      yTo(ny);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reducedMotion]);

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-label="Siya Pawar Introduction"
      className="relative flex min-h-[100svh] w-full flex-col justify-between overflow-hidden bg-transparent px-5 pt-20 pb-8 text-[#FAF6F2] sm:px-10 sm:pt-12 sm:pb-10 lg:px-14"
    >
      {/* Soft Cursor-Tracked Studio Champagne-Rose Aura Behind the Frosted Glass Portrait */}
      <div
        ref={glowRef}
        aria-hidden="true"
        style={{
          width: "480px",
          height: "480px",
          background:
            "radial-gradient(circle, rgba(245, 184, 143, 0.22) 0%, rgba(212, 72, 108, 0.18) 45%, transparent 72%)",
          filter: "blur(80px)",
        }}
        className="pointer-events-none absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
      />

      {/* Top Row: Monumental Left Wordmark + Right 2-Line Editorial Tagline */}
      <div
        ref={titleRef}
        className="relative z-20 flex items-start justify-between gap-4 will-change-transform"
      >
        <div>
          <h1
            style={{ fontSize: "clamp(3.6rem, 10.2vw, 9.2rem)" }}
            className="pb-1 font-display leading-[0.94] font-bold tracking-[-0.055em] text-white select-none"
          >
            Siya<span className="text-[#f5b88f]">.</span>
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-2 font-sans text-xs font-medium text-white/85 sm:gap-2.5 sm:text-sm">
            <span>Creator</span>
            <span className="text-white/30">·</span>
            <span>Storyteller</span>
            <span className="text-white/30">·</span>
            <a
              href={CONTENT.profile.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-box
              className="glass-pill rounded-full px-3.5 py-1 text-white transition-colors hover:text-[#f5b88f]"
            >
              {CONTENT.profile.handle}
            </a>
          </div>
        </div>

        <div className="pt-1 text-right font-display text-lg leading-[1.12] font-medium tracking-[-0.03em] text-white/90 sm:pt-3 sm:text-2xl">
          <p>Stories,</p>
          <p className="font-serif font-normal italic text-[#f5b88f] pr-1">
            finished.
          </p>
        </div>
      </div>

      {/* Centerpiece Portrait in Double-Bezel Refractive Frosted Glass Frame */}
      <div
        ref={portraitRef}
        className="relative z-10 my-auto flex flex-col items-center justify-center py-6 will-change-transform"
      >
        <RefractivePlate maxTilt={3.2} className="glass-portrait-bezel p-2.5 sm:p-3">
          <div
            style={{
              width: "clamp(250px, 66vw, 375px)",
              height: "clamp(250px, 66vw, 375px)",
            }}
            className="relative overflow-hidden rounded-[24px] border border-white/15 bg-[#10090D] sm:!h-[clamp(285px,26vw,375px)] sm:!w-[clamp(285px,26vw,375px)]"
          >
            <Image
              src="/siya/siya-portrait.jpg"
              alt="Siya Pawar (@heartsfromsiya)"
              fill
              priority
              sizes="(max-width: 640px) 290px, 380px"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover/plate:scale-105"
            />

            {/* Floating Smoked-Glass Badge Inside Portrait Frame */}
            <div className="glass-dock absolute inset-x-3 bottom-3 z-20 flex items-center justify-between px-3.5 py-2.5 text-xs text-white sm:inset-x-3.5 sm:bottom-3.5 sm:px-4">
              <a
                href={CONTENT.profile.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans font-medium text-white/95 transition-colors hover:text-[#f5b88f]"
              >
                {CONTENT.profile.handle}
              </a>
              <span className="font-serif italic text-[#f5b88f] pr-1">
                10M+ monthly views
              </span>
            </div>
          </div>
        </RefractivePlate>
      </div>

      {/* Bottom Row: Left 2-Line Editorial Hook + Right Time Capsule & Dual Action Pills */}
      <div
        ref={bottomRef}
        className="relative z-20 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end sm:gap-6 will-change-transform"
      >
        <p className="font-display text-2xl leading-[1.12] font-medium tracking-[-0.03em] text-white sm:text-3xl">
          Warm stories
          <br />
          people{" "}
          <em className="font-serif font-normal italic text-[#f5b88f] pr-1.5">
            actually
          </em>{" "}
          finish.
        </p>

        <div className="flex w-full flex-col items-start gap-3 sm:w-auto sm:items-end sm:text-right">
          <div className="glass-pill hidden rounded-2xl px-4 py-2 font-sans text-[11px] leading-snug text-white/85 sm:block">
            <p className="text-[10px] text-white/50">Local time</p>
            <p className="font-medium">{localTime} · Pune, India</p>
          </div>

          <div className="flex w-full flex-wrap items-center gap-2.5 sm:w-auto sm:justify-end">
            <button
              type="button"
              data-cursor-box
              onClick={() =>
                onNavigateSection
                  ? onNavigateSection("#services")
                  : scrollTo("#services")
              }
              className="glass-pill flex-1 rounded-full px-5 py-2.5 text-center font-sans text-xs font-medium text-white/90 transition-colors hover:text-white sm:flex-initial"
            >
              View Pricing ↓
            </button>

            <button
              type="button"
              data-cursor-box
              onClick={() => onRequestMediaKit("single-reel")}
              className="flex-1 rounded-full bg-white px-6 py-2.5 text-center font-sans text-xs font-semibold text-[#080708] shadow-xl transition-all duration-300 hover:scale-105 hover:bg-[#f5b88f] sm:flex-initial"
            >
              Collaborate →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
