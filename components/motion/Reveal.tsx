"use client";

import { useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP, MOTION } from "@/lib/gsap";
import { fontsReady, whenIntroRevealing } from "@/lib/intro";
import { prefersReducedMotionNow } from "@/lib/hooks";

/* ---------------------------------------------------------------------------
   Reveal primitives. Each element carries data-reveal so the CSS keeps it
   hidden until GSAP is ready (no flash), then plays ONCE when it scrolls into
   view ("scroll") or when the intro lifts ("intro"). With reduced motion the
   CSS never hides anything and none of this runs.
--------------------------------------------------------------------------- */

export type Trigger = "scroll" | "intro";

/** Calls `play` when the trigger fires; returns a cleanup function. */
function arm(
  el: Element,
  trigger: Trigger,
  start: string,
  play: () => void
): () => void {
  if (trigger === "intro") return whenIntroRevealing(play);
  const st = ScrollTrigger.create({ trigger: el, start, once: true, onEnter: play });
  return () => st.kill();
}

function markRevealed(el: Element) {
  (el as HTMLElement).dataset.revealed = "true";
}

type CommonProps = {
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  delay?: number;
  trigger?: Trigger;
  start?: string;
};

/* ------------------------------------------------------------ RevealText */

type RevealTextProps = CommonProps & {
  /** What slides up from behind its mask. */
  by?: "lines" | "words" | "chars";
  duration?: number;
  stagger?: number;
};

export function RevealText({
  as = "div",
  className,
  style,
  children,
  by = "lines",
  delay = 0,
  duration = MOTION.display,
  stagger,
  trigger = "scroll",
  start = "top 88%",
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as ElementType;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotionNow()) return;

      let disposed = false;
      let fired = false;
      let disarm: (() => void) | undefined;
      let split: SplitText | undefined;

      fontsReady().then(() => {
        if (disposed) return;
        split = SplitText.create(el, {
          type: by === "chars" ? "lines,words,chars" : by === "words" ? "lines,words" : "lines",
          mask: "lines",
          autoSplit: true,
          linesClass: "split-line",
          // Leave aria untouched: SplitText's default puts an aria-label on a
          // generic element, which screen readers ignore, leaving headings
          // with only their script word as a name.
          aria: "none",
          onSplit(self) {
            disarm?.();
            disarm = undefined;
            const targets =
              by === "chars" ? self.chars : by === "words" ? self.words : self.lines;
            const tween = gsap.from(targets, {
              yPercent: 112,
              duration,
              delay,
              stagger: stagger ?? (by === "chars" ? 0.028 : MOTION.stagger),
              paused: !fired,
              onComplete: () => markRevealed(el),
            });
            gsap.set(el, { opacity: 1 });
            if (!fired) {
              disarm = arm(el, trigger, start, () => {
                fired = true;
                tween.play();
              });
            }
            return tween;
          },
        });
      });

      return () => {
        disposed = true;
        disarm?.();
        split?.revert();
      };
    },
    { scope: ref, dependencies: [by, delay, duration, stagger, trigger, start] }
  );

  return (
    <Tag ref={ref} data-reveal="text" className={className} style={style}>
      {children}
    </Tag>
  );
}

/* ----------------------------------------------------------- ScriptWipe */

/** Script words are "written" left to right: a feathered clip wipe. */
export function ScriptWipe({
  as = "span",
  className,
  style,
  children,
  delay = 0,
  trigger = "scroll",
  start = "top 92%",
}: CommonProps) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as ElementType;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotionNow()) return;

      // Generous negative insets so long swashes outside the glyph box survive.
      const from = "inset(-45% 101% -45% -35%)";
      const to = "inset(-45% -35% -45% -35%)";
      const tween = gsap.fromTo(
        el,
        { clipPath: from },
        {
          clipPath: to,
          duration: 1.9,
          delay,
          ease: "power2.inOut",
          paused: true,
          onComplete: () => {
            gsap.set(el, { clearProps: "clipPath" });
            markRevealed(el);
          },
        }
      );
      gsap.set(el, { opacity: 1 });
      const disarm = arm(el, trigger, start, () => tween.play());
      return () => disarm();
    },
    { scope: ref, dependencies: [delay, trigger, start] }
  );

  return (
    <Tag ref={ref} data-reveal="script" className={className} style={style}>
      {children}
    </Tag>
  );
}

