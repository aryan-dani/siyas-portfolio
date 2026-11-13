"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef } from "react";
import { gsap, Flip } from "@/lib/gsap";
import type { Photo } from "@/lib/content";
import { prefersReducedMotionNow } from "@/lib/hooks";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";

type Props = {
  photos: readonly Photo[];
  index: number;
  /** The card frame the lightbox grows out of / shrinks back into. */
  originEl: HTMLElement;
  onIndexChange: (next: number) => void;
  onClosed: () => void;
};

/**
 * Full-screen gallery lightbox. Same Flip grow/shrink pattern as the reel
 * player: burgundy stage, Esc / Close / backdrop, focus trap, prev/next.
 */
export function PhotoViewer({ photos, index, originEl, onIndexChange, onClosed }: Props) {
  const photo = photos[index];
  const count = photos.length;

  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const uiRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const closingRef = useRef(false);
  const originRef = useRef(originEl);
  const indexRef = useRef(index);
  const dirRef = useRef<1 | -1>(1);
  const openedRef = useRef(false);

  const { lock, unlock } = useSmoothScroll();

  const ar = photo.width / photo.height;

  useEffect(() => {
    originRef.current = originEl;
  }, [originEl]);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  /* Preload neighbours */
  useEffect(() => {
    if (count < 2) return;
    const prev = photos[(index - 1 + count) % count];
    const next = photos[(index + 1) % count];
    [prev, next].forEach((p) => {
      if (!p) return;
      const img = new window.Image();
      img.src = p.src;
    });
  }, [index, photos, count]);

  /* ----------------------------------------------------------------- open (once per mount) */
  useEffect(() => {
    const frame = frameRef.current;
    const backdrop = backdropRef.current;
    const ui = uiRef.current;
    const panel = panelRef.current;
    const origin = originRef.current;
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
      openedRef.current = true;
    } else {
      gsap.set(backdrop, { autoAlpha: 0 });
      gsap.set(ui, { autoAlpha: 0 });
      gsap.set(panelItems, { autoAlpha: 0, y: 34 });

      const finalState = Flip.getState(frame);
      Flip.fit(frame, origin, { scale: false });

      const tl = gsap.timeline({
        onComplete: () => {
          openedRef.current = true;
        },
      });
      tl.to(backdrop, { autoAlpha: 1, duration: 0.8, ease: "power2.out" }, 0)
        .add(Flip.to(finalState, { duration: 1.15, ease: "expo.inOut", scale: false }), 0)
        .to(ui, { autoAlpha: 1, duration: 0.6, ease: "power2.out" }, 0.95)
        .to(
          panelItems,
          { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08, ease: "expo.out" },
          0.6,
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
  }, [lock, unlock]);

  /* Crossfade / slide when index changes (after open completes) */
  useEffect(() => {
    if (!openedRef.current) return;
    const wrap = imageWrapRef.current;
    const frame = frameRef.current;
    if (!wrap || !frame || prefersReducedMotionNow()) return;

    const dir = dirRef.current;
    gsap.fromTo(
      wrap,
      { xPercent: dir * 12, autoAlpha: 0.35 },
      { xPercent: 0, autoAlpha: 1, duration: 0.55, ease: "expo.out" },
    );

    const state = Flip.getState(frame);
    frame.style.setProperty("--photo-ar", String(ar));
    Flip.from(state, { duration: 0.55, ease: "expo.out", absolute: false });
  }, [index, ar]);

  /* --------------------------------------------------------------- close */
  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;

    const frame = frameRef.current;
    const backdrop = backdropRef.current;
    const ui = uiRef.current;
    const panel = panelRef.current;
    const origin = originRef.current;

    const finish = () => {
      const content = document.getElementById("content");
      const header = document.getElementById("site-header");
      if (content) content.inert = false;
      if (header) header.inert = false;
      onClosed();
      origin.focus({ preventScroll: true });
    };

    tlRef.current?.kill();
    if (prefersReducedMotionNow() || !frame || !backdrop || !ui) {
      finish();
      return;
    }

    const fade = [ui, ...(panel ? Array.from(panel.querySelectorAll("[data-player-item]")) : [])];
    const state = Flip.getState(frame);
    Flip.fit(frame, origin, { scale: false });

    const tl = gsap.timeline({ onComplete: finish });
    tl.to(fade, { autoAlpha: 0, duration: 0.35, ease: "power2.out" }, 0)
      .add(Flip.from(state, { duration: 0.95, ease: "expo.inOut", scale: false }), 0)
      .to(backdrop, { autoAlpha: 0, duration: 0.8, ease: "power2.inOut" }, 0.2);
    tlRef.current = tl;
  }, [onClosed]);

  const go = useCallback(
    (dir: -1 | 1) => {
      if (count < 2 || closingRef.current) return;
      dirRef.current = dir;
      onIndexChange((indexRef.current + dir + count) % count);
    },
    [count, onIndexChange],
  );

  /* ----------------------------------------------------- keys + focus trap + swipe */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
        return;
      }
      if (e.key !== "Tab") return;
      const root = rootRef.current;
      if (!root) return;
      const focusables = Array.from(
        root.querySelectorAll<HTMLElement>("button:not([disabled])"),
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
  }, [go, requestClose]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || count < 2) return;
    let startX = 0;
    let startY = 0;
    const onStart = (e: TouchEvent) => {
      startX = e.touches[0]?.clientX ?? 0;
      startY = e.touches[0]?.clientY ?? 0;
    };
    const onEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0]?.clientX ?? 0;
      const endY = e.changedTouches[0]?.clientY ?? 0;
      const dx = endX - startX;
      const dy = endY - startY;
      if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy)) return;
      go(dx < 0 ? 1 : -1);
    };
    root.addEventListener("touchstart", onStart, { passive: true });
    root.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      root.removeEventListener("touchstart", onStart);
      root.removeEventListener("touchend", onEnd);
    };
  }, [go, count]);

  const id = String(index + 1).padStart(2, "0");

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${id}: ${photo.alt}`}
      data-lenis-prevent
      className="player player--photo scope-dark"
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
        <span className="sr-only">Close photo</span>
        <span aria-hidden="true">✕</span>
      </button>

      {count > 1 ? (
        <>
          <button
            type="button"
            className="player__nav player__nav--prev type-label"
            aria-label="Previous photo"
            data-cursor="view"
            onClick={() => go(-1)}
          >
            ‹
          </button>
          <button
            type="button"
            className="player__nav player__nav--next type-label"
            aria-label="Next photo"
            data-cursor="view"
            onClick={() => go(1)}
          >
            ›
          </button>
        </>
      ) : null}

      <div className="player__stage">
        <div
          ref={frameRef}
          className="player__frame player__frame--photo"
          style={{ ["--photo-ar" as string]: String(ar) }}
        >
          <div ref={imageWrapRef} className="player__image-wrap">
            <Image
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(min-width: 900px) 70vw, 94vw"
              placeholder="blur"
              blurDataURL={photo.blur}
              quality={90}
              loading="eager"
              fetchPriority="high"
              className="player__image"
            />
          </div>

          <div ref={uiRef} className="player__ui">
            <div className="player__mobile-info">
              <p className="type-label">
                ({id}) · {index + 1} / {count}
              </p>
              <p className="type-display player__mobile-title">{photo.alt}</p>
            </div>
          </div>
        </div>

        <div ref={panelRef} className="player__panel">
          <p data-player-item className="type-label">
            ({id}) · photo · {index + 1} / {count}
          </p>
          <h3 data-player-item className="type-display player__title">
            {photo.alt}
          </h3>
          <p data-player-item className="type-script player__caption">
            gallery
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
