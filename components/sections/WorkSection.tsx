"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CONTENT, type ReelItem } from "@/lib/content";
import {
  AnimatedHairline,
  RefractivePlate,
  ScrambleText,
} from "@/components/motion/IglooMotionPrimitives";
import { usePrefersReducedMotion } from "@/lib/hooks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function ReelFrame({
  reel,
  isPlaying,
}: {
  reel: ReelItem;
  isPlaying: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !reel.videoSrc) return;
    if (isPlaying) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [isPlaying, reel.videoSrc]);

  return (
    <RefractivePlate maxTilt={4.2} className="glass-card p-2.5 select-none">
      <div className="relative flex aspect-[9/16] w-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#11070A] p-3.5">
        {/* Subtle Top Progress Line */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 z-30 h-[2px] bg-white/10"
        >
          <div
            className={`h-full bg-[#ff8a70] transition-all ease-linear ${
              isPlaying ? "w-full duration-[4500ms]" : "w-1/4 duration-300"
            }`}
          />
        </div>

        {/* Real Photo Poster Background */}
        {reel.posterSrc ? (
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={reel.posterSrc}
              alt={`${reel.brand} — ${reel.captionSans}`}
              className={`h-full w-full object-cover transition-transform duration-700 ease-out ${
                isPlaying ? "scale-105" : "scale-100"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090506]/85 via-transparent to-[#090506]/35" />
          </div>
        ) : null}

        {/* Native MP4 Video when available */}
        {reel.videoSrc ? (
          <video
            ref={videoRef}
            src={reel.videoSrc}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 z-10 h-full w-full object-cover"
          />
        ) : null}

        {/* Top Frosted Glass Creator Pill */}
        <div className="relative z-20 flex items-center justify-between text-xs text-white/95">
          <a
            href={CONTENT.profile.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="glass-pill inline-flex items-center gap-2 rounded-full py-1 pr-3 pl-1.5 hover:text-[#ff8a70]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/siya/siya-portrait.jpg"
              alt="Siya"
              className="h-5 w-5 rounded-full object-cover"
            />
            <span className="text-[11px] font-medium">
              {CONTENT.profile.handle}
            </span>
          </a>
          <span className="glass-pill rounded-full px-2.5 py-1 text-[11px] text-white/85">
            {reel.duration}
          </span>
        </div>

        {/* Center Floating Frosted Glass Play Orb on Hover */}
        <div
          aria-hidden="true"
          className={`pointer-events-none relative z-20 my-auto flex items-center justify-center transition-all duration-500 ${
            isPlaying ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
        >
          <div className="glass-pill flex h-12 w-12 items-center justify-center rounded-full text-xs text-white">
            ▶
          </div>
        </div>

        {/* Bottom Frosted Glass Caption Dock */}
        <div className="glass-dock relative z-20 mt-auto flex flex-col gap-2 p-3.5">
          <p className="font-serif text-base leading-snug italic text-white/95">
            “{reel.overlaySerif}”
          </p>
          <p className="line-clamp-2 font-sans text-xs leading-relaxed text-white/80">
            {reel.captionSans}
          </p>

          <div className="mt-0.5 flex items-center justify-between border-t border-white/10 pt-2 text-[11px] text-white/65">
            <span className="truncate pr-2">♪ {reel.audioName}</span>
            <span className="shrink-0 font-medium text-[#ff8a70]">
              Watch ↗
            </span>
          </div>
        </div>
      </div>
    </RefractivePlate>
  );
}

export function WorkSection({
  onRequestMediaKit,
}: {
  onRequestMediaKit: () => void;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeReel, setActiveReel] = useState<ReelItem | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const cardsRef = useRef<Array<HTMLElement | null>>([]);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current || !headlineRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headlineRef.current,
        {
          y: 36,
          rotateX: -18,
          opacity: 0,
          filter: "blur(8px)",
          transformOrigin: "50% 100%",
        },
        {
          y: 0,
          rotateX: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.2,
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
            stagger: 0.1,
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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeReel) {
        setActiveReel(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeReel]);

  return (
    <section
      id="work"
      ref={sectionRef}
      aria-label="Selected Reels and Brand Collaborations"
      className="relative overflow-hidden bg-transparent py-28 text-[#FAF5F0] md:py-40"
    >
      <div className="relative z-10 mx-auto max-w-[1380px] px-7 sm:px-12 lg:px-16">
        <AnimatedHairline />

        {/* Spacious Editorial Header */}
        <div className="flex flex-col justify-between gap-8 pt-14 lg:flex-row lg:items-end">
          <div style={{ perspective: "900px" }}>
            <span className="glass-pill inline-flex items-center gap-2 rounded-full px-3.5 py-1 font-mono text-[11px] text-white/75">
              (01) · Selected Reels &amp; Brand Work
            </span>
            <h2
              ref={headlineRef}
              className="mt-4 font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.98] font-bold tracking-[-0.04em] text-[#FAF5F0] will-change-transform"
            >
              Stories people{" "}
              <em className="font-serif font-normal italic text-[#ff8a70]">
                actually
              </em>{" "}
              finish.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href={CONTENT.profile.instagramReelsUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-box
              className="glass-pill inline-flex items-center gap-2 rounded-full px-6 py-3 font-sans text-xs font-medium text-white/90 hover:text-white"
            >
              <ScrambleText
                text={`All Reels on ${CONTENT.profile.handle} ↗`}
                scrambleOnMount={false}
                scrambleOnHover={true}
                durationMs={360}
              />
            </a>
          </div>
        </div>

        {/* Breathable 4-Column Frosted Glass Reel Showcase */}
        <div className="mt-16 grid grid-cols-1 gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {CONTENT.work.reels.map((reel, idx) => {
            const isHovered = hoveredId === reel.id;
            const isHandleBrand = reel.brand === CONTENT.profile.handle;

            return (
              <article
                key={reel.id}
                ref={(el) => {
                  cardsRef.current[idx] = el;
                }}
                onClick={() => setActiveReel(reel)}
                onMouseEnter={() => setHoveredId(reel.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group cursor-pointer will-change-transform"
              >
                <ReelFrame reel={reel} isPlaying={isHovered} />

                {/* Clean Frosted Glass Meta Pill + Caption Footer */}
                <div className="mt-5 px-1">
                  <div className="flex items-center justify-between text-xs text-white/55">
                    <span>{reel.category}</span>
                    <span className="glass-pill rounded-full px-2.5 py-0.5 font-serif text-sm italic text-[#ff8a70]">
                      {reel.views}
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-baseline justify-between gap-2">
                    {isHandleBrand ? (
                      <a
                        href={CONTENT.profile.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="font-display text-xl font-bold tracking-[-0.02em] text-white transition-colors hover:text-[#ff8a70]"
                      >
                        <ScrambleText
                          text={reel.brand}
                          scrambleOnMount={false}
                          scrambleOnHover={true}
                          durationMs={340}
                        />
                      </a>
                    ) : (
                      <h3 className="font-display text-xl font-bold tracking-[-0.02em] text-white transition-colors group-hover:text-[#ff8a70]">
                        <ScrambleText
                          text={reel.brand}
                          scrambleOnMount={false}
                          scrambleOnHover={true}
                          durationMs={340}
                        />
                      </h3>
                    )}

                    <a
                      href={reel.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      data-cursor-box
                      className="glass-pill rounded-full px-2.5 py-1 text-xs text-white/70 hover:text-[#ff8a70]"
                    >
                      Instagram ↗
                    </a>
                  </div>

                  <p className="mt-1.5 font-sans text-sm leading-relaxed text-white/60">
                    “{reel.captionSans}”
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Smoked-Glass Case Study Lightbox Modal */}
      <AnimatePresence>
        {activeReel ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-reel-title"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(28px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            onClick={() => setActiveReel(null)}
            className="fixed inset-0 z-[130] flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-2xl sm:p-6"
          >
            <motion.div
              initial={{ y: 24, opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ y: 16, opacity: 0, scale: 0.96, filter: "blur(8px)" }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="glass-Popover relative grid w-full max-w-4xl grid-cols-1 gap-8 p-6 text-[#FAF5F0] md:grid-cols-12 md:p-10"
            >
              <div className="mx-auto w-full max-w-[260px] md:col-span-5 md:max-w-none">
                <ReelFrame reel={activeReel} isPlaying={true} />
              </div>

              <div className="flex flex-col justify-between md:col-span-7">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="glass-pill rounded-full px-3 py-1 text-xs text-white/75">
                      {activeReel.category}
                    </span>
                    <button
                      type="button"
                      data-cursor-box
                      onClick={() => setActiveReel(null)}
                      className="glass-pill rounded-full px-3.5 py-1 text-xs text-white/80 hover:text-white"
                    >
                      Close ✕
                    </button>
                  </div>

                  <div className="mt-5 flex items-baseline justify-between gap-4">
                    <h3
                      id="lightbox-reel-title"
                      className="font-display text-3xl font-bold tracking-[-0.03em] text-white"
                    >
                      {activeReel.brand}
                    </h3>
                    <span className="font-serif text-xl italic text-[#ff8a70]">
                      {activeReel.views}
                    </span>
                  </div>

                  <blockquote className="glass-dock mt-6 p-4">
                    <p className="font-serif text-2xl italic text-white">
                      “{activeReel.captionSans}”
                    </p>
                  </blockquote>

                  <div className="mt-6 space-y-4 pt-2">
                    <div>
                      <h4 className="text-xs text-white/45">Why it worked</h4>
                      <p className="mt-1.5 font-sans text-sm leading-relaxed text-white/80">
                        {activeReel.storyBehind}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
                  <a
                    href={activeReel.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-box
                    className="glass-pill rounded-full px-5 py-2.5 text-xs font-medium text-white"
                  >
                    Watch on Instagram ↗
                  </a>
                  <button
                    type="button"
                    data-cursor-box
                    onClick={() => {
                      setActiveReel(null);
                      onRequestMediaKit();
                    }}
                    className="rounded-full bg-white px-6 py-2.5 text-xs font-semibold text-[#090506] shadow-lg transition-colors hover:bg-[#ff8a70]"
                  >
                    Collaborate with Siya →
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
