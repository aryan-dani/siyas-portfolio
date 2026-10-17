"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CONTENT } from "@/lib/content";
import { formatInr, reelPackPrice } from "@/lib/pricing";
import {
  KineticTypewriter,
  RefractivePlate,
} from "@/components/motion/IglooMotionPrimitives";
import { usePrefersReducedMotion } from "@/lib/hooks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const REEL_COUNTS = [3, 4, 5, 6, 8];

export function ServicesSection({
  onSelectService,
}: {
  onSelectService: (packageName: string, customNote?: string) => void;
}) {
  const [calcMode, setCalcMode] = useState<"reels" | "monthly">("reels");
  const [reelCount, setReelCount] = useState<number>(3);
  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current || !headlineRef.current) return;

    const ctx = gsap.context(() => {
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

      const validCards = cardsRef.current.filter(Boolean);
      if (validCards.length > 0) {
        gsap.fromTo(
          validCards,
          { y: 28, opacity: 0, scale: 0.985 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.95,
            stagger: 0.08,
            ease: "power3.out",
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

  const estimatedReelTotal = formatInr(reelPackPrice(reelCount));

  const handleCalculatorBook = () => {
    if (calcMode === "monthly") {
      onSelectService(
        "account-management",
        "Interested in the ₹24,000/month Account Management retainer (adjustable according to our exact deliverable requirements)."
      );
    } else if (reelCount === 3) {
      onSelectService(
        "single-reel",
        "Interested in the 3-Reel Starter pack at ₹8,000."
      );
    } else {
      onSelectService(
        "multi-reel-campaign",
        `Interested in a ${reelCount}-Reel campaign pack (₹8,000 for 3 + ₹2,000 × ${reelCount - 3} extra = ₹${estimatedReelTotal}).`
      );
    }
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      aria-label="Transparent Rates and Ways to Collaborate"
      className="relative overflow-hidden bg-transparent py-20 text-[#FAF6F2] sm:py-28 md:py-36"
    >
      <div className="mx-auto max-w-[1380px] px-5 sm:px-10 lg:px-16">
        <div className="flex flex-col justify-between gap-6 pb-12 sm:pb-16 lg:flex-row lg:items-end">
          <div>
            <span className="glass-pill inline-flex items-center gap-2 rounded-full px-3.5 py-1 font-mono text-[11px] text-white/80">
              <KineticTypewriter
                text="(04) · Transparent Creator Rates"
                speedMs={22}
              />
            </span>
            <h2
              ref={headlineRef}
              className="mt-4 font-display text-[clamp(2.15rem,4.5vw,4rem)] leading-[1.06] font-semibold tracking-[-0.04em] text-white will-change-transform"
            >
              Ways to{" "}
              <em className="font-serif font-normal italic text-[#f5b88f] pr-1.5">
                collaborate
              </em>
              .
            </h2>
          </div>

          <p className="max-w-md font-sans text-sm leading-relaxed text-white/70">
            {CONTENT.services.subcopy}
          </p>
        </div>

        {/* 3 Refractive Frosted Glass Collaboration Monoliths with Direct Numbers */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {CONTENT.services.items.map((service, idx) => {
            const isHighlighted = idx === 1;
            const spanClass =
              idx === 2 ? "md:col-span-2 lg:col-span-1" : "";
            return (
              <div
                key={service.id}
                ref={(el) => {
                  cardsRef.current[idx] = el;
                }}
                className={`will-change-transform ${spanClass}`}
              >
                <RefractivePlate
                  maxTilt={2.6}
                  className={`glass-card flex h-full flex-col justify-between p-6 sm:p-8 lg:p-10 ${
                    isHighlighted ? "ring-1 ring-[#f5b88f]/40" : ""
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="glass-pill rounded-full px-3 py-1 font-mono text-[11px] text-white/80">
                        {service.index}
                      </span>
                      <span className="glass-pill rounded-full px-3.5 py-1 font-sans text-[11px] font-medium text-[#f5b88f]">
                        <KineticTypewriter
                          text={service.rateNote}
                          speedMs={24}
                        />
                      </span>
                    </div>

                    <h3 className="mt-6 font-display text-2xl leading-[1.1] font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                      <span>{service.titleBefore}</span>
                      <em className="font-serif font-normal italic text-[#f5b88f] pr-1.5">
                        {service.titleAccent}
                      </em>
                    </h3>

                    {/* Prominent Crystal Price Display */}
                    <div className="mt-5 rounded-2xl border border-white/12 bg-white/[0.045] p-4">
                      <div className="flex flex-wrap items-baseline gap-2.5">
                        <span className="font-display text-4xl font-bold tracking-[-0.04em] text-white sm:text-5xl">
                          {service.priceDisplay}
                        </span>
                        <span className="font-sans text-xs font-medium text-white/70">
                          {service.priceSub}
                        </span>
                      </div>
                    </div>

                    <p className="mt-4 font-sans text-sm leading-relaxed text-white/70">
                      {service.hoverSerifCaption}
                    </p>

                    <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-5">
                      {service.deliverables.map((item, dIdx) => {
                        const parts = item.split("@heartsfromsiya");
                        return (
                          <li
                            key={dIdx}
                            className="glass-input flex items-baseline gap-3 px-4 py-3 font-sans text-sm leading-relaxed text-white/85"
                          >
                            <span className="shrink-0 font-mono text-xs text-white/40">
                              —
                            </span>
                            {parts.length > 1 ? (
                              <span>
                                {parts[0]}
                                <a
                                  href={CONTENT.profile.instagramUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-white underline decoration-white/30 underline-offset-4 hover:text-[#f5b88f]"
                                >
                                  @heartsfromsiya
                                </a>
                                {parts[1]}
                              </span>
                            ) : (
                              <span>{item}</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                    <span className="text-xs text-white/60">
                      {service.turnaround}
                    </span>

                    <button
                      type="button"
                      data-cursor-box
                      onClick={() => {
                        const defaultNote =
                          service.inquiryKey === "account-management"
                            ? "Interested in the ₹24,000/month Account Management retainer (adjustable according to our deliverable requirements)."
                            : service.inquiryKey === "multi-reel-campaign"
                              ? "Interested in a Multi-Reel Campaign pack (₹8,000 for 3 reels + ₹2,000 per extra reel)."
                              : "Interested in the 3-Reel Starter pack at ₹8,000.";
                        onSelectService(service.inquiryKey, defaultNote);
                      }}
                      className="rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-[#080708] shadow-lg transition-all hover:scale-105 hover:bg-[#f5b88f]"
                    >
                      Inquire →
                    </button>
                  </div>
                </RefractivePlate>
              </div>
            );
          })}
        </div>

        {/* Interactive Glass Rate & Scope Configurator */}
        <div className="mt-10 sm:mt-12">
          <RefractivePlate maxTilt={1.5} className="glass-card p-6 sm:p-9 lg:p-10">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="glass-pill rounded-full px-3.5 py-1 font-mono text-[11px] text-[#f5b88f]">
                    <KineticTypewriter
                      text="Instant Rate Estimator"
                      speedMs={24}
                    />
                  </span>
                  <span className="font-sans text-xs text-white/60">
                    Select your scope to auto-fill the inquiry subject &amp; brief
                  </span>
                </div>

                {/* Mode Switcher */}
                <div className="mt-5 inline-flex w-full flex-col gap-2 rounded-2xl border border-white/12 bg-black/35 p-1.5 sm:w-auto sm:flex-row">
                  <button
                    type="button"
                    data-cursor-box
                    onClick={() => setCalcMode("reels")}
                    className={`rounded-xl px-4 py-2.5 font-sans text-xs font-medium transition-all ${
                      calcMode === "reels"
                        ? "bg-white text-[#080708] shadow-md"
                        : "text-white/75 hover:text-white"
                    }`}
                  >
                    Reel Packs (₹8,000 / 3 · +₹2,000 each)
                  </button>
                  <button
                    type="button"
                    data-cursor-box
                    onClick={() => setCalcMode("monthly")}
                    className={`rounded-xl px-4 py-2.5 font-sans text-xs font-medium transition-all ${
                      calcMode === "monthly"
                        ? "bg-white text-[#080708] shadow-md"
                        : "text-white/75 hover:text-white"
                    }`}
                  >
                    Monthly Account Management (₹24,000 / mo)
                  </button>
                </div>

                {calcMode === "reels" ? (
                  <div className="mt-6">
                    <p className="font-sans text-xs font-medium text-white/70">
                      How many reels do you need? (starts at 3 for ₹8,000)
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
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
                                ? "bg-[#f5b88f] text-[#080708] shadow-lg"
                                : "glass-pill text-white/85 hover:text-white"
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
                    <p className="font-sans text-sm leading-relaxed text-white/80">
                      Full monthly account management at{" "}
                      <strong className="text-white">₹24,000 / month (24k)</strong>
                      —including strategy, scripting, shooting, editing, and
                      posting.{" "}
                      <span className="text-[#f5b88f]">
                        Adjustable according to what you actually require.
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Right Summary Box */}
              <div className="flex flex-col justify-between rounded-2xl border border-white/15 bg-white/[0.045] p-6 lg:col-span-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] text-white/60 uppercase">
                    Estimated Investment
                  </span>
                  <span className="glass-pill rounded-full px-3 py-0.5 font-mono text-[10px] text-[#f5b88f]">
                    {calcMode === "monthly"
                      ? "Adjustable Retainer"
                      : reelCount === 3
                        ? "3-reel starter"
                        : `3 + ${reelCount - 3} extra`}
                  </span>
                </div>

                <div className="my-4">
                  <span className="font-display text-4xl font-bold tracking-[-0.04em] text-white sm:text-5xl">
                    {calcMode === "monthly"
                      ? "₹24,000"
                      : `₹${estimatedReelTotal}`}
                  </span>
                  <span className="ml-2 font-sans text-xs text-white/65">
                    {calcMode === "monthly"
                      ? "/ month (adjustable)"
                      : `for ${reelCount} reels`}
                  </span>
                </div>

                <button
                  type="button"
                  data-cursor-box
                  onClick={handleCalculatorBook}
                  className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 font-sans text-xs font-semibold text-[#080708] shadow-xl transition-all hover:scale-[1.02] hover:bg-[#f5b88f]"
                >
                  Lock Scope &amp; Auto-fill Inquiry →
                </button>
              </div>
            </div>
          </RefractivePlate>
        </div>
      </div>
    </section>
  );
}
