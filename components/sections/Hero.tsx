"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { BRAND_LINKS, CONTENT } from "@/lib/content";
import { useInquiry } from "@/lib/inquiry";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";
import { Reveal } from "@/components/motion/Reveal";

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
  const { scrollTo } = useSmoothScroll();
  const { select } = useInquiry();

  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section id="top" ref={sectionRef} aria-label="Introduction" className="hero">
      <div className="hero-layout wrap">
        <div className="hero-copy" data-part="copy">
          <h1 className="sr-only">
            {profile.fullName}: content creator based in {profile.location}.
          </h1>

          <Reveal
            as="p"
            trigger="intro"
            duration={1.45}
            y={28}
            className="hero-name"
            aria-hidden="true"
          >
            {hero.name}
          </Reveal>

          <Reveal trigger="intro" delay={0.5} className="hero-role-wrap">
            <p className="hero-role hl">{hero.role}</p>
          </Reveal>

          <Reveal trigger="intro" delay={0.7} className="hero-bio">
            {about.paragraphs.map((p) => (
              <LinkedBio key={p.slice(0, 24)} text={p} />
            ))}
          </Reveal>

          <Reveal trigger="intro" delay={0.9} className="hero-socials">
            <a
              href={`mailto:${profile.email}`}
              className="hero-social"
              aria-label="email"
              data-cursor="email"
            >
              <IconMail className="hero-social__icon" />
            </a>
            <a
              href={profile.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social"
              aria-label="instagram"
              data-cursor="instagram"
            >
              <IconInstagram className="hero-social__icon" />
            </a>
            <a
              href={profile.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social"
              aria-label="youtube"
              data-cursor="youtube"
            >
              <IconYoutube className="hero-social__icon" />
            </a>
          </Reveal>

          <Reveal trigger="intro" delay={1.05} className="hero-cta-row">
            <a
              href="#contact"
              className="btn btn--solid has-roll hero-btn"
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
          </Reveal>
        </div>

        <div className="hero-portrait" data-part="portrait">
          <Reveal trigger="intro" delay={0.2} className="hero-portrait__reveal">
            <div className="hero-portrait__figure" data-cursor="siya">
              <Image
                src={photos.hero.src}
                alt={photos.hero.alt}
                width={photos.hero.width}
                height={photos.hero.height}
                preload
                unoptimized
                sizes="(min-width: 1024px) 46vw, (min-width: 768px) 50vw, 92vw"
                placeholder="blur"
                blurDataURL={photos.hero.blur}
                className="hero-portrait__img"
              />
            </div>
          </Reveal>
        </div>
      </div>
      <div className="hero__baseline" aria-hidden="true" />
    </section>
  );
}
