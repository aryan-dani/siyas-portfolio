"use client";

import Image from "next/image";
import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefCallback,
} from "react";
import { CONTENT, type Reel } from "@/lib/content";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { useLoopCarousel } from "@/lib/use-loop-carousel";
import { InView } from "@/components/motion/InView";
import { ReelPlayer } from "@/components/sections/ReelPlayer";

type OpenState = { id: string; origin: HTMLElement; time: number };

export function ReelGallery({ reels }: { reels: readonly Reel[] }) {
  const [open, setOpen] = useState<OpenState | null>(null);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<{ id: string; stop: () => void } | null>(null);
  const { work } = CONTENT;

  const {
    trackRef,
    looped,
    activeCardIndex,
    scrollByCard,
    setCardRef,
  } = useLoopCarousel(reels);

  const saveData =
    typeof navigator !== "undefined" &&
    "connection" in navigator &&
    Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);

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

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onVis = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const openReel = open ? reels.find((r) => r.id === open.id) : undefined;
  const previewsAllowed = inView && pageVisible && !saveData;

  return (
    <>
      <InView as="div" className="carousel">
        <div ref={containerRef} className="carousel__inner">
          <div className="carousel__toolbar">
            <button
              type="button"
              className="carousel__btn"
              data-magnetic
              onClick={() => scrollByCard(-1)}
              aria-label="previous reel"
            >
              ‹
            </button>
            <button
              type="button"
              className="carousel__btn"
              data-magnetic
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
                  inView={previewsAllowed}
                  onOpen={handleOpen}
                  claimPreview={claimPreview}
                  releasePreview={releasePreview}
                  cardRef={(el) => setCardRef(i, el)}
                />
              );
            })}
          </div>
        </div>
      </InView>

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

const ReelCard = memo(function ReelCard({
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
  cardRef: RefCallback<HTMLElement>;
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
        <span
          className="carousel-card__fav"
          data-on={favourite && active ? "true" : "false"}
          aria-hidden={!(favourite && active)}
        >
          {favouriteLabel}
        </span>

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
          <span className="carousel-card__media" aria-hidden="true" />
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
});
