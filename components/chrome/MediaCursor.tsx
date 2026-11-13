"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION } from "@/lib/gsap";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/hooks";

/* Short labels only for media controls — socials stay as the heart chip */
const LABEL_MODES = new Set(["play", "pause", "view", "open", "close"]);

const CLICKABLE =
  'a[href], button:not([disabled]), [role="button"], summary, label[for], input[type="submit"], input[type="button"], .btn, .brand-link, .link-u, .nav-menu__link, .brand-mark, .carousel__btn, .gallery__btn, .hero-social, [data-cursor]';

const TEXT_FIELD =
  'input:not([type="submit"]):not([type="button"]):not([type="checkbox"]):not([type="radio"]):not([type="file"]):not([type="hidden"]):not([type="range"]), textarea, [contenteditable="true"]';

function resolveCursor(el: Element): {
  mode: "heart" | "label" | "beam";
  text: string;
  hot: boolean;
} {
  const field = el.closest<HTMLElement>(TEXT_FIELD);
  if (field) return { mode: "beam", text: "", hot: false };

  const explicit = el.closest<HTMLElement>("[data-cursor]");
  if (explicit) {
    const raw = (explicit.getAttribute("data-cursor") ?? "").trim();
    const lower = raw.toLowerCase();
    if (LABEL_MODES.has(lower)) {
      return { mode: "label", text: raw || "view", hot: true };
    }
    return { mode: "heart", text: "heart", hot: true };
  }

  const clickable = el.closest<HTMLElement>(CLICKABLE);
  if (clickable) return { mode: "heart", text: "heart", hot: true };
  return { mode: "heart", text: "heart", hot: false };
}

/**
 * Permanent heart cursor on fine pointers. Grows + labels on media targets;
 * hot state tints only the cursor chip — never the page background.
 * Also handles magnetic pull for `[data-magnetic]` via the same listener.
 */
