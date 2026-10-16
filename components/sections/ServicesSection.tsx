"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CONTENT } from "@/lib/content";
import {
  RefractivePlate,
  ScrambleText,
} from "@/components/motion/IglooMotionPrimitives";
import { usePrefersReducedMotion } from "@/lib/hooks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const REEL_COUNTS = [1, 2, 3, 4, 5, 8];

export function ServicesSection({
  onSelectService,
}: {
  onSelectService: (packageName: string, customNote?: string) => void;
}) {
  const [calcMode, setCalcMode] = useState<"reels" | "monthly">("reels");
  const [reelCount, setReelCount] = useState<number>(2);
  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current || !headlineRef.current) return;

    const ctx = gsap.context(() => {
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

      const validCards = cardsRef.current.filter(Boolean);
      if (validCards.length > 0) {
        gsap.fromTo(
          validCards,
          { y: 40, opacity: 0, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.15,
            stagger: 0.12,
            ease: "expo.out",
            scrollTrigger: {
              trigger: validCards[0],
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const estimatedReelTotal = (reelCount * 3000).toLocaleString("en-IN");

  const handleCalculatorBook = () => {
    if (calcMode === "monthly") {
      onSelectService(
        "account-management",
        "Interested in the ₹24,000/month Account Management retainer (adjustable according to our exact deliverable requirements)."
      );
    } else if (reelCount === 1) {
      onSelectService(
        "single-reel",
        "Interested in booking 1 Video / Reel at ₹3,000."
      );
    } else {
      onSelectService(
        "multi-reel-campaign",
        `Interested in a ${reelCount}-Reel campaign bundle (${reelCount} × ₹3,000 = ₹${estimatedReelTotal}).`
      );
    }
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      aria-label="Transparent Rates and Ways to Collaborate"
      className="relative overflow-hidden bg-transparent py-28 text-[#FAF5F0] md:py-36"
    >
      <div className="mx-auto max-w-[1380px] px-7 sm:px-12 lg:px-16">
        <div className="flex flex-col justify-between gap-6 pb-16 lg:flex-row lg:items-end">
          <div>
            <span className="glass-pill inline-flex items-center gap-2 rounded-full px-3.5 py-1 font-mono text-[11px] text-white/75">
              (03) · Transparent Creator Rates
            </span>
            <h2
              ref={headlineRef}
              className="mt-4 font-display text-[clamp(2.4rem,4.5vw,4rem)] leading-[1.0] font-semibold tracking-[-0.04em] text-white will-change-transform"
            >
              Ways to{" "}
              <em className="font-serif font-normal italic text-[#ff8a70]">
                collaborate
              </em>
              .
            </h2>
          </div>

          <p className="max-w-md font-sans text-sm leading-relaxed text-white/65">
            {CONTENT.services.subcopy}
          </p>
        </div>

        {/* 3 Refractive Frosted Glass Collaboration Monoliths with Direct Numbers */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {CONTENT.services.items.map((service, idx) => {
            const isHighlighted = idx === 1;
            return (
              <div
                key={service.id}
                ref={(el) => {
                  cardsRef.current[idx] = el;
                }}
                className="will-change-transform"
              >
                <RefractivePlate
                  maxTilt={3.2}
                  className={`glass-card flex h-full flex-col justify-between p-8 sm:p-10 ${
                    isHighlighted ? "ring-1 ring-[#ff8a70]/35" : ""
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="glass-pill rounded-full px-3 py-1 font-mono text-[11px] text-white/75">
                        {service.index}
                      </span>
                      <span className="glass-pill rounded-full px-3.5 py-1 font-sans text-[11px] font-medium text-[#ff9e88]">
                        {service.rateNote}
                      </span>
                    </div>

                    <h3 className="mt-7 font-display text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                      <span>{service.titleBefore}</span>
                      <em className="font-serif font-normal italic text-[#ff8a70]">
                        {service.titleAccent}
                      </em>
                    </h3>

                    {/* Prominent Crystal Price Display */}
                    <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-baseline gap-2.5">
                        <span className="font-display text-4xl font-bold tracking-[-0.04em] text-white sm:text-5xl">
                          {service.priceDisplay}
                        </span>
                        <span className="font-sans text-xs font-medium text-white/65">
                          {service.priceSub}
                        </span>
                      </div>
                    </div>

                    <p className="mt-4 font-sans text-sm leading-relaxed text-white/65">
                      {service.hoverSerifCaption}
                    </p>

                    <ul className="mt-7 space-y-3 border-t border-white/10 pt-6">
                      {service.deliverables.map((item, dIdx) => {
                        const hasHandle = item.includes("@heartsfromsiya");
                        return (
                          <li
                            key={dIdx}
                            className="glass-input flex items-baseline gap-3 px-4 py-3 font-sans text-sm leading-relaxed text-white/85"
                          >
                            <span className="shrink-0 font-mono text-xs text-white/40">
                              —
                            </span>
                            {hasHandle ? (
                              <span>
                                Instagram Reel post (
                                <a
                                  href={CONTENT.profile.instagramUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-white underline decoration-white/30 underline-offset-4 hover:text-[#ff8a70]"
                                >
                                  @heartsfromsiya
                                </a>
                                ) or Collab drop + Story
                              </span>
                            ) : (
                              <span>{item}</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
                    <span className="text-xs text-white/55">
                      {service.turnaround}
                    </span>

                    <button
                      type="button"
                      data-cursor-box
                      onClick={() => onSelectService(service.inquiryKey)}
                      className="rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-[#080708] shadow-lg transition-all hover:scale-105 hover:bg-[#ff8a70]"
                    >
                      <ScrambleText
                        text="Inquire →"
                        scrambleOnMount={false}
                        scrambleOnHover={true}
                        durationMs={320}
                      />
                    </button>
                  </div>
                </RefractivePlate>
              </div>
            );
          })}
        </div>

        {/* Interactive Glass Rate & Scope Configurator */}
        <div className="mt-12">
          <RefractivePlate maxTilt={1.6} className="glass-card p-7 sm:p-10">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="glass-pill rounded-full px-3.5 py-1 font-mono text-[11px] text-[#ff9e88]">
                    Instant Rate Estimator
                  </span>
                  <span className="font-sans text-xs text-white/55">
                    Select your scope to auto-fill the inquiry subject &amp; brief
                  </span>
                </div>

                {/* Mode Switcher */}
                <div className="mt-5 inline-flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-black/30 p-1.5">
                  <button
                    type="button"
                    data-cursor-box
                    onClick={() => setCalcMode("reels")}
                    className={`rounded-xl px-4 py-2 font-sans text-xs font-medium transition-all ${
                      calcMode === "reels"
                        ? "bg-white text-[#080708] shadow-md"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    Per Video / Reel (₹3,000 / reel)
                  </button>
                  <button
                    type="button"
                    data-cursor-box
                    onClick={() => setCalcMode("monthly")}
                    className={`rounded-xl px-4 py-2 font-sans text-xs font-medium transition-all ${
                      calcMode === "monthly"
                        ? "bg-white text-[#080708] shadow-md"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    Monthly Account Management (₹24,000 / mo)
                  </button>
                </div>

                {calcMode === "reels" ? (
                  <div className="mt-6">
                    <p className="font-sans text-xs font-medium text-white/65">
                      How many videos / reels do you need?
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2.5">
                      {REEL_COUNTS.map((count) => {
                        const active = reelCount === count;
                        return (
                          <button
                            key={count}
                            type="button"
                            data-cursor-box
                            onClick={() => setReelCount(count)}
                            className={`rounded-xl px-4 py-2.5 font-mono text-xs font-medium transition-all ${
                              active
                                ? "bg-[#ff8a70] text-[#080708] shadow-lg"
                                : "glass-pill text-white/80 hover:text-white"
                            }`}
                          >
                            {count} {count === 1 ? "Reel" : "Reels"}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="mt-6">
                    <p className="font-sans text-sm leading-relaxed text-white/75">
                      Full monthly account management at{" "}
                      <strong className="text-white">₹24,000 / month (24k)</strong>
                      —including strategy, scripting, shooting, editing, and
                      posting.{" "}
                      <span className="text-[#ff9e88]">
                        Adjustable according to what you actually require.
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Right Summary Box */}
              <div className="flex flex-col justify-between rounded-2xl border border-white/15 bg-white/5 p-6 lg:col-span-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-white/55 uppercase">
                    Estimated Investment
                  </span>
                  <span className="glass-pill rounded-full px-3 py-0.5 font-mono text-[10px] text-[#ff9e88]">
                    {calcMode === "monthly"
                      ? "Adjustable Retainer"
                      : `${reelCount} × ₹3,000`}
                  </span>
                </div>

                <div className="my-4">
                  <span className="font-display text-4xl font-bold tracking-[-0.04em] text-white sm:text-5xl">
                    {calcMode === "monthly"
                      ? "₹24,000"
                      : `₹${estimatedReelTotal}`}
                  </span>
                  <span className="ml-2 font-sans text-xs text-white/60">
                    {calcMode === "monthly"
                      ? "/ month (adjustable)"
                      : `for ${reelCount} ${reelCount === 1 ? "video/reel" : "videos/reels"}`}
                  </span>
                </div>

                <button
                  type="button"
                  data-cursor-box
                  onClick={handleCalculatorBook}
                  className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 font-sans text-xs font-semibold text-[#080708] shadow-xl transition-all hover:scale-[1.02] hover:bg-[#ff8a70]"
                >
                  <ScrambleText
                    text="Lock Scope & Auto-fill Inquiry →"
                    scrambleOnMount={false}
                    scrambleOnHover={true}
                    durationMs={320}
                  />
                </button>
              </div>
            </div>
          </RefractivePlate>
        </div>
      </div>
    </section>
  );
}

