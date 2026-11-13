"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CONTENT, type Reel } from "@/lib/content";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { ReelPlayer } from "@/components/sections/ReelPlayer";

type OpenState = { id: string; origin: HTMLElement; time: number };

const LOOPS = 3;

export function ReelGallery({ reels }: { reels: readonly Reel[] }) {
  const [active, setActive] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [open, setOpen] = useState<OpenState | null>(null);
  const [inView, setInView] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<{ id: string; stop: () => void } | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const jumpingRef = useRef(false);
  const { work } = CONTENT;

  const looped = useMemo(
    () => Array.from({ length: LOOPS }, () => reels).flat(),
    [reels],
  );

  const claimPreview = useCallback((id: string, stop: () => void) => {
    const current = previewRef.current;
    if (current && current.id !== id) current.stop();
    previewRef.current = { id, stop };
  }, []);

  const releasePreview = useCallback((id: string) => {
    if (previewRef.current?.id === id) previewRef.current = null;
  }, []);

  const handleOpen = useCallback((id: string, origin: HTMLElement, time: number) => {
    previewRef.current?.stop();
    setOpen({ id, origin, time });
  }, []);

  const measureSetWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track || reels.length === 0) return 0;
    const first = cardRefs.current[0];
    const nextSet = cardRefs.current[reels.length];
    if (first && nextSet) return nextSet.offsetLeft - first.offsetLeft;
    const gap = 18;
    return reels.length * ((first?.offsetWidth ?? 240) + gap);
  }, [reels.length]);

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
      const index = reels.length + ((logical % reels.length) + reels.length) % reels.length;
      const card = cardRefs.current[index];
      if (!card) return;
      centerCard(card, behavior);
    },
    [centerCard, reels.length],
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

    setActive(best % reels.length);
    setActiveCardIndex(best);

    const setWidth = measureSetWidth();
    if (setWidth <= 0) return;

    if (best < reels.length) {
      jumpingRef.current = true;
      track.scrollLeft += setWidth;
      requestAnimationFrame(() => {
        jumpingRef.current = false;
      });
    } else if (best >= reels.length * 2) {
      jumpingRef.current = true;
      track.scrollLeft -= setWidth;
      requestAnimationFrame(() => {
        jumpingRef.current = false;
      });
    }
  }, [measureSetWidth, reels.length]);

  const scrollByCard = useCallback(
    (dir: -1 | 1) => {
      scrollToLogical(active + dir);
    },
    [active, scrollToLogical],
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
      scrollToLogical(0, "auto");
      syncActive();
    }, 80);

    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
      ro.disconnect();
      window.clearTimeout(boot);
    };
  }, [reels.length, scrollToLogical, syncActive]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const openReel = open ? reels.find((r) => r.id === open.id) : undefined;

  return (
    <>
      <div ref={containerRef} className="carousel">
        <div className="carousel__toolbar">
          <button
            type="button"
            className="carousel__btn"
            onClick={() => scrollByCard(-1)}
            aria-label="previous reel"
          >
            ‹
          </button>
          <button
            type="button"
            className="carousel__btn"
            onClick={() => scrollByCard(1)}
            aria-label="next reel"
          >
            ›
          </button>
        </div>

        <div
          ref={trackRef}
          className="carousel__track"
          tabIndex={0}
          aria-label="featured reels"
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              scrollByCard(-1);
            } else if (e.key === "ArrowRight") {
              e.preventDefault();
              scrollByCard(1);
            }
          }}
        >
          {looped.map((reel, i) => {
            const logical = i % reels.length;
            return (
              <ReelCard
                key={`${reel.id}-${i}`}
                reel={reel}
                active={i === activeCardIndex}
                favourite={logical === 0}
                favouriteLabel={work.favouriteBadge}
                inView={inView}
                onOpen={handleOpen}
                claimPreview={claimPreview}
                releasePreview={releasePreview}
                cardRef={(el) => {
                  cardRefs.current[i] = el;
                }}
              />
            );
          })}
        </div>
      </div>

      {open && openReel ? (
        <ReelPlayer
          reel={openReel}
          originEl={open.origin}
          startTime={open.time}
          onClosed={() => setOpen(null)}
        />
      ) : null}
    </>
  );
}

function ReelCard({
  reel,
  active,
  favourite,
  favouriteLabel,
  inView,
  onOpen,
  claimPreview,
  releasePreview,
  cardRef,
}: {
  reel: Reel;
  active: boolean;
  favourite: boolean;
  favouriteLabel: string;
  inView: boolean;
  onOpen: (id: string, origin: HTMLElement, time: number) => void;
  claimPreview: (id: string, stop: () => void) => void;
  releasePreview: (id: string) => void;
  cardRef: (el: HTMLElement | null) => void;
}) {
  const reduced = usePrefersReducedMotion();
  const frameRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [live, setLive] = useState(false);

  const stop = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    if (v.getAttribute("src")) {
      v.removeAttribute("src");
      v.load();
    }
  }, []);

  const start = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (!v.getAttribute("src")) v.setAttribute("src", reel.video);
    claimPreview(reel.id, stop);
    v.muted = true;
    v.play().catch(() => {});
  }, [claimPreview, reel.id, reel.video, stop]);

  useEffect(() => {
    if (reduced || !active || !inView) {
      stop();
      releasePreview(reel.id);
      return;
    }
    start();
    return () => {
      stop();
      releasePreview(reel.id);
    };
  }, [active, inView, reduced, start, stop, releasePreview, reel.id]);

  return (
    <article
      ref={cardRef}
      className="carousel-card"
      data-active={active ? "true" : "false"}
    >
      <figure className="carousel-card__figure">
        {favourite && active ? (
          <span className="carousel-card__fav">{favouriteLabel}</span>
        ) : null}

        <button
          ref={frameRef}
          type="button"
          className="carousel-card__frame"
          data-cursor="play"
          aria-label={`Play reel: ${reel.seoCaption}`}
          title={reel.seoCaption}
          aria-current={active ? "true" : undefined}
          onClick={() => {
            if (frameRef.current) {
              onOpen(reel.id, frameRef.current, videoRef.current?.currentTime ?? 0);
            }
          }}
        >
          <Image
            src={reel.poster}
            alt={reel.seoCaption}
            fill
            sizes="(min-width: 1100px) 15vw, (min-width: 768px) 22vw, 48vw"
            placeholder="blur"
            blurDataURL={reel.blur}
            className="carousel-card__poster"
          />
          <video
            ref={videoRef}
            className="carousel-card__video"
            data-live={live}
            muted
            loop
            playsInline
            preload="none"
            title={reel.seoCaption}
            tabIndex={-1}
            aria-hidden="true"
            onPlaying={() => setLive(true)}
            onPause={() => setLive(false)}
          />
          <span className="carousel-card__id" aria-hidden="true">
            {reel.id}
          </span>
        </button>

        <figcaption className="carousel-card__meta">
          <p className="type-label">
            <span>{reel.kind}</span>
            <span aria-hidden="true"> · </span>
            <span>{reel.duration}</span>
          </p>
          <h3 className="carousel-card__title">{reel.title}</h3>
          <p className="type-body carousel-card__caption">“{reel.caption}”</p>
          <p className="sr-only">{reel.seoCaption}</p>
        </figcaption>
      </figure>
    </article>
  );
}
