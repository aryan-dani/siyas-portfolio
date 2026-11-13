"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { prefersReducedMotionNow } from "@/lib/hooks";

/**
 * Marks an element `data-inview="true"` once when it scrolls into view.
 * CSS then choreographs children with `--i` delays. Under reduced motion or
 * motion-failsafe the attribute is set immediately so nothing stays hidden.
 */
export function useInView(
  options: { rootMargin?: string; threshold?: number } = {}
) {
  const ref = useRef<HTMLElement | null>(null);
  const { rootMargin = "0px 0px -8% 0px", threshold = 0.12 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotionNow()) {
      el.dataset.inview = "true";
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      el.dataset.inview = "true";
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        el.dataset.inview = "true";
        io.disconnect();
      },
      { rootMargin, threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, threshold]);

  return ref;
}

type InViewProps = {
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  rootMargin?: string;
  threshold?: number;
};

/** Wrapper that sets `data-inview` once when it enters the viewport. */
export function InView({
  as = "div",
  className,
  style,
  children,
  rootMargin,
  threshold,
}: InViewProps) {
  const ref = useInView({ rootMargin, threshold });
  const Tag = as as ElementType;
  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
