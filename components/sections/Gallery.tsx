"use client";

import Image from "next/image";
import { memo, useCallback, useRef, useState, type RefCallback } from "react";
import { CONTENT, type Photo } from "@/lib/content";
import { useLoopCarousel } from "@/lib/use-loop-carousel";
import { Reveal } from "@/components/motion/Reveal";
import { InView } from "@/components/motion/InView";
import { PhotoViewer } from "@/components/sections/PhotoViewer";

type OpenState = { index: number; origin: HTMLElement };

export function Gallery() {
  const { gallery } = CONTENT;
  const photos = gallery.images;
  const frameRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [open, setOpen] = useState<OpenState | null>(null);

  const {
    trackRef,
    looped,
    active,
    scrollByCard,
    setCardRef,
  } = useLoopCarousel(photos, Math.min(1, Math.max(0, photos.length - 1)));

  const originFor = useCallback(
    (logical: number) => {
      const mid =
        photos.length + ((logical % photos.length) + photos.length) % photos.length;
      return frameRefs.current[mid] ?? frameRefs.current[logical] ?? null;
    },
    [photos.length],
  );

  const handleOpen = useCallback((logical: number, origin: HTMLElement) => {
    setOpen({ index: logical, origin });
  }, []);

  const handleIndexChange = useCallback(
    (next: number) => {
      setOpen((prev) => {
        if (!prev) return prev;
        const origin = originFor(next) ?? prev.origin;
        return { index: next, origin };
      });
    },
    [originFor],
  );

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="section gallery">
      <div className="wrap gallery__head">
        <div className="gallery__intro">
          <Reveal>
            <p className="type-label flex items-center gap-4">
              <span>(02)</span>
              <span aria-hidden="true" className="h-px w-10 bg-[var(--fg-line)]" />
              <span>{gallery.chip}</span>
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 id="gallery-title" className="gallery__title type-display">
              {gallery.title}
            </h2>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="gallery__nav">
          <button
            type="button"
            className="gallery__btn"
            data-magnetic
            onClick={() => scrollByCard(-1)}
            aria-label="previous photos"
          >
            ‹
          </button>
          <button
            type="button"
            className="gallery__btn"
            data-magnetic
            onClick={() => scrollByCard(1)}
            aria-label="next photos"
          >
            ›
          </button>
        </Reveal>
      </div>

      <InView as="div" className="gallery__rail">
        <div
          ref={trackRef}
          className="gallery__track"
          tabIndex={0}
          aria-label="photo gallery"
          onKeyDown={(e) => {
            if (open) return;
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              scrollByCard(-1);
            } else if (e.key === "ArrowRight") {
              e.preventDefault();
              scrollByCard(1);
            }
          }}
        >
          {looped.map((photo, i) => {
            const logical = i % photos.length;
            const id = String(logical + 1).padStart(2, "0");
            const centerIndex = photos.length + active;
            const dist = Math.abs(i - centerIndex);
            return (
              <GalleryCard
                key={`${photo.src}-${i}`}
                photo={photo}
                id={id}
                logical={logical}
                stagger={Math.min(dist, 4)}
                onOpen={handleOpen}
                cardRef={(el) => setCardRef(i, el)}
                frameRef={(el) => {
                  frameRefs.current[i] = el;
                }}
              />
            );
          })}
        </div>
      </InView>

      {open ? (
        <PhotoViewer
          photos={photos}
          index={open.index}
          originEl={open.origin}
          onIndexChange={handleIndexChange}
          onClosed={() => setOpen(null)}
        />
      ) : null}
    </section>
  );
}

const GalleryCard = memo(function GalleryCard({
  photo,
  id,
  logical,
  stagger,
  onOpen,
  cardRef,
  frameRef,
}: {
  photo: Photo;
  id: string;
  logical: number;
  stagger: number;
  onOpen: (logical: number, origin: HTMLElement) => void;
  cardRef: RefCallback<HTMLElement>;
  frameRef: RefCallback<HTMLButtonElement>;
}) {
  return (
    <figure
      ref={cardRef}
      className="gallery-card"
      style={{ ["--i" as string]: stagger }}
    >
      <button
        type="button"
        ref={frameRef}
        className="gallery-card__frame"
        data-cursor="view"
        aria-label={`view photo ${id}: ${photo.alt}`}
        onClick={(e) => onOpen(logical, e.currentTarget)}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes="(min-width: 1100px) 18vw, (min-width: 768px) 28vw, 55vw"
          placeholder="blur"
          blurDataURL={photo.blur}
          quality={75}
          className="gallery-card__img"
        />
      </button>
    </figure>
  );
});
