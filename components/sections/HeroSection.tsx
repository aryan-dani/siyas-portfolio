"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CONTENT } from "@/lib/content";
import {
  RefractivePlate,
  ScrambleText,
} from "@/components/motion/IglooMotionPrimitives";
import { useSmoothScroll } from "@/components/motion/SmoothScrollProvider";
import { usePrefersReducedMotion } from "@/lib/hooks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function HeroSection({
  onRequestMediaKit,
}: {
  onRequestMediaKit: (packageName?: string) => void;
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
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.fromTo(
        titleRef.current,
        { y: 26, opacity: 0, filter: "blur(6px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2 },
        0.06
      )
        .fromTo(
          portraitRef.current,
          { y: 36, scale: 0.95, opacity: 0, filter: "blur(10px)" },
          { y: 0, scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.35 },
          0.14
        )
        .fromTo(
          bottomRef.current,
          { y: 22, opacity: 0, filter: "blur(6px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.1 },
          0.22
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !glowRef.current) return;

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
      className="relative flex min-h-[100svh] w-full flex-col justify-between overflow-hidden bg-transparent px-7 pt-8 pb-8 text-white sm:px-12 sm:pt-10 sm:pb-10"
    >
      {/* Soft Cursor-Tracked Studio Aura Behind the Frosted Glass Portrait */}
      <div
        ref={glowRef}
        aria-hidden="true"
        style={{
          width: "460px",
          height: "460px",
          background:
            "radial-gradient(circle, rgba(255, 92, 122, 0.34) 0%, transparent 70%)",
          filter: "blur(85px)",
        }}
        className="pointer-events-none absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
      />

      {/* Top Row: Monumental Left Wordmark + Right 2-Line Editorial Tagline */}
      <div
        ref={titleRef}
        className="relative z-20 flex items-start justify-between gap-6 will-change-transform"
      >
        <div>
          <h1
            style={{ fontSize: "clamp(4.6rem, 10.5vw, 9.2rem)" }}
            className="font-display leading-[0.86] font-bold tracking-[-0.055em] text-white select-none"
          >
            Siya<span className="text-[#ff6b81]">.</span>
          </h1>

          <div className="mt-3.5 flex flex-wrap items-center gap-2.5 font-sans text-xs font-medium text-white/85 sm:text-sm">
            <span>Creator</span>
            <span className="text-white/30">·</span>
            <span>Storyteller</span>
            <span className="text-white/30">·</span>
            <a
              href={CONTENT.profile.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-box
              className="glass-pill rounded-full px-3.5 py-1 text-white transition-colors hover:text-[#ff8a70]"
            >
              <ScrambleText
                text={CONTENT.profile.handle}
                scrambleOnMount={true}
                scrambleOnHover={true}
              />
            </a>
          </div>
        </div>

        <div className="hidden pt-3 text-right font-display text-xl leading-[1.08] font-medium tracking-[-0.03em] text-white/90 sm:block sm:text-2xl">
          <p>Stories,</p>
          <p className="font-serif font-normal italic text-[#ff9e88]">
            finished.
          </p>
        </div>
      </div>

      {/* Centerpiece Portrait in Double-Bezel Refractive Frosted Glass Frame */}
      <div
        ref={portraitRef}
        className="relative z-10 my-auto flex flex-col items-center justify-center py-6 will-change-transform"
      >
        <RefractivePlate maxTilt={4.2} className="glass-portrait-bezel p-3">
          <div
            style={{
              width: "clamp(275px, 25vw, 375px)",
              height: "clamp(275px, 25vw, 375px)",
            }}
            className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#12070B]"
          >
            <Image
              src="/siya/siya-portrait.jpg"
              alt="Siya Pawar (@heartsfromsiya)"
              fill
              priority
              unoptimized
              sizes="380px"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover/plate:scale-105"
            />

            {/* Floating Smoked-Glass Badge Inside Portrait Frame */}
            <div className="glass-dock absolute inset-x-3.5 bottom-3.5 z-20 flex items-center justify-between px-4 py-2.5 text-xs text-white">
              <a
                href={CONTENT.profile.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans font-medium text-white/95 transition-colors hover:text-[#ff8a70]"
              >
                {CONTENT.profile.handle}
              </a>
              <span className="font-serif italic text-[#ff9e88]">
                10M+ monthly views
              </span>
            </div>
          </div>
        </RefractivePlate>
      </div>

      {/* Bottom Row: Left 2-Line Editorial Hook + Right Time Capsule & Dual Action Pills */}
      <div
        ref={bottomRef}
        className="relative z-20 flex flex-wrap items-end justify-between gap-6 will-change-transform"
      >
        <p className="font-display text-2xl leading-[1.08] font-medium tracking-[-0.03em] text-white sm:text-3xl">
          Warm stories
          <br />
          people{" "}
          <em className="font-serif font-normal italic text-[#ff9e88]">
            actually
          </em>{" "}
          finish.
        </p>

        <div className="flex flex-col items-end gap-3 text-right">
          <div className="glass-pill rounded-2xl px-4 py-2 font-sans text-[11px] leading-snug text-white/85">
            <p className="text-[10px] text-white/50">Local time</p>
            <p className="font-medium">{localTime} · Pune, India</p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2.5">
            <button
              type="button"
              data-cursor-box
              onClick={() => scrollTo("#services")}
              className="glass-pill rounded-full px-5 py-2.5 font-sans text-xs font-medium text-white/90 transition-colors hover:text-white"
            >
              <ScrambleText
                text="View Pricing ↓"
                scrambleOnMount={false}
                scrambleOnHover={true}
                durationMs={280}
              />
            </button>

            <button
              type="button"
              data-cursor-box
              onClick={() => onRequestMediaKit("single-reel")}
              className="rounded-full bg-white px-6 py-2.5 font-sans text-xs font-semibold text-[#080708] shadow-xl transition-all duration-300 hover:scale-105 hover:bg-[#ff8a70]"
            >
              <ScrambleText
                text="Collaborate →"
                scrambleOnMount={false}
                scrambleOnHover={true}
                durationMs={300}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
