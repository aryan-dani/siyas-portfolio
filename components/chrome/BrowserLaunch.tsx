"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { gsap, Flip, useGSAP } from "@/lib/gsap";
import { CONTENT } from "@/lib/content";
import { prefersReducedMotionNow, useFinePointer } from "@/lib/hooks";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";

type OpenArgs = {
  url: string;
  label: string;
  origin: HTMLElement;
};

type BrowserLaunchContextValue = {
  open: (args: OpenArgs) => void;
};

const BrowserLaunchContext = createContext<BrowserLaunchContextValue>({
  open: () => {},
});

export function useBrowserLaunch() {
  return useContext(BrowserLaunchContext);
}

const ADDRESS = "instagram.com/heartsfromsiya";
const PREVIEW_REELS = CONTENT.work.reels.slice(0, 3);
const PREVIEW_STATS = CONTENT.numbers.stats;

/**
 * Instagram cannot be framed (X-Frame-Options / CSP). This provider opens a
 * designed profile preview that Flips from the clicked link; the real page
 * opens only when the visitor clicks "continue to instagram".
 */
export function BrowserLaunchProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<OpenArgs | null>(null);
  const busyRef = useRef(false);

  const open = useCallback((args: OpenArgs) => {
    if (busyRef.current || session) return;
    busyRef.current = true;
    setSession(args);
  }, [session]);

  const handleClosed = useCallback(() => {
    setSession(null);
    busyRef.current = false;
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <BrowserLaunchContext.Provider value={value}>
      {children}
      {session ? (
        <BrowserWindow
          url={session.url}
          label={session.label}
          originEl={session.origin}
          onClosed={handleClosed}
        />
      ) : null}
    </BrowserLaunchContext.Provider>
  );
}

/**
 * Client anchor that keeps href for no-JS / middle-click / open-in-new-tab,
 * and intercepts plain left clicks to open the browser window.
 */
export function BrowserLaunchLink({
  href,
  label,
  className,
  children,
  "aria-label": ariaLabel,
  ...rest
}: {
  href: string;
  label: string;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children" | "className">) {
  const { open } = useBrowserLaunch();
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented) return;
    if (e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    open({ url: href, label, origin: e.currentTarget });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
      data-cursor="open"
      onClick={onClick}
      {...rest}
    >
      {children}
    </a>
  );
}

/* ------------------------------------------------------------------ window */

