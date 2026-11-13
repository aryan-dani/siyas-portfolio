"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CONTENT } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { PhotoViewer } from "@/components/sections/PhotoViewer";

const LOOPS = 3;

type OpenState = { index: number; origin: HTMLElement };

export function Gallery() {
  const { gallery } = CONTENT;
  const photos = gallery.images;
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const frameRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const jumpingRef = useRef(false);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<OpenState | null>(null);

  const looped = useMemo(
    () => Array.from({ length: LOOPS }, () => photos).flat(),
    [photos],
  );

  const measureSetWidth = useCallback(() => {
    if (photos.length === 0) return 0;
    const first = cardRefs.current[0];
    const nextSet = cardRefs.current[photos.length];
    if (first && nextSet) return nextSet.offsetLeft - first.offsetLeft;
    const gap = 18;
    return photos.length * ((first?.offsetWidth ?? 280) + gap);
  }, [photos.length]);

  const centerCard = useCallback((card: HTMLElement, behavior: ScrollBehavior = "smooth") => {
    const track = trackRef.current;
    if (!track) return;
    const trackRect = track.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const delta =
      cardRect.left + cardRect.width / 2 - (trackRect.left + trackRect.width / 2);
    track.scrollTo({ left: track.scrollLeft + delta, behavior });
  }, []);

  const scrollToLogical = useCallback(
    (logical: number, behavior: ScrollBehavior = "smooth") => {
      const index = photos.length + ((logical % photos.length) + photos.length) % photos.length;
      const card = cardRefs.current[index];
      if (!card) return;
      centerCard(card, behavior);
    },
    [centerCard, photos.length],
  );

  const syncActive = useCallback(() => {
    const track = trackRef.current;
    if (!track || jumpingRef.current) return;

    const trackRect = track.getBoundingClientRect();
    const mid = trackRect.left + trackRect.width / 2;
    let best = 0;
    let bestDist = Infinity;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const dist = Math.abs(center - mid);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });

    setActive(best % photos.length);

    const setWidth = measureSetWidth();
    if (setWidth <= 0) return;

    if (best < photos.length) {
      jumpingRef.current = true;
      track.scrollLeft += setWidth;
      requestAnimationFrame(() => {
        jumpingRef.current = false;
      });
    } else if (best >= photos.length * 2) {
      jumpingRef.current = true;
      track.scrollLeft -= setWidth;
      requestAnimationFrame(() => {
        jumpingRef.current = false;
      });
    }
  }, [measureSetWidth, photos.length]);

  const scrollByCard = useCallback(
    (dir: -1 | 1) => {
      scrollToLogical(active + dir);
    },
    [active, scrollToLogical],
  );

  const originFor = useCallback(
    (logical: number) => {
      const mid = photos.length + ((logical % photos.length) + photos.length) % photos.length;
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

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(syncActive);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(() => syncActive());
    ro.observe(track);

    const boot = window.setTimeout(() => {
      scrollToLogical(Math.min(1, photos.length - 1), "auto");
      syncActive();
    }, 80);

    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
      ro.disconnect();
      window.clearTimeout(boot);
    };
  }, [photos.length, scrollToLogical, syncActive]);

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
            onClick={() => scrollByCard(-1)}
            aria-label="previous photos"
          >
            ‹
          </button>
          <button
            type="button"
            className="gallery__btn"
            onClick={() => scrollByCard(1)}
            aria-label="next photos"
          >
            ›
          </button>
        </Reveal>
      </div>

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
          return (
            <figure
              key={`${photo.src}-${i}`}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="gallery-card"
            >
              <button
                type="button"
                ref={(el) => {
                  frameRefs.current[i] = el;
                }}
                className="gallery-card__frame"
                data-cursor="view"
                aria-label={`view photo ${id}: ${photo.alt}`}
                onClick={(e) => handleOpen(logical, e.currentTarget)}
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
        })}
      </div>

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
