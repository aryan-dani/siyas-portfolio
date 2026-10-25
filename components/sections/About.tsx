"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { CONTENT } from "@/lib/content";
import { prefersReducedMotionNow } from "@/lib/hooks";
import { Reveal, RevealImage } from "@/components/motion/Reveal";
import { Signature } from "@/components/motion/Signature";
import { Eyebrow, Heading } from "@/components/ui/Heading";

export function About() {
  const { about, photos } = CONTENT;
  const sectionRef = useRef<HTMLElement>(null);

  /* Desktop: the two pictures drift at slightly different speeds. */
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || prefersReducedMotionNow()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        section.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
          const amount = Number(el.dataset.parallax);
          gsap.fromTo(
            el,
            { yPercent: -amount },
            {
              yPercent: amount,
              ease: "none",
              scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.8 },
            }
          );
        });
      });
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-title"
      data-theme-section="cream"
      className="about"
    >
      <div className="wrap about__grid">
        <div className="about__media">
          <div data-parallax="3">
            <figure>
              <RevealImage className="frame about__main" zoom={1.25}>
                <div className="frame__img" data-cursor="Siya">
                  <Image
                    src={photos.about.src}
                    alt={photos.about.alt}
                    fill
                    sizes="(min-width: 768px) 38vw, 86vw"
                    placeholder="blur"
                    blurDataURL={photos.about.blur}
                    className="object-cover"
                    style={{ objectPosition: "50% 38%" }}
                  />
                </div>
              </RevealImage>
              <Reveal as="figcaption" className="type-label about__caption" y={14} delay={0.2}>
                {about.captionMain}
              </Reveal>
            </figure>
          </div>

          <div className="about__inset" data-parallax="-9">
            <figure>
              <RevealImage className="frame about__inset-frame" zoom={1.3} delay={0.25}>
                <div className="frame__img" data-cursor="Siya">
                  <Image
                    src={photos.inset.src}
                    alt={photos.inset.alt}
                    fill
                    sizes="(min-width: 768px) 18vw, 42vw"
                    placeholder="blur"
                    blurDataURL={photos.inset.blur}
                    className="object-cover"
                    style={{ objectPosition: "49% 40%" }}
                  />
                </div>
              </RevealImage>
              <Reveal as="figcaption" className="type-label about__caption" y={14} delay={0.45}>
                {about.captionInset}
              </Reveal>
            </figure>
          </div>
        </div>

        <div className="about__text">
          <Reveal>
            <Eyebrow index="03">About</Eyebrow>
          </Reveal>
          <Heading
            id="about-title"
            caps={about.title.caps}
            script={about.title.script}
            className="about__title"
          />
          <div className="about__copy">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <p className="type-body">{p}</p>
              </Reveal>
            ))}
          </div>
          <Signature className="about__signature" />
        </div>
      </div>
    </section>
  );
}