export function MediaCursor() {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const heartRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const dot = dotRef.current;
      const label = labelRef.current;
      const heart = heartRef.current;
      if (!dot || !label || !heart || !fine) return;

      const root = document.documentElement;
      root.classList.add("has-heart-cursor");
      root.style.setProperty("cursor", "none", "important");
      document.body.style.setProperty("cursor", "none", "important");

      gsap.set(dot, { xPercent: -50, yPercent: -50, scale: 1, autoAlpha: 1 });
      const follow = reduced ? 0 : 0.18;
      const xTo = gsap.quickTo(dot, "x", { duration: follow, ease: "power3" });
      const yTo = gsap.quickTo(dot, "y", { duration: follow, ease: "power3" });

      let activeKey: string | null = null;
      let lastTarget: Element | null = null;
      let x = 0;
      let y = 0;
      let pressed = false;

      const magnetic = new WeakMap<
        HTMLElement,
        { xTo: gsap.QuickToFunc; yTo: gsap.QuickToFunc }
      >();
      let activeMagnetic: HTMLElement | null = null;

      const getMagnetic = (el: HTMLElement) => {
        let pair = magnetic.get(el);
        if (!pair) {
          pair = {
            xTo: gsap.quickTo(el, "x", { duration: MOTION.soft, ease: MOTION.easeSoft }),
            yTo: gsap.quickTo(el, "y", { duration: MOTION.soft, ease: MOTION.easeSoft }),
          };
          magnetic.set(el, pair);
        }
        return pair;
      };

      const releaseMagnetic = () => {
        if (!activeMagnetic) return;
        const pair = magnetic.get(activeMagnetic);
        pair?.xTo(0);
        pair?.yTo(0);
        activeMagnetic = null;
      };

      const pullMagnetic = (target: Element | null) => {
        const el = target?.closest<HTMLElement>("[data-magnetic]");
        if (!el) {
          releaseMagnetic();
          return;
        }
        if (activeMagnetic && activeMagnetic !== el) releaseMagnetic();
        activeMagnetic = el;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const strength = 0.22;
        const pair = getMagnetic(el);
        pair.xTo((x - cx) * strength);
        pair.yTo((y - cy) * strength);
      };

      const applyMode = (mode: "heart" | "label" | "beam", text: string, hot: boolean) => {
        dot.dataset.mode = mode;
        dot.dataset.hot = hot ? "1" : "0";
        label.textContent = mode === "label" ? text.toLowerCase() : "";
        label.hidden = mode !== "label";
        heart.hidden = mode !== "heart";
      };

      const retarget = (target: EventTarget | null) => {
        const el = target instanceof Element ? target : null;
        if (el === lastTarget && activeKey) return;
        lastTarget = el;
        const resolved = el
          ? resolveCursor(el)
          : { mode: "heart" as const, text: "heart", hot: false };
        const key = `${resolved.mode}:${resolved.text}:${resolved.hot ? "1" : "0"}:${pressed ? "1" : "0"}`;
        if (key === activeKey) return;
        activeKey = key;
        applyMode(resolved.mode, resolved.text, resolved.hot);
        const scale =
          resolved.mode === "beam" ? 1 : pressed ? 0.88 : resolved.hot ? 1.06 : 1;
        gsap.to(dot, {
          scale,
          duration: 0.28,
          ease: "expo.out",
          overwrite: "auto",
        });
      };

      const onMove = (e: PointerEvent) => {
        x = e.clientX;
        y = e.clientY;
        xTo(x);
        yTo(y);
        retarget(e.target);
        if (!reduced) pullMagnetic(e.target instanceof Element ? e.target : null);
      };

      let scrollTimer = 0;
      const onScroll = () => {
        if (scrollTimer) window.clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(() => {
          lastTarget = null;
          retarget(document.elementFromPoint(x, y));
        }, 120);
      };

      const onLeave = () => {
        activeKey = null;
        lastTarget = null;
        releaseMagnetic();
        applyMode("heart", "heart", false);
        gsap.to(dot, { autoAlpha: 0, duration: 0.25, ease: "expo.out", overwrite: "auto" });
      };

      const onEnter = () => {
        gsap.to(dot, { autoAlpha: 1, duration: 0.3, ease: "expo.out", overwrite: "auto" });
      };

      const onDown = () => {
        pressed = true;
        activeKey = null;
        retarget(document.elementFromPoint(x, y));
      };
      const onUp = () => {
        pressed = false;
        activeKey = null;
        retarget(document.elementFromPoint(x, y));
      };

      const onRefresh = () => {
        lastTarget = null;
        activeKey = null;
        retarget(document.elementFromPoint(x, y));
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("pointerup", onUp, { passive: true });
      window.addEventListener("siya:cursor-refresh", onRefresh);
      document.documentElement.addEventListener("mouseleave", onLeave);
      document.documentElement.addEventListener("mouseenter", onEnter);
      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("siya:cursor-refresh", onRefresh);
        if (scrollTimer) window.clearTimeout(scrollTimer);
        document.documentElement.removeEventListener("mouseleave", onLeave);
        document.documentElement.removeEventListener("mouseenter", onEnter);
        releaseMagnetic();
        root.classList.remove("has-heart-cursor");
        root.style.removeProperty("cursor");
        document.body.style.removeProperty("cursor");
      };
    },
    { dependencies: [fine, reduced] },
  );

  if (!fine) return null;

  return (
    <div ref={dotRef} aria-hidden="true" className="media-cursor" data-mode="heart" data-hot="0">
      <span ref={labelRef} className="media-cursor__label type-label" hidden />
      <span ref={heartRef} className="media-cursor__heart">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
          <path
            d="M12 19.2c-.4 0-8-4.7-8-10a4.4 4.4 0 0 1 8-2.5A4.4 4.4 0 0 1 20 9.2c0 5.3-7.6 10-8 10Z"
            fill="currentColor"
            fillOpacity="0.92"
          />
        </svg>
      </span>
    </div>
  );
}
