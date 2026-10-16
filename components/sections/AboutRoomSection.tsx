"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CONTENT } from "@/lib/content";
import {
  AnimatedHairline,
  RefractivePlate,
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
    parallaxY: -10,
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
    parallaxY: 12,
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
    parallaxY: -8,
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
      }

      if (typeof window !== "undefined" && window.innerWidth >= 1024) {
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
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-label="About Siya"
      className="relative overflow-hidden bg-transparent py-20 text-[#FAF6F2] sm:py-28 md:py-36"
    >
      <div className="relative z-10 mx-auto max-w-[1380px] px-5 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <span className="glass-pill inline-flex items-center gap-2 rounded-full px-3.5 py-1 font-mono text-[11px] text-white/80">
              (03) · About Siya
            </span>
            <h2
              ref={headlineRef}
              className="mt-4 font-display text-[clamp(2.15rem,5vw,4.5rem)] leading-[1.06] font-bold tracking-[-0.04em] text-[#FAF6F2] will-change-transform"
            >
              The person{" "}
              <em className="font-serif font-normal italic text-[#f5b88f] pr-1.5">
                behind
              </em>{" "}
              the camera.
            </h2>
          </div>

          <div className="glass-card p-6 font-sans text-sm leading-[1.75] text-white/85 sm:text-base lg:col-span-5">
            <p>
              Hi, I&apos;m Siya (
              <a
                href={CONTENT.profile.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-box
                className="font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:text-[#f5b88f]"
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
        <div className="mt-14 grid grid-cols-1 gap-8 sm:mt-20 md:grid-cols-3 md:gap-7 lg:gap-10">
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
                <RefractivePlate maxTilt={3.2} className="glass-card p-2 sm:p-2.5">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[22px] border border-white/12 bg-[#10080C]">
                    <Image
                      src={moment.imageSrc}
                      alt={moment.title}
                      fill
                      sizes="(max-width: 768px) 92vw, 33vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070507]/70 via-transparent to-transparent" />

                    {/* Top Floating Frosted Glass Tag */}
                    <div className="glass-pill absolute top-3.5 left-3.5 z-20 rounded-full px-3 py-1 text-[11px] font-medium text-white/95">
                      {moment.tag}
                    </div>
                  </div>
                </RefractivePlate>
              </a>

              {/* Overlapping Frosted Glass Caption Card */}
              <figcaption className="glass-dock relative z-20 mx-2.5 -mt-7 p-4 transition-transform duration-500 ease-out group-hover:-translate-y-1 sm:mx-3 sm:-mt-8 sm:p-5">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg font-bold tracking-[-0.02em] text-white transition-colors group-hover:text-[#f5b88f] sm:text-xl">
                    {moment.title}
                  </h3>
                  <a
                    href={moment.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-box
                    className="shrink-0 font-serif text-sm italic text-[#f5b88f] hover:underline"
                  >
                    {moment.serifNote} ↗
                  </a>
                </div>
                <p className="mt-2 font-sans text-xs leading-relaxed text-white/75 sm:text-sm">
                  {moment.caption}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-20 sm:mt-28">
          <AnimatedHairline />
        </div>
      </div>
    </section>
  );
}
