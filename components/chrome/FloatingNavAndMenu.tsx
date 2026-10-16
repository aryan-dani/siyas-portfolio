"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CONTENT } from "@/lib/content";
import { useSmoothScroll } from "@/components/motion/SmoothScrollProvider";
import { ScrambleText } from "@/components/motion/IglooMotionPrimitives";

const MENU_ITEMS = [
  {
    index: "01",
    title: "Home",
    href: "#top",
    previewSrc: "/siya/siya-portrait.jpg",
    previewSub: "Siya Pawar (@heartsfromsiya) · Pune, India",
  },
  {
    index: "02",
    title: "Work",
    href: "#work",
    previewSrc: "/siya/reels/reel-neighbours-poster.jpg",
    previewSub: "1.8M+ & 319K-Like Reels · PharmEasy · Mokobara",
  },
  {
    index: "03",
    title: "Pricing",
    href: "#services",
    previewSrc: "/siya/reels/reel-02-poster.jpg",
    previewSub: "Deliverables, Collaborations & Monthly Retainers",
  },
  {
    index: "04",
    title: "About",
    href: "#about",
    previewSrc: "/siya/reels/reel-weather-poster.jpg",
    previewSub: "Behind the camera · Golden hour in Pune",
  },
  {
    index: "05",
    title: "Contact",
    href: "#contact",
    previewSrc: "/siya/reels/reel-05-poster.jpg",
    previewSub: "siyapawar@gmail.com · Direct Brand Collaborations",
  },
];

