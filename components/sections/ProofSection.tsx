"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CONTENT } from "@/lib/content";
import { usePrefersReducedMotion } from "@/lib/hooks";
import {
  AnimatedHairline,
  KineticTypewriter,
  RefractivePlate,
} from "@/components/motion/IglooMotionPrimitives";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MINIMAL_STATS = [
  {
    value: "10M",
    numericEnd: 10,
    decimals: 0,
    suffix: "M",
    label: "Peak monthly views",
  },
  {
    value: "1.8M+",
    numericEnd: 1.8,
    decimals: 1,
    suffix: "M+",
    label: "Views on viral reels",
  },
  {
    value: "319K",
    numericEnd: 319,
    decimals: 0,
    suffix: "K",
    label: "Likes on a single reel",
  },
  {
    value: "9K+",
    numericEnd: 9,
    decimals: 0,
    suffix: "K+",
    label: "Community on Instagram",
  },
];

function AnimatedStatValue({
  numericEnd,
  decimals,
  suffix,
  fallback,
  active,
  reducedMotion,
}: {
  numericEnd: number;
  decimals: number;
  suffix: string;
  fallback: string;
  active: boolean;
  reducedMotion: boolean;
}) {
  const [display, setDisplay] = useState(fallback);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(fallback);
      return;
    }
    if (!active || hasAnimatedRef.current) return;

    hasAnimatedRef.current = true;
    let rafId = 0;
    const duration = 1150;
    const start = performance.now();

    const step = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      // Expo-out easing
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const current = numericEnd * eased;
      const formatted =
        decimals > 0 ? current.toFixed(decimals) : String(Math.round(current));
      setDisplay(`${formatted}${suffix}`);
      if (t < 1) {
        rafId = window.requestAnimationFrame(step);
      } else {
        setDisplay(fallback);
      }
    };

    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [active, decimals, fallback, numericEnd, reducedMotion, suffix]);

  return <>{display}</>;
}