/* --------------------------------------------------------------- Reveal */

type RevealProps = CommonProps & {
  y?: number;
  duration?: number;
};

/** Fade + rise, once. */
export function Reveal({
  as = "div",
  className,
  style,
  children,
  delay = 0,
  y = 30,
  duration = 1.4,
  trigger = "scroll",
  start = "top 90%",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as ElementType;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotionNow()) return;
      // opacity (not autoAlpha): content stays in the accessibility tree
      const tween = gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          paused: true,
          onComplete: () => {
            gsap.set(el, { clearProps: "transform,opacity" });
            markRevealed(el);
          },
        }
      );
      const disarm = arm(el, trigger, start, () => tween.play());
      return () => disarm();
    },
    { scope: ref, dependencies: [delay, y, duration, trigger, start] }
  );

  return (
    <Tag ref={ref} data-reveal="fade" className={className} style={style}>
      {children}
    </Tag>
  );
}

/* ----------------------------------------------------------- RevealImage */

type RevealImageProps = CommonProps & {
  /** Initial zoom of the picture inside the frame as it is uncovered. */
  zoom?: number;
};

/**
 * A picture frame that is uncovered while the picture itself settles from a
 * slight zoom. The first child is the zoomed layer.
 *
 * It is a "curtain" reveal: the picture is painted from the start and a page-
 * coloured cover slides off it. (A clip-path or opacity reveal would keep the
 * browser from counting the picture as painted, delaying Largest Contentful
 * Paint until the animation ends.)
 */
export function RevealImage({
  as = "div",
  className,
  style,
  children,
  delay = 0,
  zoom = 1.28,
  trigger = "scroll",
  start = "top 88%",
}: RevealImageProps) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as ElementType;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotionNow()) return;
      const cover = el.querySelector<HTMLElement>(":scope > .reveal-cover");
      const inner = el.firstElementChild;
      if (!cover) return;

      const tl = gsap.timeline({
        paused: true,
        delay,
        onComplete: () => markRevealed(el),
      });
      // The cover shrinks toward the top edge, uncovering from the bottom up.
      tl.fromTo(
        cover,
        { scaleY: 1, transformOrigin: "50% 0%" },
        { scaleY: 0, duration: 1.6, ease: "expo.inOut" },
        0
      );
      if (inner && inner !== cover) {
        tl.fromTo(inner, { scale: zoom }, { scale: 1, duration: 2.2, ease: "expo.out" }, 0);
      }
      const disarm = arm(el, trigger, start, () => tl.play());
      return () => disarm();
    },
    { scope: ref, dependencies: [delay, zoom, trigger, start] }
  );

  return (
    <Tag ref={ref} data-reveal="image" className={className} style={style}>
      {children}
      <span className="reveal-cover" aria-hidden="true" />
    </Tag>
  );
}

/* ------------------------------------------------------------- DrawLine */

/** A hairline that draws itself from the left. */
export function DrawLine({
  className = "hairline",
  delay = 0,
  trigger = "scroll",
  start = "top 95%",
}: Omit<CommonProps, "as" | "children" | "style">) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotionNow()) return;
      const tween = gsap.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.8,
          delay,
          paused: true,
          onComplete: () => {
            gsap.set(el, { clearProps: "transform" });
            markRevealed(el);
          },
        }
      );
      gsap.set(el, { opacity: 1 });
      const disarm = arm(el, trigger, start, () => tween.play());
      return () => disarm();
    },
    { scope: ref, dependencies: [delay, trigger, start] }
  );

  return <div ref={ref} data-reveal="line" className={className} aria-hidden="true" />;
}
