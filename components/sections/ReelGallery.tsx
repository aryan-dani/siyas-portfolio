"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Reel } from "@/lib/content";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/hooks";
import { Reveal, RevealImage } from "@/components/motion/Reveal";
import { ReelPlayer } from "@/components/sections/ReelPlayer";

type OpenState = { id: string; origin: HTMLElement; time: number };

export function ReelGallery({ reels }: { reels: readonly Reel[] }) {
  const [open, setOpen] = useState<OpenState | null>(null);
  const active = useRef<{ id: string; stop: () => void } | null>(null);

  /** Only one preview plays at a time. */
  const claimPreview = useCallback((id: string, stop: () => void) => {
    const current = active.current;
    if (current && current.id !== id) current.stop();
    active.current = { id, stop };
  }, []);

  const releasePreview = useCallback((id: string) => {
    if (active.current?.id === id) active.current = null;
  }, []);

  const handleOpen = useCallback((id: string, origin: HTMLElement, time: number) => {
    active.current?.stop();
    setOpen({ id, origin, time });
  }, []);

  const openReel = open ? reels.find((r) => r.id === open.id) : undefined;

  return (
    <>
      <ul className="reels" data-lenis-prevent-touch>
        {reels.map((reel, i) => (
          <li key={reel.id} className="reels__item">
            <ReelCard
              reel={reel}
              index={i}
              onOpen={handleOpen}
              claimPreview={claimPreview}
              releasePreview={releasePreview}
            />
          </li>
        ))}
      </ul>

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
  index,
  onOpen,
  claimPreview,
  releasePreview,
}: {
  reel: Reel;
  index: number;
  onOpen: (id: string, origin: HTMLElement, time: number) => void;
  claimPreview: (id: string, stop: () => void) => void;
  releasePreview: (id: string) => void;
}) {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const frameRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [live, setLive] = useState(false);

  const stop = useCallback(() => {
    videoRef.current?.pause();
  }, []);

  const start = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    // preload="none": the file is only requested once a preview is wanted.
    if (!v.getAttribute("src")) v.setAttribute("src", reel.video);
    claimPreview(reel.id, stop);
    v.muted = true;
    v.play().catch(() => {
      /* autoplay was blocked: the poster simply stays */
    });
  }, [claimPreview, reel.id, reel.video, stop]);

  /* Touch devices: silently play whichever card is mostly on screen. */
  useEffect(() => {
    if (fine || reduced) return;
    const el = frameRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) start();
        else stop();
      },
      { threshold: [0, 0.6] }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
      releasePreview(reel.id);
    };
  }, [fine, reduced, start, stop, releasePreview, reel.id]);

  /* Always pause and release when this card unmounts or its route is hidden. */
  useEffect(() => {
    const video = videoRef.current;
    return () => {
      video?.pause();
      releasePreview(reel.id);
    };
  }, [releasePreview, reel.id]);

  const delay = index * 0.12;

  return (
    <article className="reel">
      <RevealImage className="reel__frame-wrap frame" delay={delay} zoom={1.2} start="top 90%">
        <button
          ref={frameRef}
          type="button"
          className="reel__frame"
          data-cursor="Play"
          aria-label={`Play reel ${reel.id}: ${reel.title}`}
          onClick={() =>
            frameRef.current &&
            onOpen(reel.id, frameRef.current, videoRef.current?.currentTime ?? 0)
          }
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse" && !reduced) start();
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") stop();
          }}
          onFocus={() => {
            if (!reduced) start();
          }}
          onBlur={stop}
        >
          <Image
            src={reel.poster}
            alt=""
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 78vw"
            placeholder="blur"
            blurDataURL={reel.blur}
            className="reel__poster"
          />
          <video
            ref={videoRef}
            className="reel__video"
            data-live={live}
            muted
            loop
            playsInline
            preload="none"
            tabIndex={-1}
            aria-hidden="true"
            onPlaying={() => setLive(true)}
            onPause={() => setLive(false)}
          />
          <span className="reel__badge type-label" aria-hidden="true">
            {reel.id}
          </span>
          <span className="reel__play" aria-hidden="true" />
        </button>
      </RevealImage>

      <Reveal className="reel__meta" delay={delay + 0.25} start="top 94%">
        <p className="type-label reel__kind">
          <span>{reel.kind}</span>
          <span aria-hidden="true">·</span>
          <span>{reel.duration}</span>
          <span aria-hidden="true">·</span>
          <span>{reel.posted}</span>
        </p>
        <h3 className="type-display reel__title">{reel.title}</h3>
        <p className="type-body reel__caption">“{reel.caption}”</p>
      </Reveal>
    </article>
  );
}
