"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CONTENT, type ReelItem } from "@/lib/content";
import {
  AnimatedHairline,
  KineticTypewriter,
  RefractivePlate,
} from "@/components/motion/IglooMotionPrimitives";
import { usePrefersReducedMotion } from "@/lib/hooks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function ReelFrame({
  reel,
  isPlaying,
  isMuted,
  shouldLoadVideo,
  priority = false,
  onTogglePlay,
  onToggleMute,
}: {
  reel: ReelItem;
  isPlaying: boolean;
  isMuted: boolean;
  shouldLoadVideo: boolean;
  priority?: boolean;
  onTogglePlay: () => void;
  onToggleMute: (e: React.MouseEvent) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !reel.videoSrc || !shouldLoadVideo) return;

    vid.muted = isMuted;

    if (isPlaying) {
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay fallback: ensure muted play succeeds
          vid.muted = true;
          vid.play().catch(() => {});
        });
      }
    } else {
      vid.pause();
    }
  }, [isPlaying, isMuted, reel.videoSrc, shouldLoadVideo]);

  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid || !vid.duration) return;
    setProgress((vid.currentTime / vid.duration) * 100);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid || !vid.duration) {
      onTogglePlay();
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(
      1,
      Math.max(0, (e.clientX - rect.left) / Math.max(1, rect.width))
    );
    vid.currentTime = ratio * vid.duration;
    setProgress(ratio * 100);
    if (!isPlaying) {
      onTogglePlay();
    }
  };

  return (
    <RefractivePlate maxTilt={2.6} className="glass-card p-2 sm:p-2.5 select-none">
      <div
        role="button"
        tabIndex={0}
        aria-label={`${isPlaying ? "Pause" : "Play"} reel: ${reel.captionSans}`}
        onClick={onTogglePlay}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onTogglePlay();
          }
        }}
        className="relative flex aspect-[9/16] w-full flex-col justify-between overflow-hidden rounded-[22px] border border-white/14 bg-[#0B070A] p-3.5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]"
      >
        {/* Optimized Next.js Poster Image */}
        {reel.posterSrc ? (
          <div className="absolute inset-0 z-0">
            <Image
              src={reel.posterSrc}
              alt={`${reel.brand} — ${reel.captionSans}`}
              fill
              priority={priority}
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 25vw"
              className={`object-cover transition-transform duration-700 ease-out ${
                isPlaying ? "scale-[1.03]" : "scale-100"
              }`}
            />
            {/* Top & Bottom Smoked Scrim for High-Contrast Readability on Bright Frames */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#070507]/70 via-transparent to-[#070507]/90" />
          </div>
        ) : null}

        {/* Real HTML5 MP4 Video Stream */}
        {shouldLoadVideo && reel.videoSrc ? (
          <video
            ref={videoRef}
            src={reel.videoSrc}
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
            onLoadedData={() => setVideoReady(true)}
            onTimeUpdate={handleTimeUpdate}
            className={`
              pointer-events-none absolute inset-0 z-10 h-full w-full object-cover transition-opacity duration-300
              ${isPlaying && videoReady ? "opacity-100" : "opacity-0"}
            `}
          />
        ) : null}

        {/* Top High-Contrast Smoked Glass Creator Pill + Audio Toggle */}
        <div className="relative z-20 flex items-center justify-between gap-2 text-xs text-white">
          <a
            href={CONTENT.profile.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="glass-reel-pill inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#0d070b]/80 py-1 pr-3 pl-1.5 shadow-[0_10px_28px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.28)] backdrop-blur-xl transition-colors hover:border-[#f5b88f]/45 hover:text-[#f5b88f]"
          >
            <Image
              src="/siya/siya-portrait.jpg"
              alt="Siya"
              width={20}
              height={20}
              className="h-5 w-5 rounded-full object-cover ring-1 ring-white/25"
            />
            <span className="text-[11px] font-medium tracking-[-0.01em] text-white/95">
              {CONTENT.profile.handle}
            </span>
          </a>

          <button
            type="button"
            onClick={onToggleMute}
            aria-label={isMuted ? "Unmute reel audio" : "Mute reel audio"}
            className="glass-reel-pill inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#0d070b]/80 px-2.5 py-1 font-mono text-[10px] font-medium text-white/95 shadow-[0_10px_28px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.28)] backdrop-blur-xl transition-colors hover:border-white/35 hover:text-white"
          >
            <span aria-hidden="true">{isMuted ? "🔇" : "🔊"}</span>
            <span>{isMuted ? reel.duration : "Audio On"}</span>
          </button>
        </div>

        {/* Center Play Indicator: ONLY visible when paused so it never blocks the playing video */}
        <div
          aria-hidden="true"
          className={`pointer-events-none relative z-20 my-auto flex items-center justify-center transition-all duration-300 ${
            isPlaying
              ? "scale-75 opacity-0"
              : "scale-100 opacity-95 group-hover:scale-105"
          }`}
        >
          <div className="glass-reel-pill flex h-13 w-13 items-center justify-center rounded-full border border-white/25 bg-[#0d070b]/80 text-sm text-white shadow-[0_14px_34px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-xl">
            <span className="translate-x-[1px]">▶</span>
          </div>
        </div>

        {/* Bottom Smoked Glass Caption Dock + Interactive Scrub Progress Bar */}
        <div className="glass-dock relative z-20 mt-auto flex flex-col gap-1.5 p-3.5">
          <div className="flex items-center justify-between gap-2">
            <p className="font-serif text-[15px] leading-snug italic text-[#f5c6aa] pr-1">
              <KineticTypewriter
                text={`“${reel.overlaySerif}”`}
                speedMs={24}
                replayOnHover
              />
            </p>
            <span className="shrink-0 rounded-full border border-white/12 bg-white/10 px-2 py-0.5 font-mono text-[9px] tracking-[0.08em] text-white/90 uppercase">
              {isPlaying ? "Playing" : "Play"}
            </span>
          </div>
          <p className="line-clamp-2 font-sans text-xs leading-relaxed text-white/85">
            {reel.captionSans}
          </p>

          {/* Interactive Unclipped Internal Progress Bar */}
          <div
            onClick={handleSeek}
            title="Click to seek video"
            className="mt-1.5 flex h-3 w-full items-center"
          >
            <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/15">
              <div
                style={{ width: `${isPlaying ? Math.max(10, progress) : 22}%` }}
                className={`h-full rounded-full bg-gradient-to-r from-[#f5b88f] to-[#ff8a70] transition-[width,opacity] duration-150 ease-linear ${
                  isPlaying ? "opacity-100" : "opacity-45"
                }`}
              />
            </div>
          </div>

          <div className="mt-0.5 flex items-center justify-between pt-0.5 text-[11px] text-white/65">
            <span className="truncate pr-2">♪ {reel.audioName}</span>
            <a
              href={reel.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 font-mono text-[10px] tracking-[0.06em] text-[#f5b88f] uppercase hover:text-white"
            >
              IG ↗
            </a>
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
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [unmutedId, setUnmutedId] = useState<string | null>(null);
  const [activeReel, setActiveReel] = useState<ReelItem | null>(null);
  const [shouldLoadVideos, setShouldLoadVideos] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const cardsRef = useRef<Array<HTMLElement | null>>([]);
  const reducedMotion = usePrefersReducedMotion();

  // Lazy-attach MP4 streams when user scrolls near #work so initial page load is instantaneous
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoadVideos(true);
          io.disconnect();
        }
      },
      { rootMargin: "450px 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion || !sectionRef.current || !headlineRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headlineRef.current,
        {
          y: 26,
          opacity: 0,
        },
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
          { y: 30, opacity: 0, scale: 0.985 },
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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeReel) {
        setActiveReel(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    if (activeReel) {
      document.body.style.overflow = "hidden";
      document.documentElement.setAttribute("data-overlay-active", "true");
    } else {
      document.body.style.overflow = "";
      document.documentElement.removeAttribute("data-overlay-active");
    }
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      document.documentElement.removeAttribute("data-overlay-active");
    };
  }, [activeReel]);

  const handleTogglePlay = (id: string) => {
    setShouldLoadVideos(true);
    setPlayingId((prev) => {
      if (prev === id) {
        return null;
      }
      return id;
    });
  };

  const handleToggleMute = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShouldLoadVideos(true);
    setPlayingId(id);
    setUnmutedId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="work"
      ref={sectionRef}
      aria-label="Selected Reels and Brand Collaborations"
      className="relative overflow-hidden bg-transparent py-20 text-[#FAF6F2] sm:py-28 md:py-36"
    >
      <div className="relative z-10 mx-auto max-w-[1380px] px-5 sm:px-10 lg:px-16">
        <AnimatedHairline />

        {/* Spacious Editorial Header */}
        <div className="flex flex-col justify-between gap-6 pt-12 sm:pt-14 lg:flex-row lg:items-end">
          <div>
            <span className="glass-pill inline-flex items-center gap-2 rounded-full px-3.5 py-1 font-mono text-[11px] text-white/80">
              <KineticTypewriter
                text="(01) · Selected Reels & Brand Work"
                speedMs={22}
                replayOnHover
              />
            </span>
            <h2
              ref={headlineRef}
              className="mt-4 font-display text-[clamp(2.15rem,5vw,4.5rem)] leading-[1.06] font-bold tracking-[-0.04em] text-[#FAF6F2] will-change-transform"
            >
              Stories people{" "}
              <em className="font-serif font-normal italic text-[#f5b88f] pr-1.5">
                actually
              </em>{" "}
              finish.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://www.instagram.com/reel/Dak5At3oA-A/"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-box
              className="glass-pill inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-sans text-xs font-medium text-[#f5c6aa] transition-colors hover:text-white"
            >
              <span>1.8M+ Monsoon Reel (“this weather❤️‍🩹”) ↗</span>
            </a>

            <a
              href={CONTENT.profile.instagramReelsUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-box
              className="glass-pill inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-sans text-xs font-medium text-white/90 transition-colors hover:text-white"
            >
              <span>All Reels on {CONTENT.profile.handle} ↗</span>
            </a>
          </div>
        </div>

        {/* Responsive 1 -> 2 (iPad/Tablet) -> 4 (Desktop) Playable Reel Grid */}
        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-7">
          {CONTENT.work.reels.map((reel, idx) => {
            const isPlaying = playingId === reel.id;
            const isMuted = unmutedId !== reel.id;
            const isHandleBrand = reel.brand === CONTENT.profile.handle;

            return (
              <article
                key={reel.id}
                ref={(el) => {
                  cardsRef.current[idx] = el;
                }}
                onMouseEnter={() => {
                  if (typeof window !== "undefined" && window.innerWidth >= 1024) {
                    setShouldLoadVideos(true);
                    setPlayingId(reel.id);
                  }
                }}
                onMouseLeave={() => {
                  if (
                    typeof window !== "undefined" &&
                    window.innerWidth >= 1024 &&
                    unmutedId !== reel.id
                  ) {
                    setPlayingId((prev) => (prev === reel.id ? null : prev));
                  }
                }}
                className="group flex flex-col will-change-transform"
              >
                <ReelFrame
                  reel={reel}
                  isPlaying={isPlaying}
                  isMuted={isMuted}
                  shouldLoadVideo={shouldLoadVideos}
                  priority={idx < 2}
                  onTogglePlay={() => handleTogglePlay(reel.id)}
                  onToggleMute={(e) => handleToggleMute(reel.id, e)}
                />

                {/* Editorial Glass Metadata Dock Under Each Reel Card */}
                <div className="glass-dock mt-3 flex flex-col gap-2.5 px-4 py-3.5">
                  <div className="flex items-center justify-between gap-2 text-[11px] text-white/60">
                    <span className="truncate font-mono text-[10px] tracking-[0.06em] uppercase">
                      <KineticTypewriter
                        text={reel.category}
                        speedMs={22}
                        replayOnHover
                      />
                    </span>
                    <span className="glass-pill shrink-0 rounded-full px-2.5 py-0.5 font-serif text-xs italic text-[#f5b88f] pr-3">
                      <KineticTypewriter
                        text={reel.views}
                        speedMs={26}
                        replayOnHover
                      />
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    {isHandleBrand ? (
                      <a
                        href={CONTENT.profile.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate font-display text-base font-bold tracking-[-0.02em] text-white transition-colors hover:text-[#ff8a70] sm:text-lg"
                      >
                        {reel.brand}
                      </a>
                    ) : (
                      <h3 className="truncate font-display text-base font-bold tracking-[-0.02em] text-white transition-colors group-hover:text-[#ff8a70] sm:text-lg">
                        {reel.brand}
                      </h3>
                    )}

                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setActiveReel(reel)}
                        data-cursor-box
                        className="glass-pill rounded-full px-2.5 py-1 text-[11px] font-medium text-white/80 hover:text-white"
                      >
                        Notes
                      </button>
                      <a
                        href={reel.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor-box
                        className="glass-pill rounded-full px-2.5 py-1 text-[11px] font-medium text-[#f5b88f] hover:text-white"
                      >
                        IG ↗
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Smoked-Glass Case Study Modal with Working Video & Audio Player */}
      <AnimatePresence>
        {activeReel ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-reel-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveReel(null)}
            className="fixed inset-0 z-[130] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-2xl sm:p-6"
          >
            <motion.div
              initial={{ y: 24, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="glass-Popover relative grid w-full max-w-4xl grid-cols-1 gap-7 p-5 text-[#FAF6F2] sm:p-8 md:grid-cols-12 md:p-10"
            >
              <div className="mx-auto w-full max-w-[260px] md:col-span-5 md:max-w-none">
                <ReelFrame
                  reel={activeReel}
                  isPlaying={true}
                  isMuted={unmutedId !== activeReel.id}
                  shouldLoadVideo={true}
                  onTogglePlay={() =>
                    setUnmutedId((prev) =>
                      prev === activeReel.id ? null : activeReel.id
                    )
                  }
                  onToggleMute={(e) => handleToggleMute(activeReel.id, e)}
                />
              </div>

              <div className="flex flex-col justify-between md:col-span-7">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="glass-pill rounded-full px-3 py-1 text-xs text-white/80">
                      {activeReel.category}
                    </span>
                    <button
                      type="button"
                      data-cursor-box
                      onClick={() => setActiveReel(null)}
                      className="glass-pill rounded-full px-3.5 py-1 text-xs text-white/85 hover:text-white"
                    >
                      Close ✕
                    </button>
                  </div>

                  <div className="mt-5 flex flex-wrap items-baseline justify-between gap-4">
                    <h3
                      id="lightbox-reel-title"
                      className="font-display text-2xl font-bold tracking-[-0.03em] text-white sm:text-3xl"
                    >
                      {activeReel.brand}
                    </h3>
                    <span className="font-serif text-lg italic text-[#f5b88f] sm:text-xl">
                      {activeReel.views}
                    </span>
                  </div>

                  <blockquote className="glass-dock mt-5 p-4">
                    <p className="font-serif text-xl italic text-white sm:text-2xl">
                      “{activeReel.captionSans}”
                    </p>
                  </blockquote>

                  <div className="mt-5 space-y-3 pt-1">
                    <h4 className="text-xs font-medium text-white/50 uppercase tracking-wider">
                      Why it worked
                    </h4>
                    <p className="font-sans text-sm leading-relaxed text-white/80">
                      {activeReel.storyBehind}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
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
                    className="rounded-full bg-white px-6 py-2.5 text-xs font-semibold text-[#080608] shadow-lg transition-colors hover:bg-[#ff8a70]"
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
