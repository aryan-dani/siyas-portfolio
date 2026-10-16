"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CONTENT } from "@/lib/content";
import { useSmoothScroll } from "@/components/motion/SmoothScrollProvider";
import {
  AnimatedHairline,
  RefractivePlate,
  ScrambleText,
} from "@/components/motion/IglooMotionPrimitives";
import { usePrefersReducedMotion } from "@/lib/hooks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PACKAGE_OPTIONS = [
  {
    value: "single-reel",
    label: "Single Video / Reel — ₹3,000 / reel",
    sub: "1 custom concept, script, shoot, edit + raw cut for brand/ad usage",
    subjectPrefix: "Inquiry: Single Video / Reel (₹3,000/reel)",
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
    label: "Multi-Reel Campaign Bundle — ₹3,000 × Reels",
    sub: "Multi-video creator storytelling & paid social hook variations",
    subjectPrefix: "Inquiry: Multi-Reel Campaign Bundle (₹3,000/reel)",
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
}: {
  selectedPackage: string;
  prefilledNote?: string;
  perkCode: string | null;
  formInputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [packageChoice, setPackageChoice] = useState(
    selectedPackage || "single-reel"
  );
  const [customSubject, setCustomSubject] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const consoleRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { scrollTo } = useSmoothScroll();
  const reducedMotion = usePrefersReducedMotion();

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

      if (consoleRef.current) {
        gsap.fromTo(
          consoleRef.current,
          { y: 40, opacity: 0, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.25,
            ease: "expo.out",
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
      className="relative overflow-hidden bg-transparent pt-28 pb-14 text-[#FAF5F0] md:pt-36 md:pb-20"
    >
      <div className="mx-auto max-w-[1380px] px-7 sm:px-12 lg:px-16">
        <AnimatedHairline />

        <div className="grid grid-cols-1 gap-14 pt-16 lg:grid-cols-12 lg:items-start">
          {/* Left Column (5 Cols): Direct Contact & Frosted Glass Email Vessel */}
          <div className="flex flex-col justify-between lg:col-span-5">
            <div>
              <span className="glass-pill inline-flex items-center gap-2 rounded-full px-3.5 py-1 font-mono text-[11px] text-white/75">
                (04) · Direct Collaborations
              </span>

              <h2
                ref={headlineRef}
                className="mt-4 font-display text-[clamp(2.5rem,5vw,4.4rem)] leading-[0.98] font-semibold tracking-[-0.04em] text-white will-change-transform"
              >
                Let&apos;s make something people{" "}
                <em className="font-serif font-normal italic text-[#ff8a70]">
                  watch
                </em>
                .
              </h2>

              <p className="mt-5 max-w-md font-sans text-sm leading-relaxed text-white/65">
                Whether you&apos;re launching a product, scaling a consumer
                brand, or looking for monthly content management—select your
                collaboration below and drop a note.
              </p>

              {/* Frosted Glass Direct Email Card */}
              <div className="mt-9">
                <RefractivePlate maxTilt={2.2} className="glass-card p-6">
                  <p className="text-xs text-white/50">Direct creator inbox</p>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
                    <a
                      href={mailtoHref}
                      data-cursor-box
                      className="font-display text-lg font-semibold tracking-[-0.02em] text-white transition-colors hover:text-[#ff8a70] sm:text-xl"
                    >
                      <ScrambleText
                        text={CONTENT.profile.email}
                        scrambleOnMount={false}
                        scrambleOnHover={true}
                        durationMs={340}
                      />
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

            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs">
              <a
                href={CONTENT.profile.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-box
                className="glass-pill rounded-full px-4 py-2 text-white/85 hover:text-white"
              >
                <ScrambleText
                  text={`Instagram (${CONTENT.profile.handle}) ↗`}
                  scrambleOnMount={false}
                  scrambleOnHover={true}
                  durationMs={320}
                />
              </a>
              <a
                href={CONTENT.profile.instagramDumpUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-box
                className="glass-pill rounded-full px-4 py-2 text-white/85 hover:text-white"
              >
                <ScrambleText
                  text={`${CONTENT.profile.secondaryHandle} ↗`}
                  scrambleOnMount={false}
                  scrambleOnHover={true}
                  durationMs={320}
                />
              </a>
              <a
                href={CONTENT.profile.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-box
                className="glass-pill rounded-full px-4 py-2 text-white/85 hover:text-white"
              >
                <ScrambleText
                  text="YouTube ↗"
                  scrambleOnMount={false}
                  scrambleOnHover={true}
                  durationMs={320}
                />
              </a>
            </div>
          </div>

          {/* Right Column (7 Cols): Signature Frosted Glass Inquiry Console with Auto-Filled Subject */}
          <div ref={consoleRef} className="will-change-transform lg:col-span-7">
            <RefractivePlate maxTilt={1.5} className="glass-card p-7 sm:p-10">
              {submitted ? (
                <div className="py-6">
                  <span className="glass-pill inline-flex items-center rounded-full px-3.5 py-1 text-xs text-[#ff8a70]">
                    Inquiry Prepared
                  </span>
                  <p className="mt-5 font-serif text-3xl italic text-white">
                    “Thank you for reaching out—your email draft with the
                    auto-filled subject is ready to send.”
                  </p>
                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/75">
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
                      className="rounded-full bg-white px-7 py-3 text-xs font-semibold text-[#080708] shadow-lg transition-colors hover:bg-[#ff8a70]"
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
                        className="block text-xs font-medium text-white/65"
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
                        className="glass-input mt-2 w-full px-4 py-3 font-sans text-sm text-white placeholder:text-white/30"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="founder-email"
                        className="block text-xs font-medium text-white/65"
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
                        className="glass-input mt-2 w-full px-4 py-3 font-sans text-sm text-white placeholder:text-white/30"
                      />
                    </div>
                  </div>

                  {/* Smoked-Glass Custom Dropdown */}
                  <div ref={dropdownRef} className="relative">
                    <label
                      id="package-dropdown-label"
                      className="block text-xs font-medium text-white/65"
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
                        <span className="mt-0.5 block font-sans text-xs text-white/45">
                          {activePackageOption.sub}
                        </span>
                      </div>

                      <span
                        aria-hidden="true"
                        className={`glass-pill ml-4 flex h-7 w-7 items-center justify-center rounded-full text-xs text-white/80 transition-transform duration-300 ${
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
                            filter: "blur(8px)",
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            filter: "blur(0px)",
                          }}
                          exit={{
                            opacity: 0,
                            y: -6,
                            scale: 0.98,
                            filter: "blur(6px)",
                          }}
                          transition={{
                            duration: 0.22,
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
                                      : "text-white/70 hover:bg-white/5 hover:text-white"
                                  }`}
                                >
                                  <div>
                                    <span className="block font-sans text-sm font-medium">
                                      {option.label}
                                    </span>
                                    <span className="mt-0.5 block font-sans text-xs text-white/45">
                                      {option.sub}
                                    </span>
                                  </div>

                                  {isSelected ? (
                                    <span className="ml-3 shrink-0 font-mono text-xs text-[#ff8a70]">
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
                        className="block text-xs font-medium text-white/65"
                      >
                        Subject Line
                      </label>
                      {customSubject !== null ? (
                        <button
                          type="button"
                          onClick={() => setCustomSubject(null)}
                          className="font-mono text-[10px] text-[#ff8a70] hover:underline"
                        >
                          Reset to auto-fill
                        </button>
                      ) : (
                        <span className="font-mono text-[10px] text-white/45">
                          Auto-filled
                        </span>
                      )}
                    </div>
                    <input
                      id="inquiry-subject"
                      type="text"
                      value={finalSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      className="glass-input mt-2 w-full px-4 py-3 font-mono text-xs text-[#ff9e88]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="founder-note"
                      className="block text-xs font-medium text-white/65"
                    >
                      Project Note &amp; Timeline
                    </label>
                    <textarea
                      id="founder-note"
                      rows={3}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Tell me what you're launching and what deliverables you have in mind..."
                      className="glass-input mt-2 w-full resize-none px-4 py-3 font-sans text-sm text-white placeholder:text-white/30"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
                    <span className="text-xs text-white/50">
                      Direct to {CONTENT.profile.email}
                    </span>
                    <button
                      type="submit"
                      data-cursor-box
                      className="inline-flex items-center rounded-full bg-white px-7 py-3 font-sans text-xs font-semibold text-[#080708] shadow-xl transition-all hover:scale-105 hover:bg-[#ff8a70]"
                    >
                      <ScrambleText
                        text="Send Inquiry →"
                        scrambleOnMount={false}
                        scrambleOnHover={true}
                        durationMs={320}
                      />
                    </button>
                  </div>
                </form>
              )}
            </RefractivePlate>
          </div>
        </div>

        {/* ARCHITECTURAL GLASS & KINETIC STUDIO FOOTER */}
        <footer id="footer" className="mt-28 pt-12">
          <AnimatedHairline />

          {/* Giant Edge-to-Edge Kinetic Signature Wordmark */}
          <div className="glass-card mt-12 overflow-hidden px-6 py-10 text-center sm:py-14">
            <a
              href={CONTENT.profile.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-box
              className="group inline-block"
            >
              <span className="block font-mono text-[10px] tracking-[0.26em] text-white/45 uppercase">
                Siya Pawar · Pune, India · 10M+ Monthly Views
              </span>
              <span
                style={{ fontSize: "clamp(2.4rem, 8.2vw, 7.6rem)" }}
                className="mt-3 block font-display leading-[0.9] font-bold tracking-[-0.05em] text-white transition-colors duration-300 group-hover:text-[#ff8a70]"
              >
                <ScrambleText
                  text="@HEARTSFROMSIYA"
                  scrambleOnMount={false}
                  scrambleOnHover={true}
                  durationMs={420}
                />
              </span>
            </a>
          </div>

          {/* Bottom Copyright, Back to Top & Developer Attribution Bar */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/55 sm:flex-row">
            <p>
              © 2026 Siya Pawar (
              <a
                href={CONTENT.profile.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/85 transition-colors hover:text-white"
              >
                {CONTENT.profile.handle}
              </a>
              ). All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={CONTENT.profile.developerUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-box
                className="glass-pill rounded-full px-4 py-2 font-sans text-xs text-white/80 transition-colors hover:text-white"
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
                onClick={() => scrollTo(0)}
                className="glass-pill rounded-full px-4 py-2 font-sans text-xs text-white/85 hover:text-white"
              >
                <ScrambleText
                  text="Back to top ↑"
                  scrambleOnMount={false}
                  scrambleOnHover={true}
                  durationMs={280}
                />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
