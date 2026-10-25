"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { CONTENT } from "@/lib/content";
import { prefersReducedMotionNow } from "@/lib/hooks";
import { useInquiry } from "@/lib/inquiry";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";
import { Reveal, RevealImage, RevealText, ScriptWipe } from "@/components/motion/Reveal";

function useLocalTime(timeZone: string) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-IN", {
      timeZone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const tick = () => setTime(fmt.format(new Date()).toUpperCase());
    tick();
    const id = window.setInterval(tick, 20_000);
    return () => window.clearInterval(id);
  }, [timeZone]);
  return time;
}

export function Hero() {
  const { hero, profile, photos } = CONTENT;
  const sectionRef = useRef<HTMLElement>(null);
  const time = useLocalTime(profile.timezone);
  const { scrollTo } = useSmoothScroll();
  const { select } = useInquiry();

  /* Scroll: the lettering parts a little and the portrait opens up. */
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || prefersReducedMotionNow()) return;

      const left = section.querySelector("[data-part='left']");
      const right = section.querySelector("[data-part='right']");
      const photo = section.querySelector("[data-part='photo']");
      const frame = section.querySelector("[data-part='frame']");

      const mm = gsap.matchMedia();
      mm.add(
        { wide: "(min-width: 768px)", narrow: "(max-width: 767px)" },
        (ctx) => {
          const wide = ctx.conditions?.wide;
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 0.7,
            },
          });
          tl.to(left, { x: wide ? "-7vw" : "-4vw" }, 0)
            .to(right, { x: wide ? "7vw" : "4vw" }, 0)
            .to(frame, { scale: wide ? 1.16 : 1.08, yPercent: -3 }, 0)
            .to(photo, { scale: 1.12 }, 0);
          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        }
      );
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  // Keep triggers honest once the portrait has its real size.
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-label="Introduction"
      data-theme-section="cream"
      className="hero"
    >
      <h1 className="sr-only">
        {profile.fullName}: creator and storyteller based in {profile.location}.
      </h1>

      <div className="hero-stage" aria-hidden="true">
        <div className="hero-row">
          <div className="hero-side hero-side--left" data-part="left">
            <RevealText
              as="span"
              by="chars"
              trigger="intro"
              duration={1.5}
              stagger={0.1}
              className="hero-letters type-display"
            >
              {hero.left}
            </RevealText>
            <ScriptWipe
              as="span"
              trigger="intro"
              delay={0.85}
              className="hero-script type-script halo"
            >
              {hero.script}
            </ScriptWipe>
          </div>

          {/* wrapper = scroll scale; RevealImage = intro clip wipe + zoom */}
          <div className="hero-frame-wrap" data-part="frame">
            <RevealImage trigger="intro" delay={0.1} className="hero-frame" zoom={1.35}>
              <div className="hero-frame__inner">
                <div className="hero-frame__photo" data-part="photo" data-cursor="Siya">
                  <Image
                    src={photos.hero.src}
                    alt=""
                    fill
                    preload
                    quality={90}
                    sizes="(min-width: 768px) 26vw, 72vw"
                    placeholder="blur"
                    blurDataURL={photos.hero.blur}
                    className="object-cover"
                    style={{ objectPosition: "56% 24%" }}
                  />
                </div>
              </div>
            </RevealImage>
          </div>

          <div className="hero-side hero-side--right" data-part="right">
            <RevealText
              as="span"
              by="chars"
              trigger="intro"
              delay={0.2}
              duration={1.5}
              stagger={0.1}
              className="hero-letters type-display"
            >
              {hero.right}
            </RevealText>
          </div>
        </div>
      </div>

      <div className="hero-meta wrap">
        <Reveal trigger="intro" delay={1.1} className="hero-meta__where">
          <p className="type-label">{profile.location}</p>
          <p className="type-label tabular-nums opacity-80" aria-live="off">
            {time ? `${time} IST` : "\u00A0"}
          </p>
        </Reveal>

        <Reveal trigger="intro" delay={1.2} className="hero-meta__roles">
          <p className="type-label">{hero.roles}</p>
        </Reveal>

        <Reveal trigger="intro" delay={1.3} className="hero-meta__cta">
          <p className="type-label flex items-center gap-3">
            <span aria-hidden="true" className="hero-dot" />
            {profile.status}
          </p>
          <a
            href="#contact"
            className="btn has-roll"
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
    </section>
  );
}
