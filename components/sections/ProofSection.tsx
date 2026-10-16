"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CONTENT } from "@/lib/content";
import { usePrefersReducedMotion } from "@/lib/hooks";
import {
  AnimatedHairline,
  RefractivePlate,
  ScrambleText,
} from "@/components/motion/IglooMotionPrimitives";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MINIMAL_STATS = [
  {
    value: "10M",
    label: "Peak monthly views",
  },
  {
    value: "1.8M+",
    label: "Views on viral reels",
  },
  {
    value: "319K",
    label: "Likes on a single reel",
  },
  {
    value: "9K+",
    label: "Community on Instagram",
  },
];

export function ProofSection({
  onRequestMediaKit,
}: {
  onRequestMediaKit: () => void;
}) {
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(
    CONTENT.proof.brands[0]?.id ?? null
  );
  const sectionRef = useRef<HTMLElement | null>(null);
  const statBarRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (statBarRef.current) {
        gsap.fromTo(
          statBarRef.current,
          { y: 36, opacity: 0, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "expo.out",
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
          { y: 32, opacity: 0, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.15,
            ease: "expo.out",
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
      className="relative overflow-hidden bg-transparent py-28 text-[#FAF5F0] md:py-36"
    >
      <div className="mx-auto max-w-[1380px] px-7 sm:px-12 lg:px-16">
        {/* 4-Column Frosted Glass Bento Stat Bar */}
        <div ref={statBarRef} className="will-change-transform">
          <RefractivePlate maxTilt={1.8} className="glass-card overflow-hidden p-2">
            <div
              onMouseLeave={() => setHoveredStat(null)}
              className="grid grid-cols-2 divide-y divide-white/10 lg:grid-cols-4 lg:divide-y-0 lg:divide-x"
            >
              {MINIMAL_STATS.map((stat, idx) => {
                const isHovered = hoveredStat === idx;
                return (
                  <div
                    key={stat.label}
                    onMouseEnter={() => setHoveredStat(idx)}
                    className="relative px-7 py-9 sm:px-9"
                  >
                    {isHovered ? (
                      <motion.div
                        layoutId="statGlassHover"
                        transition={{
                          type: "spring",
                          stiffness: 320,
                          damping: 30,
                        }}
                        className="glass-pill pointer-events-none absolute inset-1.5 rounded-2xl"
                      />
                    ) : null}

                    <div className="relative z-10">
                      <p className="font-display text-[clamp(2.8rem,4.8vw,4.4rem)] leading-none font-semibold tracking-[-0.045em] text-white tabular-nums">
                        {stat.value}
                      </p>
                      <p className="mt-3 font-sans text-xs text-white/60">
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
        <div className="mt-28 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <span className="glass-pill inline-flex items-center gap-2 rounded-full px-3.5 py-1 font-mono text-[11px] text-white/75">
              (01) · Audience &amp; Proof
            </span>
            <h2
              ref={headlineRef}
              className="mt-4 font-display text-[clamp(2.2rem,4vw,3.6rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-white will-change-transform"
            >
              Trusted by consumer{" "}
              <em className="font-serif font-normal italic text-[#ff8a70]">
                brands
              </em>
              .
            </h2>
            <p className="mt-4 max-w-sm font-sans text-sm leading-relaxed text-white/60">
              No studio stiffness or teleprompter scripts—just natural hooks and
              pacing built for how people actually scroll on{" "}
              <a
                href={CONTENT.profile.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline decoration-white/25 underline-offset-4 hover:text-[#ff8a70]"
              >
                {CONTENT.profile.handle}
              </a>
              .
            </p>

            <div className="mt-8">
              <button
                type="button"
                data-cursor-box
                onClick={onRequestMediaKit}
                className="glass-pill inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-medium text-white hover:bg-white hover:text-[#080708]"
              >
                <ScrambleText
                  text="Request Media Kit →"
                  scrambleOnMount={false}
                  scrambleOnHover={true}
                  durationMs={320}
                />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <RefractivePlate maxTilt={2.2} className="glass-card p-3 sm:p-4">
              <div className="divide-y divide-white/10">
                {CONTENT.proof.brands.map((brand) => {
                  const isActive = hoveredBrand === brand.id;
                  return (
                    <div
                      key={brand.id}
                      onMouseEnter={() => setHoveredBrand(brand.id)}
                      className="group relative flex flex-col justify-between gap-4 px-5 py-7 sm:flex-row sm:items-baseline sm:px-7"
                    >
                      {isActive ? (
                        <motion.div
                          layoutId="brandRowGlass"
                          transition={{
                            type: "spring",
                            stiffness: 320,
                            damping: 30,
                          }}
                          className="glass-pill pointer-events-none absolute inset-1.5 rounded-2xl"
                        />
                      ) : null}

                      <div className="relative z-10 sm:w-44 shrink-0">
                        <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-white transition-colors group-hover:text-[#ff8a70]">
                          <ScrambleText
                            text={brand.name}
                            scrambleOnMount={false}
                            scrambleOnHover={true}
                            durationMs={320}
                          />
                        </h3>
                        <p className="mt-0.5 text-xs text-white/45">
                          {brand.category}
                        </p>
                      </div>

                      <p className="relative z-10 flex-1 font-sans text-sm leading-relaxed text-white/75">
                        {brand.highlightQuote}
                      </p>

                      <span className="glass-pill relative z-10 shrink-0 rounded-full px-3 py-1 font-serif text-sm italic text-[#ff9e88]">
                        {brand.deliverableType}
                      </span>
                    </div>
                  );
                })}
              </div>
            </RefractivePlate>
          </div>
        </div>

        <div className="mt-28">
          <AnimatedHairline />
        </div>
      </div>
    </section>
  );
}
