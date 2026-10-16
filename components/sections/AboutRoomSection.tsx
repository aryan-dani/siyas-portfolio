"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CONTENT } from "@/lib/content";
import {
  AnimatedHairline,
  RefractivePlate,
  ScrambleText,
} from "@/components/motion/IglooMotionPrimitives";
import { usePrefersReducedMotion } from "@/lib/hooks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STUDIO_MOMENTS = [
  {
    id: "moment-01",
    tag: "Pune, India",
    title: "5:42 pm Window Light",
    caption:
      "Glasses on, warm afternoon light, and hooks that sound like a voice note to a close friend.",
    serifNote: "golden hour is my co-director",
    imageSrc: "/siya/polaroids/polaroid-01.jpg",
    linkUrl: "https://www.instagram.com/heartsfromsiya/",
    parallaxY: -12,
  },
  {
    id: "moment-02",
    tag: "319K+ Likes on Reels",
    title: "Everyday Storytelling",
    caption:
      "“i can listen to my neighbours cooking bro” — unscripted moments that travel across millions of feeds.",
    serifNote: "@heartsfromsiya",
    imageSrc: "/siya/polaroids/polaroid-02.jpg",
    linkUrl: "https://www.instagram.com/reel/DZOY5X8oVus/",
    parallaxY: 14,
  },
  {
    id: "moment-03",
    tag: "1.8M+ Views on Reels",
    title: "Pune Monsoon Drives",
    caption:
      "“this weather❤️‍🩹” — capturing the mood, music, and people that make every frame feel alive.",
    serifNote: "@siyasideup",
    imageSrc: "/siya/polaroids/polaroid-05.jpg",
    linkUrl: "https://www.instagram.com/reel/Dak5At3oA-A/",
    parallaxY: -10,
  },
];

export function AboutRoomSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const plateRefs = useRef<Array<HTMLElement | null>>([]);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (headlineRef.current) {
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
      }

      plateRefs.current.forEach((el, idx) => {
        if (!el) return;
        const offset = STUDIO_MOMENTS[idx]?.parallaxY ?? 0;
        gsap.fromTo(
          el,
          { y: -offset },
          {
            y: offset,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-label="About Siya"
      className="relative overflow-hidden bg-transparent py-28 text-[#FAF5F0] md:py-40"
    >
      <div className="relative z-10 mx-auto max-w-[1380px] px-7 sm:px-12 lg:px-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7" style={{ perspective: "900px" }}>
            <span className="glass-pill inline-flex items-center gap-2 rounded-full px-3.5 py-1 font-mono text-[11px] text-white/75">
              (02) · About Siya
            </span>
            <h2
              ref={headlineRef}
              className="mt-4 font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.98] font-bold tracking-[-0.04em] text-[#FAF5F0] will-change-transform"
            >
              The person{" "}
              <em className="font-serif font-normal italic text-[#ff8a70]">
                behind
              </em>{" "}
              the camera.
            </h2>
          </div>

          <div className="glass-card p-6 font-sans text-sm leading-[1.75] text-white/80 sm:text-base lg:col-span-5">
            <p>
              Hi, I&apos;m Siya (
              <a
                href={CONTENT.profile.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-box
                className="font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:text-[#ff8a70]"
              >
                {CONTENT.profile.handle}
              </a>
              ). Based in Pune, I make warm, silly, and deeply relatable short
              videos—and partner with brands like PharmEasy and Mokobara to tell
              stories people genuinely want to watch.
            </p>
          </div>
        </div>

        {/* Curated 3-Column Double-Bezel Frosted Glass Frames */}
        <div className="mt-20 grid grid-cols-1 gap-10 md:grid-cols-3">
          {STUDIO_MOMENTS.map((moment, idx) => (
            <figure
              key={moment.id}
              ref={(el) => {
                plateRefs.current[idx] = el;
              }}
              className="group flex flex-col will-change-transform"
            >
              <a
                href={moment.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <RefractivePlate maxTilt={4.2} className="glass-card p-2.5">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/10 bg-[#12080B]">
                    <Image
                      src={moment.imageSrc}
                      alt={moment.title}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 420px"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090506]/65 via-transparent to-transparent" />

                    {/* Top Floating Frosted Glass Tag */}
                    <div className="glass-pill absolute top-3.5 left-3.5 z-20 rounded-full px-3 py-1 text-[11px] font-medium text-white/95">
                      {moment.tag}
                    </div>
                  </div>
                </RefractivePlate>
              </a>

              {/* Overlapping Frosted Glass Caption Card */}
              <figcaption className="glass-dock relative z-20 mx-3 -mt-8 p-5 transition-transform duration-500 ease-out group-hover:-translate-y-1">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg font-bold tracking-[-0.02em] text-white transition-colors group-hover:text-[#ff8a70] sm:text-xl">
                    <ScrambleText
                      text={moment.title}
                      scrambleOnMount={false}
                      scrambleOnHover={true}
                      durationMs={340}
                    />
                  </h3>
                  <a
                    href={moment.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-box
                    className="shrink-0 font-serif text-sm italic text-[#ff8a70] hover:underline"
                  >
                    {moment.serifNote} ↗
                  </a>
                </div>
                <p className="mt-2 font-sans text-xs leading-relaxed text-white/70 sm:text-sm">
                  {moment.caption}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-28">
          <AnimatedHairline />
        </div>
      </div>
    </section>
  );
}
