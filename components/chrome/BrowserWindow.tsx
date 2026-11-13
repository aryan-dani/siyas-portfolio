"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap, Flip, useGSAP } from "@/lib/gsap";
import { CONTENT } from "@/lib/content";
import { prefersReducedMotionNow, useFinePointer } from "@/lib/hooks";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";
import { useNavCurtain } from "@/components/chrome/NavCurtain";

const ADDRESS = "instagram.com/heartsfromsiya";
const PREVIEW_REELS = CONTENT.work.reels.slice(0, 3);
const PREVIEW_STATS = CONTENT.numbers.stats;

type Props = {
  url: string;
  label: string;
  originEl: HTMLElement;
  onClosed: () => void;
};

/**
 * Designed Instagram profile preview. Instagram cannot be framed, so this
 * window Flips open from the clicked link; a handoff popup then offers
 * “opening Instagram” via the nav curtain before the real tab opens.
 */
export function BrowserWindow({ url, label, originEl, onClosed }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const settleRef = useRef<HTMLDivElement>(null);
  const titleBarRef = useRef<HTMLDivElement>(null);
  const tabRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef<HTMLDivElement>(null);
  const urlRef = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const lockRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const portraitImgRef = useRef<HTMLImageElement>(null);
  const handoffRef = useRef<HTMLDivElement>(null);
  const continueBtnRef = useRef<HTMLAnchorElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const closingRef = useRef(false);
  const enteredRef = useRef(false);

  const { lock, unlock } = useSmoothScroll();
  const { openOutbound } = useNavCurtain();
  const fine = useFinePointer();
  const coarse = !fine;
  const { profile, photos } = CONTENT;

  /* ----------------------------------------------------------------- open */
  useEffect(() => {
    const chrome = chromeRef.current;
    const backdrop = backdropRef.current;
    const settle = settleRef.current;
    const titleBar = titleBarRef.current;
    const tab = tabRef.current;
    const address = addressRef.current;
    const urlEl = urlRef.current;
    const caret = caretRef.current;
    const lockEl = lockRef.current;
    const progress = progressRef.current;
    const content = contentRef.current;
    const portraitImg = portraitImgRef.current;
    if (!chrome || !backdrop || !settle || !content) return;

    lock();
    const page = document.getElementById("content");
    const header = document.getElementById("site-header");
    if (page) page.inert = true;
    if (header) header.inert = true;
    closeBtnRef.current?.focus({ preventScroll: true });

    const reduced = prefersReducedMotionNow();
    const lights = titleBar ? Array.from(titleBar.querySelectorAll("[data-browser-light]")) : [];
    const revealItems = Array.from(content.querySelectorAll("[data-browser-item]"));
    const handoff = handoffRef.current;
    const scriptEl = content.querySelector("[data-browser-script]");
    const posters = Array.from(content.querySelectorAll(".browser__poster"));

    if (reduced) {
      gsap.set(
        [backdrop, chrome, settle, titleBar, tab, address, content, ...revealItems, handoff].filter(Boolean),
        { autoAlpha: 1, clearProps: "transform" },
      );
      if (scriptEl) gsap.set(scriptEl, { clipPath: "none" });
      if (progress) gsap.set(progress, { scaleX: 1, autoAlpha: 0 });
      if (lockEl) gsap.set(lockEl, { autoAlpha: 1, scale: 1 });
      if (caret) gsap.set(caret, { autoAlpha: 0 });
      if (urlEl) urlEl.textContent = ADDRESS;
      enteredRef.current = true;
      continueBtnRef.current?.focus({ preventScroll: true });
      return () => {
        unlock();
        if (page) page.inert = false;
        if (header) header.inert = false;
      };
    }

    gsap.set(backdrop, { autoAlpha: 0 });
    gsap.set(settle, { scale: 1, rotateX: 0, rotateY: 0 });
    gsap.set(lights, { autoAlpha: 0, y: 8 });
    gsap.set(tab, { autoAlpha: 0, x: -14 });
    gsap.set(address, { autoAlpha: 0, scaleX: 0.06, transformOrigin: "left center" });
    gsap.set(urlEl, { autoAlpha: 1 });
    gsap.set(caret, { autoAlpha: 1 });
    gsap.set(lockEl, { autoAlpha: 0, scale: 0.55 });
    gsap.set(progress, { scaleX: 0, autoAlpha: 1, transformOrigin: "left center" });
    gsap.set(revealItems, { autoAlpha: 0, y: 18 });
    gsap.set(posters, { scale: 1.06 });
    if (portraitImg) gsap.set(portraitImg, { yPercent: 12, scale: 1.04 });
    if (scriptEl) gsap.set(scriptEl, { clipPath: "inset(0 100% 0 0)" });
    gsap.set(handoff, { autoAlpha: 0, scale: 0.88, y: 24 });

    const finalState = Flip.getState(chrome);
    Flip.fit(chrome, originEl, { scale: false });

    gsap.set([chrome, settle], { willChange: "transform" });

    const tl = gsap.timeline({
      onComplete: () => {
        enteredRef.current = true;
        gsap.set([chrome, settle], { clearProps: "willChange" });
      },
    });

    // 0.00: backdrop + Flip travel
    tl.to(backdrop, { autoAlpha: 1, duration: 0.7, ease: "power2.out" }, 0).add(
      Flip.to(finalState, { duration: 1.05, ease: "expo.inOut", scale: false }),
      0,
    );

    // damped settle — no bounce
    tl.fromTo(
      settle,
      { scale: 0.985 },
      { scale: 1, duration: 0.55, ease: "expo.out" },
      0.9,
    );

    // 0.35: title lights
    tl.to(lights, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.05, ease: "expo.out" }, 0.35);

    // 0.55: tab + address pill expand
    tl.to(tab, { autoAlpha: 1, x: 0, duration: 0.5, ease: "expo.out" }, 0.55).to(
      address,
      { autoAlpha: 1, scaleX: 1, duration: 0.55, ease: "expo.out" },
      0.55,
    );

    // 0.70: type URL (~28ms/char), then lock
    if (urlEl) urlEl.textContent = "";
    const chars = ADDRESS.split("");
    chars.forEach((_, i) => {
      tl.add(() => {
        if (urlEl) urlEl.textContent = ADDRESS.slice(0, i + 1);
      }, 0.7 + i * 0.028);
    });
    const typedAt = 0.7 + chars.length * 0.028;
    tl.to(lockEl, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "expo.out" }, typedAt).to(
      caret,
      { autoAlpha: 0, duration: 0.2, ease: "power2.out" },
      typedAt + 0.15,
    );

    // 0.95: progress sweep then fade
    tl.to(progress, { scaleX: 1, duration: 0.55, ease: "power2.inOut" }, 0.95).to(
      progress,
      { autoAlpha: 0, duration: 0.35, ease: "power2.out" },
      1.45,
    );

    // 1.15: content reveal
    tl.to(revealItems, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.07, ease: "expo.out" }, 1.15)
      .to(posters, { scale: 1, duration: 0.65, stagger: 0.07, ease: "expo.out" }, 1.15)
      .to(
        portraitImg,
        { yPercent: 0, scale: 1, duration: 0.9, ease: "expo.out" },
        1.15,
      )
      .to(
        scriptEl,
        { clipPath: "inset(0 0% 0 0)", duration: 0.85, ease: "expo.out" },
        1.2,
      )
      .to(
        handoff,
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.7, ease: "expo.out" },
        1.65,
      )
      .add(() => {
        continueBtnRef.current?.focus({ preventScroll: true });
      }, 1.9);

    tlRef.current = tl;

    return () => {
      tlRef.current?.kill();
      Flip.killFlipsOf(chrome);
      gsap.set(chrome, { clearProps: "all" });
      unlock();
      if (page) page.inert = false;
      if (header) header.inert = false;
    };
  }, [lock, unlock, originEl]);

  /* --------------------------------------------------------------- close */
  const requestClose = useCallback(
    (after?: () => void) => {
      if (closingRef.current) return;
      closingRef.current = true;

      const chrome = chromeRef.current;
      const backdrop = backdropRef.current;
      const content = contentRef.current;
      const handoff = handoffRef.current;

      const finish = () => {
        const page = document.getElementById("content");
        const header = document.getElementById("site-header");
        if (page) page.inert = false;
        if (header) header.inert = false;
        onClosed();
        originEl.focus({ preventScroll: true });
        after?.();
      };

      tlRef.current?.kill();
      if (prefersReducedMotionNow() || !chrome || !backdrop) {
        finish();
        return;
      }

      const fadeTargets = [
        ...(handoff ? [handoff] : []),
        ...(content
          ? [content, ...Array.from(content.querySelectorAll("[data-browser-item]"))]
          : []),
      ];
      gsap.set(chrome, { willChange: "transform" });
      const state = Flip.getState(chrome);
      Flip.fit(chrome, originEl, { scale: false });

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(chrome, { clearProps: "willChange" });
          finish();
        },
      });
      tl.to(fadeTargets, { autoAlpha: 0, duration: 0.28, ease: "power2.out" }, 0)
        .add(Flip.from(state, { duration: 0.9, ease: "expo.inOut", scale: false }), 0)
        .to(backdrop, { autoAlpha: 0, duration: 0.7, ease: "power2.inOut" }, 0.15);
      tlRef.current = tl;
    },
    [onClosed, originEl],
  );

  const dismissImmediate = useCallback(() => {
    closingRef.current = true;
    tlRef.current?.kill();
    const page = document.getElementById("content");
    const header = document.getElementById("site-header");
    if (page) page.inert = false;
    if (header) header.inert = false;
    unlock();
    onClosed();
    originEl.focus({ preventScroll: true });
  }, [onClosed, originEl, unlock]);

  const continueToInstagram = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (closingRef.current) return;
      /* Curtain rises over the preview; drop the window underneath so it
         doesn’t flash back when the curtain clears. */
      openOutbound("opening Instagram", () => {
        window.open(url, "_blank", "noopener,noreferrer");
      });
      dismissImmediate();
    },
    [dismissImmediate, openOutbound, url],
  );

  /* --------------------------------------------- parallax after entrance */
  useGSAP(
    () => {
      const stage = stageRef.current;
      const settle = settleRef.current;
      if (!stage || !settle || !fine || prefersReducedMotionNow()) return;

      const xTo = gsap.quickTo(settle, "rotateY", { duration: 0.55, ease: "power3" });
      const yTo = gsap.quickTo(settle, "rotateX", { duration: 0.55, ease: "power3" });

      const onMove = (e: PointerEvent) => {
        if (!enteredRef.current || closingRef.current) return;
        const rect = stage.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        xTo(nx * 2);
        yTo(-ny * 2);
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      stage.addEventListener("pointermove", onMove);
      stage.addEventListener("pointerleave", onLeave);
      return () => {
        stage.removeEventListener("pointermove", onMove);
        stage.removeEventListener("pointerleave", onLeave);
      };
    },
    { dependencies: [fine] },
  );

  /* ----------------------------------------------------- keys + focus trap */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
        return;
      }
      if (e.key !== "Tab") return;
      const root = rootRef.current;
      if (!root) return;
      const focusables = Array.from(
        root.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
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
  }, [requestClose]);

  const bumpLight = (el: HTMLElement) => {
    if (prefersReducedMotionNow()) return;
    gsap.fromTo(
      el,
      { scale: 1 },
      { scale: 0.86, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.inOut" },
    );
  };

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${label} browser preview`}
      data-lenis-prevent
      className={`browser${coarse ? " browser--coarse" : ""}`}
    >
      <button
        type="button"
        ref={backdropRef}
        className="browser__backdrop"
        aria-label="close preview"
        data-cursor="close"
        onClick={() => requestClose()}
      />

      <div ref={stageRef} className="browser__stage">
        <div ref={chromeRef} className="browser__chrome">
          <div ref={settleRef} className="browser__settle">
            <div ref={titleBarRef} className="browser__titlebar">
              <div className="browser__lights" data-browser-lights>
                <button
                  ref={closeBtnRef}
                  type="button"
                  className="browser__light browser__light--close"
                  data-browser-light
                  data-cursor="close"
                  aria-label="close"
                  onClick={() => requestClose()}
                />
                <button
                  type="button"
                  className="browser__light browser__light--warn"
                  data-browser-light
                  aria-label="minimize"
                  onClick={(e) => bumpLight(e.currentTarget)}
                />
                <button
                  type="button"
                  className="browser__light browser__light--go"
                  data-browser-light
                  aria-label="zoom"
                  onClick={(e) => bumpLight(e.currentTarget)}
                />
              </div>
              <div ref={tabRef} className="browser__tab" aria-hidden="true">
                <span className="browser__tab-dot" />
                <span className="browser__tab-label">heartsfromsiya</span>
              </div>
            </div>

            <div className="browser__toolbar">
              <div className="browser__nav" aria-hidden="true">
                <span className="browser__chev browser__chev--disabled">‹</span>
                <span className="browser__chev browser__chev--disabled">›</span>
                <span className="browser__reload">↻</span>
              </div>
              <div ref={addressRef} className="browser__address">
                <span ref={lockRef} className="browser__lock" aria-hidden="true">
                  <svg viewBox="0 0 12 14" width="10" height="12" fill="none">
                    <rect
                      x="1.5"
                      y="6"
                      width="9"
                      height="6.5"
                      rx="1.2"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M3.6 6V4.2a2.4 2.4 0 0 1 4.8 0V6"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <span className="browser__url">
                  <span ref={urlRef} />
                  <span ref={caretRef} className="browser__caret" aria-hidden="true" />
                </span>
              </div>
              <span ref={progressRef} className="browser__progress" aria-hidden="true" />
            </div>

            <div ref={contentRef} className="browser__content">
              <div className="browser__preview">
                <div className="browser__portrait" data-browser-item>
                  <div className="browser__portrait-mask">
                    <Image
                      ref={portraitImgRef}
                      src={photos.hero.src}
                      alt={photos.hero.alt}
                      width={photos.hero.width}
                      height={photos.hero.height}
                      placeholder="blur"
                      blurDataURL={photos.hero.blur}
                      sizes="(min-width: 768px) 280px, 42vw"
                      className="browser__portrait-img"
                    />
                  </div>
                  <p className="browser__script type-script" data-browser-item data-browser-script>
                    {profile.handle}
                  </p>
                </div>

                <div className="browser__meta">
                  <p className="browser__handle type-label" data-browser-item>
                    {profile.handle}
                  </p>
                  <p className="browser__role type-body" data-browser-item>
                    content creator, pune
                  </p>
                  <ul className="browser__stats" data-browser-item>
                    {PREVIEW_STATS.map((stat) => (
                      <li key={stat.label} className="browser__stat">
                        <BrowserStat value={stat.value} suffix={stat.suffix} />
                        <span className="browser__stat-label type-label">{stat.label}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="browser__posters">
                    {PREVIEW_REELS.map((reel) => (
                      <div key={reel.id} className="browser__poster" data-browser-item>
                        <Image
                          src={reel.poster}
                          alt={reel.title}
                          width={360}
                          height={640}
                          placeholder="blur"
                          blurDataURL={reel.blur}
                          sizes="(min-width: 768px) 140px, 28vw"
                          className="browser__poster-img"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pops in after the preview loads: curtain handoff, not a footer button */}
              <div ref={handoffRef} className="browser__handoff" data-browser-handoff>
                <p className="browser__handoff-script type-script">continue to Instagram</p>
                <p className="browser__handoff-lead type-body">
                  Instagram cannot open inside this window. Continue in a new tab.
                </p>
                <div className="browser__handoff-actions">
                  <a
                    ref={continueBtnRef}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--solid has-roll"
                    data-cursor="open"
                    onClick={continueToInstagram}
                  >
                    <span className="roll" aria-hidden="true">
                      <span className="roll__inner">
                        <span>open Instagram</span>
                        <span>open Instagram</span>
                      </span>
                    </span>
                    <span className="sr-only">open Instagram</span>
                    <span className="btn__arrow" aria-hidden="true">
                      →
                    </span>
                  </a>
                  <button
                    type="button"
                    className="browser__dismiss link-u"
                    data-cursor="close"
                    onClick={() => requestClose()}
                  >
                    stay here
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** Count-up for the preview pane (site Odometer is scroll-bound). */
function BrowserStat({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotionNow()) {
        el.textContent = `${value}${suffix}`;
        return;
      }
      const state = { n: 0 };
      gsap.to(state, {
        n: value,
        duration: 0.9,
        delay: 1.2,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = `${Math.round(state.n)}${suffix}`;
        },
      });
    },
    { dependencies: [value, suffix] },
  );

  return (
    <span ref={ref} className="browser__stat-value">
      {value}
      {suffix}
    </span>
  );
}