function BrowserWindow({
  url,
  label,
  originEl,
  onClosed,
}: {
  url: string;
  label: string;
  originEl: HTMLElement;
  onClosed: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const settleRef = useRef<HTMLDivElement>(null);
  const titleBarRef = useRef<HTMLDivElement>(null);
  const tabRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef<HTMLDivElement>(null);
  const urlRef = useRef<HTMLSpanElement>(null);
  const lockRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const closingRef = useRef(false);
  const enteredRef = useRef(false);

  const { lock, unlock } = useSmoothScroll();
  const fine = useFinePointer();

  /* ----------------------------------------------------------------- open */
  useEffect(() => {
    const chrome = chromeRef.current;
    const backdrop = backdropRef.current;
    const settle = settleRef.current;
    const titleBar = titleBarRef.current;
    const tab = tabRef.current;
    const address = addressRef.current;
    const urlEl = urlRef.current;
    const lockEl = lockRef.current;
    const progress = progressRef.current;
    const content = contentRef.current;
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
    const cta = content.querySelector("[data-browser-cta]");

    const scriptEl = content.querySelector("[data-browser-script]");

    if (reduced) {
      gsap.set([backdrop, chrome, settle, titleBar, tab, address, content, ...revealItems, cta].filter(Boolean), {
        autoAlpha: 1,
        clearProps: "transform",
      });
      if (scriptEl) gsap.set(scriptEl, { clipPath: "none" });
      if (progress) gsap.set(progress, { scaleX: 1, autoAlpha: 0 });
      if (lockEl) gsap.set(lockEl, { autoAlpha: 1, scale: 1 });
      if (urlEl) urlEl.textContent = ADDRESS;
      enteredRef.current = true;
      return () => {
        unlock();
        if (page) page.inert = false;
        if (header) header.inert = false;
      };
    }

    gsap.set(backdrop, { autoAlpha: 0 });
    gsap.set(settle, { scale: 1 });
    gsap.set(lights, { autoAlpha: 0, y: 8 });
    gsap.set(tab, { autoAlpha: 0, x: -12 });
    gsap.set(address, { autoAlpha: 0, scaleX: 0.08, transformOrigin: "left center" });
    gsap.set(urlEl, { autoAlpha: 1 });
    gsap.set(lockEl, { autoAlpha: 0, scale: 0.6 });
    gsap.set(progress, { scaleX: 0, autoAlpha: 1, transformOrigin: "left center" });
    const posters = Array.from(content.querySelectorAll(".browser__poster"));
    gsap.set(revealItems, { autoAlpha: 0, y: 18 });
    gsap.set(posters, { scale: 1.06 });
    if (scriptEl) gsap.set(scriptEl, { clipPath: "inset(0 100% 0 0)" });
    gsap.set(cta, { autoAlpha: 0, y: 14 });

    const finalState = Flip.getState(chrome);
    Flip.fit(chrome, originEl, { scale: false });

    const tl = gsap.timeline({
      onComplete: () => {
        enteredRef.current = true;
        gsap.set([chrome, settle], { clearProps: "willChange" });
      },
    });

    gsap.set([chrome, settle], { willChange: "transform" });

    tl.to(backdrop, { autoAlpha: 1, duration: 0.7, ease: "power2.out" }, 0)
      .add(
        Flip.to(finalState, {
          duration: 1.05,
          ease: "expo.inOut",
          scale: false,
        }),
        0,
      )
      .to(
        settle,
        { scale: 1.015, duration: 0.28, ease: "expo.out", yoyo: true, repeat: 1 },
        0.95,
      )
      .to(lights, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.05, ease: "expo.out" }, 0.35)
      .to(tab, { autoAlpha: 1, x: 0, duration: 0.5, ease: "expo.out" }, 0.55)
      .to(address, { autoAlpha: 1, scaleX: 1, duration: 0.55, ease: "expo.out" }, 0.55);

    // Type URL into the address node (DOM writes avoid React setState-in-effect lint)
    const chars = ADDRESS.split("");
    if (urlEl) urlEl.textContent = "";
    chars.forEach((_, i) => {
      tl.add(() => {
        if (urlEl) urlEl.textContent = ADDRESS.slice(0, i + 1);
      }, 0.7 + i * 0.028);
    });
    tl.to(lockEl, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "expo.out" }, 0.7 + chars.length * 0.028)
      .to(progress, { scaleX: 1, duration: 0.55, ease: "power2.inOut" }, 0.95)
      .to(progress, { autoAlpha: 0, duration: 0.35, ease: "power2.out" }, 1.45)
      .to(
        revealItems,
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.07, ease: "expo.out" },
        1.15,
      )
      .to(posters, { scale: 1, duration: 0.65, stagger: 0.07, ease: "expo.out" }, 1.15)
      .to(
        scriptEl,
        { clipPath: "inset(0 0% 0 0)", duration: 0.85, ease: "expo.out" },
        1.2,
      )
      .to(cta, { autoAlpha: 1, y: 0, duration: 0.55, ease: "expo.out" }, 1.7);

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
  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;

    const chrome = chromeRef.current;
    const backdrop = backdropRef.current;
    const content = contentRef.current;

    const finish = () => {
      const page = document.getElementById("content");
      const header = document.getElementById("site-header");
      if (page) page.inert = false;
      if (header) header.inert = false;
      onClosed();
      originEl.focus({ preventScroll: true });
    };

    tlRef.current?.kill();
    if (prefersReducedMotionNow() || !chrome || !backdrop) {
      finish();
      return;
    }

    const fadeTargets = content
      ? [content, ...Array.from(content.querySelectorAll("[data-browser-item], [data-browser-cta]"))]
      : [];
    gsap.set(chrome, { willChange: "transform" });
    const state = Flip.getState(chrome);
    Flip.fit(chrome, originEl, { scale: false });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(chrome, { clearProps: "willChange" });
        finish();
      },
    });
    tl.to(fadeTargets, { autoAlpha: 0, duration: 0.3, ease: "power2.out" }, 0)
      .add(Flip.from(state, { duration: 0.9, ease: "expo.inOut", scale: false }), 0)
      .to(backdrop, { autoAlpha: 0, duration: 0.7, ease: "power2.inOut" }, 0.15);
    tlRef.current = tl;
  }, [onClosed, originEl]);

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
    gsap.fromTo(el, { scale: 1 }, { scale: 0.86, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.inOut" });
  };

  const { profile, photos } = CONTENT;

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${label} browser preview`}
      data-lenis-prevent
      className="browser"
    >
      <button
        type="button"
        ref={backdropRef}
        className="browser__backdrop"
        aria-label="close preview"
        data-cursor="close"
        onClick={requestClose}
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
                  onClick={requestClose}
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
                  ⌢
                </span>
                <span className="browser__url">
                  <span ref={urlRef} />
                  <span className="browser__caret" aria-hidden="true" />
                </span>
              </div>
              <span ref={progressRef} className="browser__progress" aria-hidden="true" />
            </div>

            <div ref={contentRef} className="browser__content">
              <div className="browser__preview">
                <div className="browser__portrait" data-browser-item>
                  <div className="browser__portrait-mask">
                    <Image
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
                    {PREVIEW_REELS.map((reel, i) => (
                      <div
                        key={reel.id}
                        className="browser__poster"
                        data-browser-item
                        style={{ transitionDelay: `${i * 70}ms` }}
                      >
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

              <div className="browser__actions" data-browser-cta>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--solid has-roll"
                  data-cursor="open"
                >
                  <span className="roll" aria-hidden="true">
                    <span className="roll__inner">
                      <span>continue to instagram</span>
                      <span>continue to instagram</span>
                    </span>
                  </span>
                  <span className="sr-only">continue to instagram</span>
                  <span className="btn__arrow" aria-hidden="true">
                    →
                  </span>
                </a>
                <button type="button" className="browser__dismiss link-u" data-cursor="close" onClick={requestClose}>
                  close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** Lightweight count-up for the preview (Odometer is scroll-bound). */
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