export function ProofSection({
  onRequestMediaKit,
}: {
  onRequestMediaKit: () => void;
}) {
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const [statsInView, setStatsInView] = useState(false);
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(
    CONTENT.proof.brands[0]?.id ?? null
  );
  const sectionRef = useRef<HTMLElement | null>(null);
  const statBarRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!statBarRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStatsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(statBarRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (statBarRef.current) {
        gsap.fromTo(
          statBarRef.current,
          { y: 26, opacity: 0, scale: 0.985 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.95,
            ease: "power3.out",
            scrollTrigger: {
              trigger: statBarRef.current,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.95,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headlineRef.current,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="proof"
      ref={sectionRef}
      aria-label="Reach and Brand Collaborations"
      className="relative overflow-hidden bg-transparent py-20 text-[#FAF6F2] sm:py-28 md:py-36"
    >
      <div className="mx-auto max-w-[1380px] px-5 sm:px-10 lg:px-16">
        {/* 4-Column Frosted Glass Bento Stat Bar */}
        <div ref={statBarRef} className="will-change-transform">
          <RefractivePlate maxTilt={0} className="glass-card overflow-hidden p-2">
            <div
              onMouseLeave={() => setHoveredStat(null)}
              className="grid grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-white/10"
            >
              {MINIMAL_STATS.map((stat, idx) => {
                const isHovered = hoveredStat === idx;
                return (
                  <div
                    key={stat.label}
                    onMouseEnter={() => setHoveredStat(idx)}
                    className={`relative px-4 py-6 sm:px-9 sm:py-9 ${
                      idx >= 2 ? "border-t border-white/10 lg:border-t-0" : ""
                    } ${idx % 2 === 1 ? "border-l border-white/10 lg:border-l-0" : ""}`}
                  >
                    <div
                      aria-hidden="true"
                      className={`glass-pill pointer-events-none absolute inset-1.5 rounded-2xl transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isHovered ? "opacity-100" : "opacity-0"
                      }`}
                    />

                    <div className="relative z-10">
                      <p
                        style={{ fontSize: "clamp(1.95rem, 4.6vw, 4.3rem)" }}
                        className="font-display leading-[1.06] font-semibold tracking-[-0.045em] text-white tabular-nums"
                      >
                        <AnimatedStatValue
                          numericEnd={stat.numericEnd}
                          decimals={stat.decimals}
                          suffix={stat.suffix}
                          fallback={stat.value}
                          active={statsInView}
                          reducedMotion={reducedMotion}
                        />
                      </p>
                      <p className="mt-2 font-sans text-xs text-white/65">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </RefractivePlate>
        </div>

        {/* Editorial Split + Interactive Frosted Glass Brand Partnerships */}
        <div className="mt-20 grid grid-cols-1 gap-10 sm:mt-24 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="lg:col-span-5">
            <span className="glass-pill inline-flex items-center gap-2 rounded-full px-3.5 py-1 font-mono text-[11px] text-white/80">
              <KineticTypewriter text="(02) · Audience & Proof" speedMs={24} />
            </span>
            <h2
              ref={headlineRef}
              className="mt-4 font-display text-[clamp(2.15rem,4vw,3.6rem)] leading-[1.06] font-semibold tracking-[-0.04em] text-white will-change-transform"
            >
              Trusted by consumer{" "}
              <em className="font-serif font-normal italic text-[#f5b88f] pr-1.5">
                brands
              </em>
              .
            </h2>
            <p className="mt-4 max-w-md font-sans text-sm leading-relaxed text-white/65">
              No studio stiffness or teleprompter scripts—just natural hooks and
              pacing built for how people actually scroll on{" "}
              <a
                href={CONTENT.profile.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline decoration-white/30 underline-offset-4 hover:text-[#f5b88f]"
              >
                {CONTENT.profile.handle}
              </a>
              .
            </p>

            <div className="mt-7">
              <button
                type="button"
                data-cursor-box
                onClick={onRequestMediaKit}
                className="glass-pill inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-medium text-white transition-all hover:bg-white hover:text-[#080708]"
              >
                Request Media Kit →
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <RefractivePlate maxTilt={0} className="glass-card p-2.5 sm:p-4">
              <div className="divide-y divide-white/10">
                {CONTENT.proof.brands.map((brand) => {
                  const isActive = hoveredBrand === brand.id;
                  return (
                    <div
                      key={brand.id}
                      onMouseEnter={() => setHoveredBrand(brand.id)}
                      className="group relative flex flex-col justify-between gap-3.5 px-4 py-6 sm:flex-row sm:items-baseline sm:gap-5 sm:px-7 sm:py-7"
                    >
                      <div
                        aria-hidden="true"
                        className={`glass-pill pointer-events-none absolute inset-1.5 rounded-2xl transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isActive ? "opacity-100" : "opacity-0"
                        }`}
                      />

                      <div className="relative z-10 shrink-0 sm:w-44">
                        <h3
                          className={`font-display text-xl font-semibold tracking-[-0.02em] transition-colors duration-300 ${
                            isActive ? "text-[#f5b88f]" : "text-white"
                          }`}
                        >
                          {brand.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-white/50">
                          {brand.category}
                        </p>
                      </div>

                      <p className="relative z-10 flex-1 font-sans text-sm leading-relaxed text-white/80">
                        {brand.highlightQuote}
                      </p>

                      <span className="glass-pill relative z-10 w-fit shrink-0 rounded-full px-3 py-1 font-serif text-sm italic text-[#f5b88f]">
                        <KineticTypewriter
                          text={brand.deliverableType}
                          speedMs={26}
                        />
                      </span>
                    </div>
                  );
                })}
              </div>
            </RefractivePlate>
          </div>
        </div>

        <div className="mt-20 sm:mt-28">
          <AnimatedHairline />
        </div>
      </div>
    </section>
  );
}
