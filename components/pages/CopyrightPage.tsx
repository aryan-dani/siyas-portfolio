"use client";

import Image from "next/image";
import Link from "next/link";
import { CONTENT } from "@/lib/content";
import { CustomCursor } from "@/components/chrome/CustomCursor";
import { IglooWebGLStage } from "@/components/motion/IglooWebGLStage";
import {
  AmbientGlassBacklight,
  AnimatedHairline,
  RefractivePlate,
} from "@/components/motion/IglooMotionPrimitives";

const PERMITTED_USES = [
  "Sharing direct links to this portfolio or official @heartsfromsiya Instagram Reels",
  "Internal review by brand, agency, or founder teams evaluating creator collaborations",
  "Editorial press features or creator spotlights with clear credit to Siya Pawar (@heartsfromsiya)",
];

const PROHIBITED_USES = [
  "Downloading, re-editing, or running paid ad whitelisting on reels without an active usage license",
  "Scraping or ingesting creator photography, video (.mp4), voice, or likeness into AI / ML training sets",
  "Cloning or redistributing the custom WebGL shader stage, glassmorphism UI system, or source code",
];

const CLAUSES = [
  {
    id: "01",
    tag: "Creator Likeness & Media",
    title: "Ownership of Video Reels, Photography & Likeness",
    body: (
      <>
        All original creative works displayed on this website — including
        vertical video reels (<code>.mp4</code>), high-resolution portraits,
        audio voiceovers, hooks, captions, and storytelling frameworks featuring{" "}
        <strong className="font-medium text-white">
          {CONTENT.profile.fullName}
        </strong>{" "}
        (
        <a
          href={CONTENT.profile.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#f5b88f] underline decoration-white/25 underline-offset-4 transition-colors hover:text-white"
        >
          {CONTENT.profile.handle}
        </a>{" "}
        &amp;{" "}
        <a
          href={CONTENT.profile.instagramDumpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#f5b88f] underline decoration-white/25 underline-offset-4 transition-colors hover:text-white"
        >
          {CONTENT.profile.secondaryHandle}
        </a>
        ) — are the exclusive intellectual property of{" "}
        {CONTENT.profile.fullName}.
      </>
    ),
  },
  {
    id: "02",
    tag: "Design & Engineering",
    title: "Optical Glass UI, WebGL Shaders & Codebase",
    body: (
      <>
        The bespoke smoked-obsidian glassmorphism system, custom GLSL volumetric
        prism shader stage, choreographed motion architecture, and source code
        were designed and engineered by{" "}
        <a
          href={CONTENT.profile.developerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#f5b88f] underline decoration-white/25 underline-offset-4 transition-colors hover:text-white"
        >
          {CONTENT.profile.developerName} (www.aryandani.com)
        </a>
        . Commercial reproduction, template resale, or unauthorized copying of
        the site architecture is strictly prohibited.
      </>
    ),
  },
  {
    id: "03",
    tag: "Commercial Usage & Whitelisting",
    title: "Brand Collaborations & Paid Amplification Rights",
    body: (
      <>
        Standard creator deliverables grant organic posting rights as specified
        in each campaign scope. Paid amplification, Spark Ads, Meta
        whitelisting, dark posting, or perpetual commercial buyouts require an
        explicit written addendum with {CONTENT.profile.fullName} prior to
        campaign launch.
      </>
    ),
  },
  {
    id: "04",
    tag: "AI & Dataset Protection",
    title: "Generative AI, Voice Cloning & Scraping Prohibition",
    body: (
      <>
        No photograph, video frame, vocal track, or biometric likeness of{" "}
        {CONTENT.profile.fullName} may be harvested, scraped, synthesized, or
        used to train, fine-tune, or evaluate machine learning, deepfake, or
        generative AI models without express written consent.
      </>
    ),
  },
];

export function CopyrightPage() {
  const permissionMailto = `mailto:${CONTENT.profile.email}?cc=${
    CONTENT.profile.ccEmail
  }&subject=${encodeURIComponent(
    "Media Licensing & Commercial Usage Inquiry — Siya Pawar (@heartsfromsiya)"
  )}`;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#070608] text-[#FAF6F2]">
      <IglooWebGLStage />
      <AmbientGlassBacklight />
      <CustomCursor />

      {/* Top Floating Frosted Dossier Bar */}
      <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-3 sm:top-6 sm:px-6">
        <div className="glass-nav-capsule pointer-events-auto flex w-full max-w-[1280px] items-center justify-between gap-3 rounded-full px-3 py-2 text-xs text-[#FAF6F2] sm:px-4">
          <Link
            href="/"
            data-cursor-box
            className="inline-flex items-center gap-2.5 rounded-full bg-white/[0.08] px-4 py-2 font-sans text-xs font-medium text-white transition-colors hover:bg-white/[0.15]"
          >
            <span aria-hidden="true">←</span>
            <span>Back to Portfolio</span>
          </Link>

          <div className="hidden items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-white/60 uppercase md:flex">
            <span>Dossier · IP-2026-SP</span>
            <span className="text-white/25">/</span>
            <span className="text-[#f5b88f]">{CONTENT.profile.handle}</span>
          </div>

          <a
            href={permissionMailto}
            data-cursor-box
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#f5b88f] to-[#ff8a70] px-4 py-2 font-sans text-xs font-semibold text-[#090608] transition-transform hover:scale-[1.02]"
          >
            <span>Licensing Inquiry</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1280px] px-5 pt-28 pb-24 sm:px-10 sm:pt-34 sm:pb-32 lg:px-16">
        {/* Hero Architectural Glass Dossier Card */}
        <RefractivePlate
          maxTilt={1.5}
          className="glass-card relative overflow-hidden p-6 sm:p-10 lg:p-12"
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="glass-pill rounded-full px-3.5 py-1 font-mono text-[10px] tracking-[0.2em] text-[#f5b88f] uppercase">
                  Legal &amp; Licensing Dossier
                </span>
                <span className="glass-pill rounded-full px-3.5 py-1 font-mono text-[10px] tracking-[0.16em] text-white/70 uppercase">
                  Indian Copyright Act, 1957 · Berne Convention
                </span>
              </div>

              <h1 className="mt-5 font-display text-[clamp(2.15rem,5.2vw,4.5rem)] leading-[1.04] font-bold tracking-[-0.04em] text-white">
                Copyright &amp;{" "}
                <em className="font-serif font-normal italic text-[#f5b88f] pr-1.5">
                  Intellectual Property.
                </em>
              </h1>

              <p className="mt-4 max-w-2xl font-serif text-lg leading-relaxed text-white/80 italic sm:text-xl">
                “What is yours to enjoy, what is ours to protect — a transparent
                charter covering creator likeness, brand reels, commercial
                whitelisting, and digital architecture.”
              </p>
            </div>

            {/* Right Column: Official Rights Registry Vault */}
            <div className="glass-dock flex flex-col justify-between gap-4 p-5 sm:p-6 lg:col-span-4">
              <div className="flex items-center gap-3.5 border-b border-white/10 pb-4">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/25">
                  <Image
                    src="/siya/siya-portrait.jpg"
                    alt={CONTENT.profile.fullName}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-[0.18em] text-[#f5b88f] uppercase">
                    Primary Rights Holder
                  </p>
                  <p className="font-display text-base font-bold text-white">
                    {CONTENT.profile.fullName}
                  </p>
                  <p className="font-sans text-xs text-white/65">
                    {CONTENT.profile.handle} · Pune, India
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-white/70">
                  <span className="font-mono text-[10px] tracking-[0.14em] text-white/50 uppercase">
                    Media &amp; Likeness
                  </span>
                  <span className="font-medium text-white">
                    © 2026 {CONTENT.profile.fullName}
                  </span>
                </div>
                <div className="flex items-center justify-between text-white/70">
                  <span className="font-mono text-[10px] tracking-[0.14em] text-white/50 uppercase">
                    Architecture &amp; Code
                  </span>
                  <a
                    href={CONTENT.profile.developerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#f5b88f] underline decoration-white/25 underline-offset-4 hover:text-white"
                  >
                    {CONTENT.profile.developerName} ↗
                  </a>
                </div>
                <div className="flex items-center justify-between text-white/70">
                  <span className="font-mono text-[10px] tracking-[0.14em] text-white/50 uppercase">
                    AI Training Policy
                  </span>
                  <span className="rounded-full bg-[#ff8a70]/15 px-2.5 py-0.5 font-mono text-[10px] text-[#ff9e88]">
                    Opt-Out / Prohibited
                  </span>
                </div>
              </div>
            </div>
          </div>
        </RefractivePlate>

        {/* Permitted vs. Restricted Usage Matrix */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <p className="font-mono text-[10px] tracking-[0.2em] text-emerald-300/90 uppercase">
                  00 · Fair Sharing
                </p>
                <h2 className="mt-1 font-display text-xl font-bold tracking-[-0.02em] text-white">
                  Permitted Without Prior License
                </h2>
              </div>
              <span className="glass-pill flex h-9 w-9 items-center justify-center rounded-full text-sm text-emerald-300">
                ✓
              </span>
            </div>
            <ul className="mt-5 space-y-3.5">
              {PERMITTED_USES.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 font-sans text-sm leading-relaxed text-white/80"
                >
                  <span className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 font-mono text-[10px] text-emerald-300">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <p className="font-mono text-[10px] tracking-[0.2em] text-[#ff9e88] uppercase">
                  00 · Protected Assets
                </p>
                <h2 className="mt-1 font-display text-xl font-bold tracking-[-0.02em] text-white">
                  Restricted Without Written Consent
                </h2>
              </div>
              <span className="glass-pill flex h-9 w-9 items-center justify-center rounded-full text-sm text-[#ff9e88]">
                ✕
              </span>
            </div>
            <ul className="mt-5 space-y-3.5">
              {PROHIBITED_USES.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 font-sans text-sm leading-relaxed text-white/80"
                >
                  <span className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#ff8a70]/15 font-mono text-[10px] text-[#ff9e88]">
                    ✕
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="my-10">
          <AnimatedHairline />
        </div>

        {/* 2x2 Architectural Bento Grid for Clauses 01 - 04 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {CLAUSES.map((clause) => (
            <article
              key={clause.id}
              className="glass-card relative flex flex-col justify-between overflow-hidden p-6 sm:p-8"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="glass-pill rounded-full px-3 py-1 font-mono text-[10px] tracking-[0.18em] text-[#f5b88f] uppercase">
                  Clause {clause.id} · {clause.tag}
                </span>
                <span
                  aria-hidden="true"
                  className="font-display text-2xl font-bold tracking-[-0.04em] text-white/15"
                >
                  {clause.id}
                </span>
              </div>

              <div className="mt-5">
                <h3 className="font-display text-xl font-bold tracking-[-0.02em] text-white sm:text-2xl">
                  {clause.title}
                </h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-white/75 sm:text-[15px]">
                  {clause.body}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Clause 05 + Direct Licensing & Collaboration Bar */}
        <div className="glass-card mt-8 p-6 sm:p-10">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <span className="glass-pill rounded-full px-3 py-1 font-mono text-[10px] tracking-[0.18em] text-[#f5b88f] uppercase">
                Clause 05 · Trademarks, Jurisdiction &amp; Licensing Desk
              </span>
              <h3 className="mt-4 font-display text-2xl font-bold tracking-[-0.03em] text-white sm:text-3xl">
                Need commercial usage, paid ad rights, or brand licensing?
              </h3>
              <p className="mt-2.5 font-sans text-sm leading-relaxed text-white/75">
                Partner trademarks (including PharmEasy, Mokobara, and featured
                consumer brands) remain the property of their respective owners.
                For commercial usage clearances, whitelisting extensions, or new
                campaign bookings, reach out directly.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={permissionMailto}
                data-cursor-box
                className="rounded-full bg-gradient-to-r from-[#f5b88f] to-[#ff8a70] px-6 py-3.5 font-sans text-xs font-semibold text-[#090608] shadow-[0_14px_34px_rgba(255,138,112,0.28)] transition-transform hover:scale-[1.02]"
              >
                Request Usage License ({CONTENT.profile.email}) ↗
              </a>
              <Link
                href="/#pricing"
                data-cursor-box
                className="glass-pill rounded-full px-5 py-3.5 font-sans text-xs font-medium text-white/90 hover:text-white"
              >
                View Creator Rates →
              </Link>
            </div>
          </div>
        </div>

        {/* Editorial Footer */}
        <footer className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center text-xs text-white/60 sm:flex-row sm:text-left">
          <p>
            © 2026 {CONTENT.profile.fullName} ({CONTENT.profile.handle}). All
            rights reserved.
          </p>
          <p>
            Designed &amp; developed by{" "}
            <a
              href={CONTENT.profile.developerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:text-[#f5b88f]"
            >
              {CONTENT.profile.developerName} (www.aryandani.com)
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
