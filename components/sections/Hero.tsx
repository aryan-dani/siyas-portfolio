"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { BRAND_LINKS, CONTENT } from "@/lib/content";
import { useInquiryActions } from "@/lib/inquiry";
import { MQ, prefersReducedMotionNow } from "@/lib/hooks";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";
import { BrowserLaunchLink } from "@/components/chrome/BrowserLaunch";
import { OutboundLink } from "@/components/chrome/NavCurtain";

function LinkedBio({ text }: { text: string }) {
  const parts = text.split(/(pharmeasy|mokobara)/gi);
  return (
    <p className="type-body hero-bio__p">
      {parts.map((part, i) => {
        const key = part.toLowerCase() as keyof typeof BRAND_LINKS;
        const href = BRAND_LINKS[key];
        if (!href) return <span key={`${part}-${i}`}>{part}</span>;
        return (
          <a
            key={`${part}-${i}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="brand-link"
          >
            {part}
          </a>
        );
      })}
    </p>
  );
}

function IconMail({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6.5h16v11H4v-11Z" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m5 7.5 7 5.5 7-5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4.5" y="4.5" width="15" height="15" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16.6" cy="7.4" r="0.9" fill="currentColor" />
    </svg>
  );
}

function IconYoutube({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21.2 8.2a2.6 2.6 0 0 0-1.8-1.9C17.6 6 12 6 12 6s-5.6 0-7.4.3A2.6 2.6 0 0 0 2.8 8.2 27 27 0 0 0 2.5 12a27 27 0 0 0 .3 3.8 2.6 2.6 0 0 0 1.8 1.9C6.4 18 12 18 12 18s5.6 0 7.4-.3a2.6 2.6 0 0 0 1.8-1.9A27 27 0 0 0 21.5 12a27 27 0 0 0-.3-3.8Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M10.4 9.6v4.8L15 12l-4.6-2.4Z" fill="currentColor" />
    </svg>
  );
}

export function Hero() {
  const { hero, profile, photos, about } = CONTENT;
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const { scrollTo } = useSmoothScroll();
  const { select } = useInquiryActions();

  /* Desktop fine-pointer scroll depth: copy drifts up, cutout drifts down under baseline. */
  useGSAP(
    () => {
      const section = sectionRef.current;
      const copy = copyRef.current;
      const portrait = portraitRef.current;
      if (!section || !copy || !portrait || prefersReducedMotionNow()) return;

      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop} and ${MQ.fine}`, () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.55,
          },
        });
        tl.to(copy, { yPercent: -12, autoAlpha: 0.15, ease: "none" }, 0).to(
          portrait,
          { yPercent: 18, ease: "none" },
          0,
        );
        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
          gsap.set([copy, portrait], { clearProps: "transform,opacity" });
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section id="top" ref={sectionRef} aria-label="Introduction" className="hero">
      <div className="hero-layout wrap">
        <div ref={copyRef} className="hero-copy">
          <h1 className="sr-only">
            {`${profile.fullName} (${profile.handle}) — Lifestyle, Fashion & UGC Content Creator in Pune`}
          </h1>

          <p
            className="hero-name hero-in hero-in--wipe"
            style={{ ["--i" as string]: 0 }}
            aria-hidden="true"
          >
            {hero.name}
          </p>

          <div className="hero-role-wrap hero-in" style={{ ["--i" as string]: 1 }}>
            <p className="hero-role hl">{hero.role}</p>
          </div>

          <div className="hero-bio hero-in" style={{ ["--i" as string]: 2 }}>
            {about.paragraphs.map((p) => (
              <LinkedBio key={p.slice(0, 24)} text={p} />
            ))}
          </div>

          <div className="hero-socials hero-in" style={{ ["--i" as string]: 3 }}>
            <OutboundLink
              href={`mailto:${profile.email}`}
              label="opening email"
              className="hero-social"
              aria-label="email"
              data-cursor="email"
              data-magnetic
            >
              <IconMail className="hero-social__icon" />
            </OutboundLink>
            <BrowserLaunchLink
              href={profile.instagramUrl}
              label="instagram"
              className="hero-social"
              aria-label="instagram"
              data-magnetic
            >
              <IconInstagram className="hero-social__icon" />
            </BrowserLaunchLink>
            <OutboundLink
              href={profile.youtubeUrl}
              label="opening youtube"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social"
              aria-label="youtube"
              data-cursor="youtube"
              data-magnetic
            >
              <IconYoutube className="hero-social__icon" />
            </OutboundLink>
          </div>

          <div className="hero-cta-row hero-in flex items-center gap-4 flex-wrap" style={{ ["--i" as string]: 4 }}>
            <a
              href="#contact"
              className="btn btn--solid has-roll hero-btn"
              data-magnetic
              onClick={(e) => {
                e.preventDefault();
                select("single-reel");
                scrollTo("#contact");
              }}
            >
              <span className="roll" aria-hidden="true">
                <span className="roll__inner">
                  <span>{hero.cta}</span>
                  <span>{hero.cta}</span>
                </span>
              </span>
              <span className="sr-only">{hero.cta}</span>
              <span className="btn__arrow" aria-hidden="true">
                →
              </span>
            </a>
            <Link
              href="/collaborate"
              className="type-label link-u text-sm font-medium opacity-90 hover:opacity-100"
              data-magnetic
            >
              hire for ugc ↗
            </Link>
          </div>
        </div>

        <div ref={portraitRef} className="hero-portrait">
          <div
            className="hero-portrait__reveal hero-in hero-in--portrait"
            style={{ ["--i" as string]: 0 }}
          >
            <div className="hero-portrait__figure" data-cursor="siya">
              <Image
                src={photos.hero.src}
                alt={photos.hero.alt}
                width={photos.hero.width}
                height={photos.hero.height}
                priority
                quality={90}
                sizes="(min-width: 1024px) 46vw, (min-width: 768px) 50vw, 92vw"
                placeholder="blur"
                blurDataURL={photos.hero.blur}
                className="hero-portrait__img"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="hero__baseline" aria-hidden="true" />
    </section>
  );
}
