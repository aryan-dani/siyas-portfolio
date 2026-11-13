"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const LOOPS = 3;

/**
 * Infinite horizontal carousel: three copies of `items`, snap-centred, with
 * seamless jump when the active card crosses a set boundary.
 */
export function useLoopCarousel<T>(items: readonly T[], bootLogical = 0) {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const jumpingRef = useRef(false);
  const [active, setActive] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const looped = useMemo(
    () => Array.from({ length: LOOPS }, () => items).flat(),
    [items],
  );

  const measureSetWidth = useCallback(() => {
    if (items.length === 0) return 0;
    const first = cardRefs.current[0];
    const nextSet = cardRefs.current[items.length];
    if (first && nextSet) return nextSet.offsetLeft - first.offsetLeft;
    const gap = 18;
    return items.length * ((first?.offsetWidth ?? 240) + gap);
  }, [items.length]);

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
      const index =
        items.length + ((logical % items.length) + items.length) % items.length;
      const card = cardRefs.current[index];
      if (!card) return;
      centerCard(card, behavior);
    },
    [centerCard, items.length],
  );

  const syncActive = useCallback(() => {
    const track = trackRef.current;
    if (!track || jumpingRef.current || items.length === 0) return;

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

    setActive(best % items.length);
    setActiveCardIndex(best);

    const setWidth = measureSetWidth();
    if (setWidth <= 0) return;

    if (best < items.length) {
      jumpingRef.current = true;
      track.scrollLeft += setWidth;
      requestAnimationFrame(() => {
        jumpingRef.current = false;
      });
    } else if (best >= items.length * 2) {
      jumpingRef.current = true;
      track.scrollLeft -= setWidth;
      requestAnimationFrame(() => {
        jumpingRef.current = false;
      });
    }
  }, [measureSetWidth, items.length]);

  const scrollByCard = useCallback(
    (dir: -1 | 1) => {
      scrollToLogical(active + dir);
    },
    [active, scrollToLogical],
  );

  const setCardRef = useCallback((index: number, el: HTMLElement | null) => {
    cardRefs.current[index] = el;
  }, []);

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
      scrollToLogical(bootLogical, "auto");
      syncActive();
    }, 80);

    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
      ro.disconnect();
      window.clearTimeout(boot);
    };
  }, [items.length, scrollToLogical, syncActive, bootLogical]);

  return {
    trackRef,
    looped,
    active,
    activeCardIndex,
    scrollByCard,
    scrollToLogical,
    setCardRef,
    cardRefs,
  };
}
