"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CONTENT } from "@/lib/content";
import { useSmoothScroll } from "@/components/motion/SmoothScrollProvider";
import {
  AnimatedHairline,
  KineticTypewriter,
  RefractivePlate,
} from "@/components/motion/IglooMotionPrimitives";
import { usePrefersReducedMotion } from "@/lib/hooks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PACKAGE_OPTIONS = [
  {
    value: "single-reel",
    label: "3-Reel Starter — ₹8,000",
    sub: "3 custom concepts, scripts, shoots & edits for brand/ad usage",
    subjectPrefix: "Inquiry: 3-Reel Starter (₹8,000)",
  },
  {
    value: "account-management",
    label: "Monthly Account Management — ₹24,000 / mo (Adjustable)",
    sub: "Full monthly strategy, scripting, shooting & editing (adjustable to what you require)",
    subjectPrefix:
      "Inquiry: Monthly Account Management (₹24,000/mo · Adjustable)",
  },
  {
    value: "multi-reel-campaign",
    label: "Multi-Reel Pack — ₹8,000 / 3 · +₹2,000 each extra",
    sub: "4 = ₹10k · 5 = ₹12k · scaled creator storytelling & hook variations",
    subjectPrefix:
      "Inquiry: Multi-Reel Pack (₹8,000/3 · +₹2,000/extra)",
  },
  {
    value: "media-kit",
    label: "2026 Media Kit & Custom Brand Collaboration",
    sub: "Full audience insights, custom deliverables & brand partnership",
    subjectPrefix: "Inquiry: 2026 Media Kit & Custom Brand Collaboration",
  },
];

