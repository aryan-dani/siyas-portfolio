"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { CONTENT } from "@/lib/content";
import { KineticTypewriter } from "@/components/motion/IglooMotionPrimitives";
import { useSmoothScroll } from "@/components/motion/SmoothScrollProvider";

const MENU_ITEMS = [
  {
    index: "01",
    title: "Home",
    href: "#top",
    previewSrc: "/siya/previews/preview-home.png",
    previewLabel: "Siya. · Hero",
  },
  {
    index: "02",
    title: "Work",
    href: "#work",
    previewSrc: "/siya/previews/preview-work.png",
    previewLabel: "Selected Reels",
  },
  {
    index: "03",
    title: "Pricing",
    href: "#services",
    previewSrc: "/siya/previews/preview-pricing.png",
    previewLabel: "₹8K/3 · ₹24K Rates",
  },
  {
    index: "04",
    title: "About",
    href: "#about",
    previewSrc: "/siya/previews/preview-about.png",
    previewLabel: "Behind the Camera",
  },
  {
    index: "05",
    title: "Contact",
    href: "#contact",
    previewSrc: "/siya/previews/preview-contact.png",
    previewLabel: "Direct Inquiry",
  },
];

export function FloatingNavAndMenu({
  onRequestMediaKit: _onRequestMediaKit,
  onNavigateSection,
}: {
  onRequestMediaKit: (packageName?: string) => void;
  onNavigateSection?: (href: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(0);
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
    if (isOpen) {
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
  }, [isOpen]);

  const navigateWithCurtain = (href: string) => {
    setIsOpen(false);
    if (onNavigateSection) {
      onNavigateSection(href);
    } else {
      window.setTimeout(() => {
        scrollTo(href, true);
      }, 220);
    }
  };

  return (
    <>
      {/* High-Contrast Smoked Frosted Glass Top-Center Capsule */}
      <header className="fixed top-4 left-1/2 z-[120] -translate-x-1/2 sm:top-5">
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(18, 10, 15, 0.88) 0%, rgba(9, 6, 9, 0.94) 100%)",
            backdropFilter: "blur(24px) saturate(190%)",
            WebkitBackdropFilter: "blur(24px) saturate(190%)",
            transform: "translate3d(0,0,0)",
            backfaceVisibility: "hidden",
          }}
          className="glass-nav-capsule flex items-center gap-1 rounded-full border border-white/22 p-1 text-xs whitespace-nowrap shadow-[0_18px_44px_rgba(0,0,0,0.88),inset_0_1px_0_rgba(255,255,255,0.35)]"
        >
          <button
            type="button"
            data-cursor-box
            onClick={() => {
              setHoveredIdx(0);
              setIsOpen(true);
            }}
            aria-expanded={isOpen}
            aria-controls="fullscreen-menu-overlay"
            className="group inline-flex items-center gap-2 rounded-full px-4 py-2 font-sans font-semibold whitespace-nowrap text-white transition-colors hover:bg-white/12"
          >
            <svg
              viewBox="0 0 12 12"
              aria-hidden="true"
              className="h-3 w-3 shrink-0 fill-current text-white transition-transform duration-300 group-hover:rotate-90"
            >
              <circle cx="3" cy="3" r="1.3" />
              <circle cx="9" cy="3" r="1.3" />
              <circle cx="3" cy="9" r="1.3" />
              <circle cx="9" cy="9" r="1.3" />
            </svg>
            <KineticTypewriter text="Menu" speedMs={28} replayOnHover />
          </button>

          <span className="h-3.5 w-[1px] shrink-0 bg-white/20" aria-hidden="true" />

          <button
            type="button"
            data-cursor-box
            onClick={() => navigateWithCurtain("#services")}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-sans text-xs font-medium whitespace-nowrap text-white/90 transition-colors hover:bg-white/12 hover:text-white"
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-[#ff7e6b] shadow-[0_0_8px_#ff7e6b]"
            />
            <KineticTypewriter
              text="Open for Collaborations · View Rates"
              speedMs={18}
              replayOnHover
            />
          </button>
        </div>
      </header>

      {/* 120fps GPU-Composited 4-Sided Inset Menu Overlay */}
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            id="fullscreen-menu-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[150] flex p-2.5 will-change-[opacity] sm:p-4 md:p-5"
            style={{
              background: "rgba(5, 3, 5, 0.42)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.985, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.99, opacity: 0, y: 6 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background:
                  "radial-gradient(circle at 76% 24%, rgba(72, 18, 38, 0.34) 0%, rgba(11, 7, 10, 0.96) 54%, rgba(6, 5, 7, 0.985) 100%)",
                transform: "translate3d(0,0,0)",
                backfaceVisibility: "hidden",
              }}
              className="relative flex h-full w-full flex-col justify-between overflow-y-auto rounded-[24px] border border-white/16 px-6 py-6 text-white shadow-[0_32px_100px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.22)] will-change-transform sm:rounded-[30px] sm:px-10 sm:py-8 lg:px-14"
            >
              {/* Top Bar: Minimal "Menu" Label + White Close Pill */}
              <div className="relative z-20 flex items-center justify-between gap-4">
                <span className="font-sans text-xs font-semibold tracking-tight text-white/90 sm:text-sm">
                  Menu
                </span>

                <button
                  type="button"
                  data-cursor-box
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 font-sans text-xs font-semibold text-[#080808] shadow-lg transition-transform duration-200 hover:scale-[1.04]"
                >
                  <span>Close</span>
                  <span aria-hidden="true" className="text-[11px]">
                    ✕
                  </span>
                </button>
              </div>

              {/* Center: Monumental Left-Aligned Navigation + Pre-Mounted GPU Shoulder Previews */}
              <div className="relative z-10 my-auto py-4">
                <nav
                  aria-label="Fullscreen Navigation"
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="flex flex-col items-start"
                >
                  {MENU_ITEMS.map((item, idx) => {
                    const isHovered = hoveredIdx === idx;
                    const isDimmed = hoveredIdx !== null && hoveredIdx !== idx;

                    return (
                      <button
                        key={item.href}
                        type="button"
                        data-menu-item
                        onMouseEnter={() => setHoveredIdx(idx)}
                        onFocus={() => setHoveredIdx(idx)}
                        onClick={() => navigateWithCurtain(item.href)}
                        className="group relative flex items-start gap-5 py-0.5 text-left will-change-transform sm:gap-9"
                      >
                        <span className="mt-3 font-mono text-[10px] text-white/35 sm:mt-4">
                          {item.index}
                        </span>

                        <span className="relative inline-flex items-center">
                          <span
                            style={{ fontSize: "clamp(2.5rem, 6.6vw, 5.5rem)" }}
                            className={`font-display leading-[0.96] font-semibold tracking-[-0.045em] transition-[color,transform] duration-200 ease-out will-change-transform ${
                              isDimmed
                                ? "translate-x-0 text-white/25"
                                : isHovered
                                  ? "translate-x-1.5 text-white"
                                  : "translate-x-0 text-white"
                            }`}
                          >
                            {item.title}
                          </span>

                          {/* Pre-Mounted GPU-Composited Shoulder Badge ([↗] + [GO]) + Live Section Preview */}
                          <span
                            aria-hidden={!isHovered}
                            style={{
                              transform: isHovered
                                ? "translate3d(0px, 0px, 0px) scale3d(1, 1, 1)"
                                : "translate3d(-10px, 4px, 0px) scale3d(0.94, 0.94, 1)",
                              opacity: isHovered ? 1 : 0,
                              backfaceVisibility: "hidden",
                            }}
                            className="pointer-events-none relative ml-3 inline-flex items-center transition-[transform,opacity] duration-200 ease-out will-change-[transform,opacity] sm:ml-4"
                          >
                            {/* Floating Real Section Screenshot Thumbnail */}
                            <span className="relative hidden sm:inline-block">
                              <span className="relative -mt-10 ml-3 block h-32 w-52 overflow-hidden rounded-[20px] border border-white/22 bg-[#12090e] p-1 shadow-[0_24px_60px_rgba(0,0,0,0.92)] lg:h-36 lg:w-60">
                                <span className="relative block h-full w-full overflow-hidden rounded-[15px]">
                                  <Image
                                    src={item.previewSrc}
                                    alt={`${item.title} section preview`}
                                    fill
                                    priority
                                    sizes="240px"
                                    className="object-cover object-top"
                                  />
                                  <span className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                                </span>
                              </span>

                              {/* Overlapping [↗] + [GO] Pills on Bottom-Left Corner */}
                              <span className="absolute -bottom-1 -left-2 z-20 inline-flex items-center gap-1.5">
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[11px] font-bold text-[#080808] shadow-lg">
                                  ↗
                                </span>
                                <span className="rounded-full border border-white/22 bg-[#141115]/95 px-2.5 py-1 font-mono text-[9px] font-semibold tracking-wider text-white/95 uppercase shadow-lg">
                                  GO
                                </span>
                              </span>
                            </span>

                            {/* Compact [↗] Pill for Mobile Screens */}
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-[#080808] shadow-lg sm:hidden">
                              ↗
                            </span>
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Minimal Bar */}
              <div className="relative z-20 flex flex-wrap items-end justify-between gap-5 border-t border-white/10 pt-4 text-xs">
                <div>
                  <p className="text-[11px] text-white/40">Say hello</p>
                  <a
                    href={`mailto:${CONTENT.profile.email}?cc=${CONTENT.profile.ccEmail}&subject=${encodeURIComponent(
                      "Brand Collaboration Inquiry — Siya Pawar (@heartsfromsiya)"
                    )}`}
                    data-cursor-box
                    className="mt-0.5 inline-block font-sans text-xs font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:text-[#f5b88f]"
                  >
                    {CONTENT.profile.email}
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-white/65 sm:gap-6">
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
                  <button
                    type="button"
                    onClick={() => navigateWithCurtain("/copyright")}
                    data-cursor-box
                    className="text-[#f5b88f] transition-colors hover:text-white"
                  >
                    Copyright &amp; IP
                  </button>
                </div>

                <div className="font-mono text-[11px] text-white/65">
                  {localTime} · Pune, India
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