export function FloatingNavAndMenu({
  onRequestMediaKit: _onRequestMediaKit,
}: {
  onRequestMediaKit: (packageName?: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [localTime, setLocalTime] = useState<string>("10:15 PM");
  const { scrollTo } = useSmoothScroll();

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
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const handleNavigate = (href: string) => {
    setIsOpen(false);
    window.setTimeout(() => {
      scrollTo(href);
    }, 220);
  };

  return (
    <>
      {/* Minimal Top-Center Frosted Glass Capsule */}
      <header className="fixed top-5 left-1/2 z-[120] -translate-x-1/2">
        <div className="glass-pill flex items-center gap-1 rounded-full p-1 text-xs">
          <button
            type="button"
            data-cursor-box
            onClick={() => setIsOpen(true)}
            aria-expanded={isOpen}
            aria-controls="fullscreen-menu-overlay"
            className="group inline-flex items-center gap-2 rounded-full px-4 py-2 font-sans font-semibold text-white transition-colors hover:bg-white/10"
          >
            <svg
              viewBox="0 0 12 12"
              aria-hidden="true"
              className="h-3 w-3 fill-current text-white transition-transform duration-300 group-hover:rotate-90"
            >
              <circle cx="3" cy="3" r="1.3" />
              <circle cx="9" cy="3" r="1.3" />
              <circle cx="3" cy="9" r="1.3" />
              <circle cx="9" cy="9" r="1.3" />
            </svg>
            <ScrambleText
              text="Menu"
              scrambleOnMount={false}
              scrambleOnHover={true}
              durationMs={280}
            />
          </button>

          <span className="h-3.5 w-[1px] bg-white/15" aria-hidden="true" />

          <button
            type="button"
            data-cursor-box
            onClick={() => scrollTo("#services")}
            className="rounded-full px-4 py-2 font-sans text-xs font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ScrambleText
              text="View Pricing"
              scrambleOnMount={false}
              scrambleOnHover={true}
              durationMs={280}
            />
          </button>
        </div>
      </header>

      {/* Deep Smoked-Glass Fullscreen Menu Overlay */}
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            id="fullscreen-menu-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation menu"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(36px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: "rgba(8, 6, 7, 0.86)",
              backdropFilter: "blur(36px) saturate(165%)",
            }}
            className="fixed inset-0 z-[150] flex flex-col justify-between overflow-hidden px-7 py-6 text-white sm:px-12 sm:py-8"
          >
            {/* Top Bar: Minimal Label + Close Pill */}
            <div className="relative z-10 flex items-center justify-between gap-4">
              <span className="glass-pill rounded-full px-4 py-1.5 font-sans text-xs font-medium text-white/85">
                Navigation
              </span>

              <button
                type="button"
                data-cursor-box
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 font-sans text-xs font-semibold text-[#080808] transition-transform duration-300 hover:scale-[1.03]"
              >
                <span>Close</span>
                <span aria-hidden="true" className="text-[11px]">
                  ✕
                </span>
              </button>
            </div>

            {/* Center: Monumental Left-Aligned Navigation + Double-Bezel Frosted Glass Preview */}
            <div className="relative z-10 my-auto grid grid-cols-1 items-center lg:grid-cols-12">
              <nav
                aria-label="Fullscreen Navigation"
                onMouseLeave={() => setHoveredIdx(null)}
                className="flex flex-col items-start lg:col-span-7"
              >
                {MENU_ITEMS.map((item, idx) => {
                  const isHovered = hoveredIdx === idx;
                  const isDimmed = hoveredIdx !== null && hoveredIdx !== idx;

                  return (
                    <motion.button
                      key={item.href}
                      type="button"
                      data-no-magnet
                      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                      transition={{
                        duration: 0.48,
                        delay: 0.045 * idx,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onClick={() => handleNavigate(item.href)}
                      className="group relative flex items-start gap-6 py-0.5 text-left sm:gap-10"
                    >
                      <span className="mt-3 font-mono text-[10px] text-white/40">
                        {item.index}
                      </span>

                      <span
                        className={`relative inline-flex items-center font-display text-[clamp(3.1rem,6.8vw,5.8rem)] leading-[0.94] font-semibold tracking-[-0.045em] transition-all duration-300 ${
                          isDimmed ? "text-white/25" : "text-white"
                        }`}
                      >
                        <ScrambleText
                          text={item.title}
                          scrambleOnMount={true}
                          scrambleOnHover={true}
                          durationMs={340}
                        />

                        {/* Interactive Frosted Glass ↗ Pill Badge on Hover */}
                        <span
                          className={`ml-4 inline-flex items-center transition-all duration-300 ${
                            isHovered
                              ? "translate-x-0 scale-100 opacity-100"
                              : "-translate-x-3 scale-95 opacity-0"
                          }`}
                        >
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-medium text-[#080808] shadow-lg">
                            ↗
                          </span>
                        </span>
                      </span>
                    </motion.button>
                  );
                })}
              </nav>

              {/* Double-Bezel Frosted Glass Preview Card on Desktop Hover */}
              <div className="hidden lg:col-span-5 lg:flex lg:justify-start">
                <AnimatePresence mode="wait">
                  {hoveredIdx !== null ? (
                    <motion.div
                      key={MENU_ITEMS[hoveredIdx].href}
                      initial={{
                        opacity: 0,
                        y: 18,
                        scale: 0.94,
                        filter: "blur(10px)",
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        filter: "blur(0px)",
                      }}
                      exit={{
                        opacity: 0,
                        y: 10,
                        scale: 0.95,
                        filter: "blur(8px)",
                      }}
                      transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                      className="glass-portrait-bezel w-80 overflow-hidden p-2.5"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={MENU_ITEMS[hoveredIdx].previewSrc}
                          alt={MENU_ITEMS[hoveredIdx].title}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      </div>
                      <div className="px-3 pt-3.5 pb-2">
                        <p className="font-sans text-xs font-medium text-white/85">
                          {MENU_ITEMS[hoveredIdx].previewSub}
                        </p>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom Frosted Glass Bar */}
            <div className="relative z-10 flex flex-wrap items-end justify-between gap-6 border-t border-white/10 pt-5 text-xs">
              <div>
                <p className="text-[11px] text-white/45">Direct Inbox</p>
                <a
                  href={`mailto:${CONTENT.profile.email}?cc=${CONTENT.profile.ccEmail}&subject=${encodeURIComponent(
                    "Brand Collaboration Inquiry — Siya Pawar (@heartsfromsiya)"
                  )}`}
                  data-cursor-box
                  className="mt-0.5 inline-block font-sans text-xs font-medium text-white underline decoration-white/30 underline-offset-4 hover:text-[#ff8a70]"
                >
                  {CONTENT.profile.email}
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-5 text-[11px] text-white/65">
                <a
                  href={CONTENT.profile.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-box
                  className="transition-colors hover:text-white"
                >
                  Instagram ({CONTENT.profile.handle})
                </a>
                <a
                  href={CONTENT.profile.instagramDumpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-box
                  className="transition-colors hover:text-white"
                >
                  {CONTENT.profile.secondaryHandle}
                </a>
                <a
                  href={CONTENT.profile.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-box
                  className="transition-colors hover:text-white"
                >
                  YouTube
                </a>
              </div>

              <div className="glass-pill rounded-full px-3.5 py-1 text-[11px] text-white/75">
                {localTime} · Pune, India
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