export function ContactSection({
  selectedPackage,
  prefilledNote,
  formInputRef,
  onNavigateSection,
}: {
  selectedPackage: string;
  prefilledNote?: string;
  perkCode: string | null;
  formInputRef: React.RefObject<HTMLInputElement | null>;
  onNavigateSection?: (href: string) => void;
}) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [packageChoice, setPackageChoice] = useState(
    selectedPackage || "single-reel"
  );
  const [customSubject, setCustomSubject] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [licenseOpen, setLicenseOpen] = useState(false);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const FOOTER_HANDLE_TEXT = "@HEARTSFROMSIYA";
  const [footerTypedChars, setFooterTypedChars] = useState<number>(
    FOOTER_HANDLE_TEXT.length
  );
  const [footerIsTyping, setFooterIsTyping] = useState(false);
  const footerTypingIntervalRef = useRef<number | null>(null);
  const footerLastReplayRef = useRef<number>(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const consoleRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const footerWordmarkRef = useRef<HTMLDivElement | null>(null);

  const { scrollTo } = useSmoothScroll();
  const reducedMotion = usePrefersReducedMotion();

  const startFooterTyping = React.useCallback(() => {
    if (reducedMotion) return;
    if (footerTypingIntervalRef.current !== null) {
      window.clearInterval(footerTypingIntervalRef.current);
    }
    setFooterIsTyping(true);
    setFooterTypedChars(0);
    let count = 0;
    footerTypingIntervalRef.current = window.setInterval(() => {
      count += 1;
      setFooterTypedChars(count);
      if (count >= FOOTER_HANDLE_TEXT.length) {
        if (footerTypingIntervalRef.current !== null) {
          window.clearInterval(footerTypingIntervalRef.current);
          footerTypingIntervalRef.current = null;
        }
        setFooterIsTyping(false);
        footerLastReplayRef.current = performance.now();
      }
    }, 42);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !footerWordmarkRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          observer.disconnect();
          startFooterTyping();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(footerWordmarkRef.current);
    return () => {
      observer.disconnect();
      if (footerTypingIntervalRef.current !== null) {
        window.clearInterval(footerTypingIntervalRef.current);
      }
    };
  }, [reducedMotion, startFooterTyping]);

  useEffect(() => {
    if (selectedPackage) {
      const normalized = selectedPackage.toLowerCase();
      const matched = PACKAGE_OPTIONS.find(
        (o) =>
          o.value === normalized ||
          normalized.includes(o.value) ||
          o.label.toLowerCase().includes(normalized)
      );
      setPackageChoice(matched ? matched.value : "single-reel");
      setCustomSubject(null);
    }
  }, [selectedPackage]);

  useEffect(() => {
    if (prefilledNote) {
      setNote(prefilledNote);
    }
  }, [prefilledNote]);

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
        setLicenseOpen(false);
      }
    };
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
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

      if (consoleRef.current) {
        gsap.fromTo(
          consoleRef.current,
          { y: 28, opacity: 0, scale: 0.985 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.95,
            ease: "power3.out",
            scrollTrigger: {
              trigger: consoleRef.current,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTENT.profile.email);
    } catch {
      // Fallback
    }
    setCopiedEmail(true);
    window.setTimeout(() => setCopiedEmail(false), 2600);
  };

  const activePackageOption =
    PACKAGE_OPTIONS.find((o) => o.value === packageChoice) ||
    PACKAGE_OPTIONS[0];

  const autoSubject = name.trim()
    ? `${activePackageOption.subjectPrefix} — ${name.trim()}`
    : `${activePackageOption.subjectPrefix} — Siya Pawar (@heartsfromsiya)`;

  const finalSubject = customSubject !== null ? customSubject : autoSubject;

  const mailtoHref = `mailto:${CONTENT.profile.email}?cc=${
    CONTENT.profile.ccEmail
  }&subject=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(
    `Hi Siya,\n\nName / Brand: ${name || "Brand Partner"}\nWork Email: ${
      email || "—"
    }\nSelected Collaboration: ${
      activePackageOption.label
    }\n\nProject Brief & Timeline:\n${
      note || "Looking forward to discussing this collaboration!"
    }\n`
  )}`;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (typeof window !== "undefined") {
      window.location.href = mailtoHref;
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-label="Contact Siya Pawar and Book Collaboration"
      className="relative overflow-hidden bg-transparent pt-20 pb-12 text-[#FAF6F2] sm:pt-28 sm:pb-16 md:pt-36 md:pb-20"
    >
      <div className="mx-auto max-w-[1380px] px-5 sm:px-10 lg:px-16">
        <AnimatedHairline />

        <div className="grid grid-cols-1 gap-12 pt-12 sm:pt-16 lg:grid-cols-12 lg:items-start lg:gap-14">
          {/* Left Column (5 Cols): Direct Contact & Frosted Glass Email Vessel */}
          <div className="flex flex-col justify-between lg:col-span-5">
            <div>
              <span className="glass-pill inline-flex items-center gap-2 rounded-full px-3.5 py-1 font-mono text-[11px] text-white/80">
                <KineticTypewriter
                  text="(05) · Direct Collaborations"
                  speedMs={22}
                />
              </span>

              <h2
                ref={headlineRef}
                className="mt-4 font-display text-[clamp(2.15rem,5vw,4.4rem)] leading-[1.06] font-semibold tracking-[-0.04em] text-white will-change-transform"
              >
                Let&apos;s make something people{" "}
                <em className="font-serif font-normal italic text-[#f5b88f] pr-1.5">
                  watch
                </em>
                .
              </h2>

              <p className="mt-5 max-w-md font-sans text-sm leading-relaxed text-white/70">
                Whether you&apos;re launching a product, scaling a consumer
                brand, or looking for monthly content management—select your
                collaboration below and drop a note.
              </p>

              {/* Frosted Glass Direct Email Card */}
              <div className="mt-8 sm:mt-9">
                <RefractivePlate maxTilt={2.0} className="glass-card p-5 sm:p-6">
                  <p className="text-xs text-white/55">Direct creator inbox</p>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <a
                      href={mailtoHref}
                      data-cursor-box
                      className="break-all font-display text-lg font-semibold tracking-[-0.02em] text-white transition-colors hover:text-[#f5b88f] sm:break-normal sm:text-xl"
                    >
                      {CONTENT.profile.email}
                    </a>
                    <button
                      type="button"
                      data-cursor-box
                      onClick={handleCopyEmail}
                      className="glass-pill rounded-full px-4 py-1.5 text-[11px] font-medium text-white hover:bg-white hover:text-[#080708]"
                    >
                      {copiedEmail ? "Copied ✓" : "Copy Email"}
                    </button>
                  </div>
                </RefractivePlate>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-2.5 text-xs sm:mt-8 sm:gap-3">
              <a
                href={CONTENT.profile.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-box
                className="glass-pill rounded-full px-4 py-2 text-white/85 hover:text-white"
              >
                Instagram ({CONTENT.profile.handle}) ↗
              </a>
              <a
                href={CONTENT.profile.instagramDumpUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-box
                className="glass-pill rounded-full px-4 py-2 text-white/85 hover:text-white"
              >
                {CONTENT.profile.secondaryHandle} ↗
              </a>
              <a
                href={CONTENT.profile.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-box
                className="glass-pill rounded-full px-4 py-2 text-white/85 hover:text-white"
              >
                YouTube ↗
              </a>
            </div>
          </div>

          {/* Right Column (7 Cols): Signature Frosted Glass Inquiry Console with Auto-Filled Subject */}
          <div ref={consoleRef} className="will-change-transform lg:col-span-7">
            <RefractivePlate maxTilt={1.4} className="glass-card p-6 sm:p-9 lg:p-10">
              {submitted ? (
                <div className="py-6">
                  <span className="glass-pill inline-flex items-center rounded-full px-3.5 py-1 text-xs text-[#f5b88f]">
                    Inquiry Prepared
                  </span>
                  <p className="mt-5 font-serif text-2xl italic text-white sm:text-3xl">
                    “Thank you for reaching out—your email draft with the
                    auto-filled subject is ready to send.”
                  </p>
                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/80">
                    <p>
                      <strong className="text-white">To:</strong>{" "}
                      {CONTENT.profile.email}
                    </p>
                    <p className="mt-1">
                      <strong className="text-white">Subject:</strong>{" "}
                      {finalSubject}
                    </p>
                  </div>
                  <div className="mt-7 flex flex-wrap items-center gap-4">
                    <a
                      href={mailtoHref}
                      data-cursor-box
                      className="rounded-full bg-white px-7 py-3 text-xs font-semibold text-[#080708] shadow-lg transition-colors hover:bg-[#f5b88f]"
                    >
                      Open in Email App ↗
                    </a>
                    <button
                      type="button"
                      data-cursor-box
                      onClick={() => setSubmitted(false)}
                      className="glass-pill rounded-full px-6 py-3 text-xs text-white/85 hover:text-white"
                    >
                      Edit Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="founder-name"
                        className="block text-xs font-medium text-white/70"
                      >
                        Your Name &amp; Brand
                      </label>
                      <input
                        ref={formInputRef}
                        id="founder-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Riya · Brand Lead"
                        className="glass-input mt-2 w-full px-4 py-3 font-sans text-base text-white placeholder:text-white/35 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="founder-email"
                        className="block text-xs font-medium text-white/70"
                      >
                        Work Email
                      </label>
                      <input
                        id="founder-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="riya@brand.com"
                        className="glass-input mt-2 w-full px-4 py-3 font-sans text-base text-white placeholder:text-white/35 sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* Smoked-Glass Custom Dropdown */}
                  <div ref={dropdownRef} className="relative">
                    <label
                      id="package-dropdown-label"
                      className="block text-xs font-medium text-white/70"
                    >
                      Collaboration Format
                    </label>

                    <button
                      type="button"
                      aria-haspopup="listbox"
                      aria-expanded={dropdownOpen}
                      aria-labelledby="package-dropdown-label"
                      data-no-magnet
                      onClick={() => setDropdownOpen((prev) => !prev)}
                      className="glass-input mt-2 flex w-full items-center justify-between px-4 py-3 text-left"
                    >
                      <div>
                        <span className="block font-sans text-sm font-medium text-white">
                          {activePackageOption.label}
                        </span>
                        <span className="mt-0.5 block font-sans text-xs text-white/50">
                          {activePackageOption.sub}
                        </span>
                      </div>

                      <span
                        aria-hidden="true"
                        className={`glass-pill ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs text-white/80 transition-transform duration-300 ${
                          dropdownOpen ? "rotate-180" : "rotate-0"
                        }`}
                      >
                        ↓
                      </span>
                    </button>

                    <AnimatePresence>
                      {dropdownOpen ? (
                        <motion.ul
                          role="listbox"
                          aria-labelledby="package-dropdown-label"
                          initial={{
                            opacity: 0,
                            y: -8,
                            scale: 0.98,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                          }}
                          exit={{
                            opacity: 0,
                            y: -6,
                            scale: 0.98,
                          }}
                          transition={{
                            duration: 0.2,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="glass-Popover absolute inset-x-0 z-50 mt-2 overflow-hidden p-2"
                        >
                          {PACKAGE_OPTIONS.map((option) => {
                            const isSelected = option.value === packageChoice;
                            return (
                              <li
                                key={option.value}
                                role="option"
                                aria-selected={isSelected}
                              >
                                <button
                                  type="button"
                                  data-no-magnet
                                  onClick={() => {
                                    setPackageChoice(option.value);
                                    setCustomSubject(null);
                                    setDropdownOpen(false);
                                  }}
                                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-all ${
                                    isSelected
                                      ? "glass-pill text-white"
                                      : "text-white/75 hover:bg-white/5 hover:text-white"
                                  }`}
                                >
                                  <div>
                                    <span className="block font-sans text-sm font-medium">
                                      {option.label}
                                    </span>
                                    <span className="mt-0.5 block font-sans text-xs text-white/50">
                                      {option.sub}
                                    </span>
                                  </div>

                                  {isSelected ? (
                                    <span className="ml-3 shrink-0 font-mono text-xs text-[#f5b88f]">
                                      ✓
                                    </span>
                                  ) : null}
                                </button>
                              </li>
                            );
                          })}
                        </motion.ul>
                      ) : null}
                    </AnimatePresence>
                  </div>

                  {/* Dynamic Auto-Filled Email Subject Line */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="inquiry-subject"
                        className="block text-xs font-medium text-white/70"
                      >
                        Subject Line
                      </label>
                      {customSubject !== null ? (
                        <button
                          type="button"
                          onClick={() => setCustomSubject(null)}
                          className="font-mono text-[10px] text-[#f5b88f] hover:underline"
                        >
                          Reset to auto-fill
                        </button>
                      ) : (
                        <span className="font-mono text-[10px] text-white/50">
                          Auto-filled
                        </span>
                      )}
                    </div>
                    <input
                      id="inquiry-subject"
                      type="text"
                      value={finalSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      className="glass-input mt-2 w-full px-4 py-3 font-mono text-base text-[#f5b88f] sm:text-xs"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="founder-note"
                      className="block text-xs font-medium text-white/70"
                    >
                      Project Note &amp; Timeline
                    </label>
                    <textarea
                      id="founder-note"
                      rows={3}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Tell me what you're launching and what deliverables you have in mind..."
                      className="glass-input mt-2 w-full resize-none px-4 py-3 font-sans text-base text-white placeholder:text-white/35 sm:text-sm"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
                    <span className="text-xs text-white/55">
                      Direct to {CONTENT.profile.email}
                    </span>
                    <button
                      type="submit"
                      data-cursor-box
                      className="inline-flex items-center rounded-full bg-white px-7 py-3 font-sans text-xs font-semibold text-[#080708] shadow-xl transition-all hover:scale-105 hover:bg-[#f5b88f]"
                    >
                      Send Inquiry →
                    </button>
                  </div>
                </form>
              )}
            </RefractivePlate>
          </div>
        </div>

        {/* ARCHITECTURAL GLASS & KINETIC STUDIO FOOTER */}
        <footer id="footer" className="mt-20 pt-10 sm:mt-28 sm:pt-12">
          <AnimatedHairline />

          {/* Giant Edge-to-Edge Signature Wordmark with Zero-Reflow Scroll + Hover Typing */}
          <div
            ref={footerWordmarkRef}
            className="glass-card mt-10 overflow-hidden px-4 py-9 text-center sm:mt-12 sm:px-6 sm:py-14"
          >
            <a
              href={CONTENT.profile.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-box
              aria-label={FOOTER_HANDLE_TEXT}
              onMouseEnter={() => {
                if (
                  !footerIsTyping &&
                  performance.now() - footerLastReplayRef.current > 1400
                ) {
                  startFooterTyping();
                }
              }}
              className="group inline-block max-w-full"
            >
              <span className="block font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase sm:tracking-[0.26em]">
                <KineticTypewriter
                  text="Siya Pawar · Pune, India · 10M+ Monthly Views"
                  speedMs={18}
                />
              </span>
              <span
                style={{ fontSize: "clamp(1.25rem, 6.2vw, 7.2rem)" }}
                className="mt-3 inline-grid items-center justify-items-start font-display leading-[1.02] font-bold tracking-[-0.045em] text-white transition-colors duration-300 group-hover:text-[#f5b88f]"
              >
                <span
                  aria-hidden="true"
                  className="invisible col-start-1 row-start-1 select-none pr-3"
                >
                  {FOOTER_HANDLE_TEXT}
                </span>
                <span className="col-start-1 row-start-1 inline-flex items-center">
                  <span>{FOOTER_HANDLE_TEXT.slice(0, footerTypedChars)}</span>
                  <span
                    aria-hidden="true"
                    className={`ml-1 inline-block h-[0.82em] w-[3px] rounded-full bg-[#f5b88f] shadow-[0_0_12px_rgba(245,184,143,0.9)] sm:w-[5px] ${
                      footerIsTyping ? "" : "opacity-80 group-hover:opacity-100"
                    }`}
                  />
                </span>
              </span>
            </a>
          </div>

          {/* Bottom Copyright, License & Developer Attribution Bar */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-center text-xs text-white/60 sm:flex-row sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <p>
                © 2026 Siya Pawar (
                <a
                  href={CONTENT.profile.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 transition-colors hover:text-white"
                >
                  {CONTENT.profile.handle}
                </a>
                ). All rights reserved.
              </p>
              <span className="text-white/25">·</span>
              <button
                type="button"
                onClick={() => setLicenseOpen((prev) => !prev)}
                className="text-white/75 underline decoration-white/25 underline-offset-4 transition-colors hover:text-[#f5b88f]"
              >
                Quick License Summary
              </button>
              <span className="text-white/25">·</span>
              <Link
                href="/copyright"
                data-cursor-box
                onClick={(e) => {
                  if (onNavigateSection) {
                    e.preventDefault();
                    onNavigateSection("/copyright");
                  }
                }}
                className="text-[#f5b88f] underline decoration-[#f5b88f]/35 underline-offset-4 transition-colors hover:text-white"
              >
                Copyright &amp; IP Dossier ↗
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:justify-end">
              <a
                href={CONTENT.profile.developerUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-box
                className="glass-pill rounded-full px-4 py-2 font-sans text-xs text-white/85 transition-colors hover:text-white"
              >
                Designed &amp; Developed by{" "}
                <strong className="font-medium text-white">
                  {CONTENT.profile.developerName}
                </strong>{" "}
                ↗
              </a>

              <button
                type="button"
                data-cursor-box
                onClick={() =>
                  onNavigateSection ? onNavigateSection("#top") : scrollTo(0)
                }
                className="glass-pill rounded-full px-4 py-2 font-sans text-xs text-white/85 hover:text-white"
              >
                Back to top ↑
              </button>
            </div>
          </div>

          {/* Expandable Frosted Glass Copyright & License Notice */}
          <AnimatePresence>
            {licenseOpen ? (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="glass-card p-5 text-xs leading-relaxed text-white/75 sm:p-6">
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                    <span className="font-mono text-[11px] font-semibold text-[#f5b88f] uppercase">
                      Copyright &amp; Intellectual Property License (2026)
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        href="/copyright"
                        onClick={(e) => {
                          if (onNavigateSection) {
                            e.preventDefault();
                            onNavigateSection("/copyright");
                          }
                        }}
                        className="glass-pill rounded-full px-3 py-1 text-[11px] text-[#f5b88f] hover:text-white"
                      >
                        Full Legal Page ↗
                      </Link>
                      <button
                        type="button"
                        onClick={() => setLicenseOpen(false)}
                        className="glass-pill rounded-full px-3 py-1 text-[11px] text-white/80 hover:text-white"
                      >
                        Close ✕
                      </button>
                    </div>
                  </div>
                  <p className="mt-3">
                    <strong className="text-white">
                      1. Media, Likeness &amp; Original Reels:
                    </strong>{" "}
                    All photographs, portraits, video reels, audio recordings,
                    captions, and the{" "}
                    <span className="text-white">@heartsfromsiya</span> /{" "}
                    <span className="text-white">@siyasideup</span> brand
                    identity are the exclusive copyright of{" "}
                    <strong className="text-white">Siya Pawar</strong> (© 2026
                    Siya Pawar. All Rights Reserved). Unauthorized reproduction,
                    redistribution, AI training, or commercial usage without
                    written licensing consent is strictly prohibited.
                  </p>
                  <p className="mt-2">
                    <strong className="text-white">
                      2. Software Architecture &amp; Design System:
                    </strong>{" "}
                    Bespoke WebGL shaders, optical glassmorphism interface, and
                    source code are engineered and licensed by{" "}
                    <a
                      href={CONTENT.profile.developerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white underline decoration-white/30 underline-offset-4 hover:text-[#f5b88f]"
                    >
                      Aryan Dani (www.aryandani.com)
                    </a>{" "}
                    under the MIT Source License (excluding creator media
                    assets).
                  </p>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </footer>
      </div>
    </section>
  );
}
