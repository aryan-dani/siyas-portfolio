"use client";

import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, Flip } from "@/lib/gsap";
import type { Reel } from "@/lib/content";
import { prefersReducedMotionNow } from "@/lib/hooks";
import { useInquiry } from "@/lib/inquiry";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";

type Props = {
  reel: Reel;
  /** The card's frame: the player grows out of it and shrinks back into it. */
  originEl: HTMLElement;
  startTime: number;
  onClosed: () => void;
};

/**
 * Full-screen reel player. The frame is the SAME box as the card (via GSAP
 * Flip), grows to the centre of a burgundy stage, and plays with sound.
 * Esc / Close / backdrop click reverse the move.
 */
export function ReelPlayer({ reel, originEl, startTime, onClosed }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const uiRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const closingRef = useRef(false);

  const { lock, unlock, scrollTo } = useSmoothScroll();
  const { select } = useInquiry();
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);

  /* ----------------------------------------------------------------- open */
  useEffect(() => {
    const frame = frameRef.current;
    const backdrop = backdropRef.current;
    const ui = uiRef.current;
    const panel = panelRef.current;
    if (!frame || !backdrop || !ui) return;

    lock();
    const content = document.getElementById("content");
    const header = document.getElementById("site-header");
    if (content) content.inert = true;
    if (header) header.inert = true;
    closeBtnRef.current?.focus({ preventScroll: true });

    const panelItems = panel ? Array.from(panel.querySelectorAll("[data-player-item]")) : [];

    if (prefersReducedMotionNow()) {
      gsap.set([backdrop, ui, ...panelItems], { autoAlpha: 1 });
    } else {
      gsap.set(backdrop, { autoAlpha: 0 });
      gsap.set(ui, { autoAlpha: 0 });
      gsap.set(panelItems, { autoAlpha: 0, y: 34 });

      const finalState = Flip.getState(frame);
      Flip.fit(frame, originEl, { scale: false });

      const tl = gsap.timeline();
      tl.to(backdrop, { autoAlpha: 1, duration: 0.8, ease: "power2.out" }, 0)
        .add(Flip.to(finalState, { duration: 1.15, ease: "expo.inOut", scale: false }), 0)
        .to(ui, { autoAlpha: 1, duration: 0.6, ease: "power2.out" }, 0.95)
        .to(
          panelItems,
          { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08, ease: "expo.out" },
          0.6
        );
      tlRef.current = tl;
    }

    return () => {
      tlRef.current?.kill();
      Flip.killFlipsOf(frame);
      gsap.set(frame, { clearProps: "all" });
      unlock();
      if (content) content.inert = false;
      if (header) header.inert = false;
    };
  }, [lock, unlock, originEl]);

  /* --------------------------------------------------------------- close */
  const requestClose = useCallback(
    (after?: () => void) => {
      if (closingRef.current) return;
      closingRef.current = true;

      const frame = frameRef.current;
      const backdrop = backdropRef.current;
      const ui = uiRef.current;
      const panel = panelRef.current;

      const finish = () => {
        // The page must stop being inert BEFORE focus can return to the card.
        const content = document.getElementById("content");
        const header = document.getElementById("site-header");
        if (content) content.inert = false;
        if (header) header.inert = false;
        onClosed();
        originEl.focus({ preventScroll: true });
        after?.();
      };

      tlRef.current?.kill();
      if (prefersReducedMotionNow() || !frame || !backdrop || !ui) {
        finish();
        return;
      }

      const fade = [ui, ...(panel ? Array.from(panel.querySelectorAll("[data-player-item]")) : [])];
      const state = Flip.getState(frame);
      Flip.fit(frame, originEl, { scale: false });

      const tl = gsap.timeline({ onComplete: finish });
      tl.to(fade, { autoAlpha: 0, duration: 0.35, ease: "power2.out" }, 0)
        .add(Flip.from(state, { duration: 0.95, ease: "expo.inOut", scale: false }), 0)
        .to(backdrop, { autoAlpha: 0, duration: 0.8, ease: "power2.inOut" }, 0.2);
      tlRef.current = tl;
    },
    [onClosed, originEl]
  );

  /* --------------------------------------------------------------- video */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onMeta = () => {
      if (startTime > 0 && startTime < (v.duration || Infinity)) v.currentTime = startTime;
    };
    v.addEventListener("loadedmetadata", onMeta, { once: true });
    v.muted = false;
    v.play().catch(() => {
      // Some browsers still refuse sound: fall back to silent playback.
      v.muted = true;
      setMuted(true);
      v.play().catch(() => {});
    });
    return () => {
      v.removeEventListener("loadedmetadata", onMeta);
      v.pause();
    };
  }, [startTime]);

  useEffect(() => {
    window.dispatchEvent(new Event("siya:cursor-refresh"));
  }, [paused]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    v.currentTime = ratio * v.duration;
  };

  /* ----------------------------------------------------- keys + focus trap */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
        return;
      }
      if (e.key === " " && !(e.target instanceof HTMLButtonElement) && !(e.target instanceof HTMLAnchorElement)) {
        e.preventDefault();
        togglePlay();
        return;
      }
      if (e.key !== "Tab") return;
      const root = rootRef.current;
      if (!root) return;
      const focusables = Array.from(
        root.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [requestClose, togglePlay]);

  const inquire = () => {
    select("single-reel");
    requestClose(() => scrollTo("#contact"));
  };

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Reel ${reel.id}: ${reel.title}`}
      data-lenis-prevent
      className="player scope-dark"
    >
      <div ref={backdropRef} className="player__backdrop" onClick={() => requestClose()} />

      <button
        ref={closeBtnRef}
        type="button"
        className="player__close type-label has-roll"
        onClick={() => requestClose()}
      >
        <span className="roll" aria-hidden="true">
          <span className="roll__inner">
            <span>Close</span>
            <span>Close</span>
          </span>
        </span>
        <span className="sr-only">Close player</span>
        <span aria-hidden="true">✕</span>
      </button>

      <div className="player__stage">
        <div
          ref={frameRef}
          className="player__frame"
          data-cursor={paused ? "Play" : "Pause"}
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            src={reel.video}
            poster={reel.poster}
            className="player__video"
            loop
            playsInline
            onPlay={() => setPaused(false)}
            onPause={() => setPaused(true)}
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (barRef.current && v.duration) {
                barRef.current.style.transform = `scaleX(${v.currentTime / v.duration})`;
              }
            }}
          />

          <div ref={uiRef} className="player__ui">
            <button
              type="button"
              className="player__sound type-label"
              aria-pressed={!muted}
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
            >
              {muted ? "Sound off" : "Sound on"}
            </button>

            <span className={`player__paused ${paused ? "is-on" : ""}`} aria-hidden="true" />

            <div className="player__mobile-info">
              <p className="type-label">
                ({reel.id}) {reel.kind} · {reel.duration}
              </p>
              <p className="type-display player__mobile-title">{reel.title}</p>
              <a
                href={reel.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="type-label link-u"
                onClick={(e) => e.stopPropagation()}
              >
                Watch on Instagram ↗
              </a>
            </div>

            <div className="player__bar" onClick={seek} aria-hidden="true">
              <span ref={barRef} className="player__bar-fill" />
            </div>
          </div>
        </div>

        <div ref={panelRef} className="player__panel">
          <p data-player-item className="type-label">
            ({reel.id}) · {reel.kind} · {reel.duration} · {reel.posted}
          </p>
          <h3 data-player-item className="type-display player__title">
            {reel.title}
          </h3>
          <p data-player-item className="type-script player__caption">
            “{reel.caption}”
          </p>
          <div data-player-item className="player__actions">
            <a
              href={reel.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn has-roll"
            >
              <span className="roll" aria-hidden="true">
                <span className="roll__inner">
                  <span>Watch on Instagram</span>
                  <span>Watch on Instagram</span>
                </span>
              </span>
              <span className="sr-only">Watch on Instagram</span>
              <span className="btn__arrow" aria-hidden="true">
                ↗
              </span>
            </a>
            <button type="button" className="btn btn--solid has-roll" onClick={inquire}>
              <span className="roll" aria-hidden="true">
                <span className="roll__inner">
                  <span>Work with Siya</span>
                  <span>Work with Siya</span>
                </span>
              </span>
              <span className="sr-only">Work with Siya</span>
              <span className="btn__arrow" aria-hidden="true">
                →
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
