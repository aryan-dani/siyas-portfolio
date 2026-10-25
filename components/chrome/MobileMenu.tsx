"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { CONTENT, NAV } from "@/lib/content";
import { prefersReducedMotionNow, useMediaQuery } from "@/lib/hooks";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";

type Props = {
  open: boolean;
  onClose: () => void;
  /** The header's Menu/Close button, kept inside the focus loop. */
  toggleRef: RefObject<HTMLButtonElement | null>;
  isHome: boolean;
};

export function MobileMenu({ open, onClose, toggleRef, isHome }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const lockedRef = useRef(false);
  const { scrollTo, lock, unlock } = useSmoothScroll();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const items = root.querySelectorAll("[data-menu-item]");
      const fades = root.querySelectorAll("[data-menu-fade]");

      gsap.set(root, { yPercent: -100, visibility: "hidden" });
      gsap.set(items, { yPercent: 115 });
      gsap.set(fades, { autoAlpha: 0, y: 20 });

      const tl = gsap.timeline({
        paused: true,
        onReverseComplete: () => {
          gsap.set(root, { visibility: "hidden" });
        },
      });
      tl.set(root, { visibility: "visible" })
        .to(root, { yPercent: 0, duration: 0.95, ease: "expo.inOut" })
        .to(items, { yPercent: 0, duration: 1.2, stagger: 0.08, ease: "expo.out" }, "-=0.5")
        .to(fades, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.07, ease: "expo.out" }, "-=0.9");
      tlRef.current = tl;

      return () => {
        tl.kill();
        tlRef.current = null;
      };
    },
    { scope: rootRef }
  );

  /* Open / close */
  useEffect(() => {
    const tl = tlRef.current;
    const root = rootRef.current;
    const content = document.getElementById("content");
    if (!tl || !root) return;

    if (open) {
      if (!lockedRef.current) {
        lockedRef.current = true;
        lock();
      }
      if (content) content.inert = true;
      // Visible before focusing: a visibility:hidden link can't take focus, and
      // the timeline only applies its own visibility on the next frame.
      gsap.set(root, { visibility: "visible" });
      if (prefersReducedMotionNow()) tl.progress(1);
      else tl.timeScale(1).play();
      root.querySelector<HTMLElement>("a[href]")?.focus({ preventScroll: true });
    } else {
      if (content) content.inert = false;
      if (prefersReducedMotionNow()) tl.progress(0);
      else tl.timeScale(1.5).reverse();
      if (lockedRef.current) {
        lockedRef.current = false;
        unlock();
      }
    }
  }, [open, lock, unlock]);

  /* Never leave the page locked or inert if the component goes away. */
  useEffect(() => {
    return () => {
      const content = document.getElementById("content");
      if (content) content.inert = false;
      if (lockedRef.current) {
        lockedRef.current = false;
        unlock();
      }
    };
  }, [unlock]);

  /* Growing past the mobile breakpoint closes the menu. */
  useEffect(() => {
    if (isDesktop && open) onClose();
  }, [isDesktop, open, onClose]);

  /* Esc closes; Tab cycles between the menu links and the header toggle. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const root = rootRef.current;
      const toggle = toggleRef.current;
      if (!root || !toggle) return;
      const ring = [
        ...Array.from(root.querySelectorAll<HTMLElement>("a[href], button")),
        toggle,
      ];
      const first = ring[0];
      const last = ring[ring.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, toggleRef]);

  const handleNav = (href: string) => (e: React.MouseEvent) => {
    if (!isHome) return;
    e.preventDefault();
    // Jump underneath the overlay, then lift it to reveal the destination.
    scrollTo(href, { immediate: true });
    onClose();
  };

  return (
    <div
      id="mobile-menu"
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      data-lenis-prevent
      className="invisible fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto bg-burgundy px-[var(--gutter)] pt-28 pb-10 text-buttermilk md:hidden"
    >
      <nav aria-label="Mobile">
        <ul>
          {NAV.map((item, i) => (
            <li key={item.href} className="overflow-hidden">
              <a
                data-menu-item
                href={isHome ? item.href : `/${item.href}`}
                onClick={handleNav(item.href)}
                className="type-display flex items-start gap-4 py-[0.05em] text-[clamp(4rem,21vw,7.5rem)] leading-[0.95]"
              >
                <span className="type-label mt-[0.9em] w-6 shrink-0 text-[0.7rem] opacity-70">
                  0{i + 1}
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex flex-col gap-6">
        <a
          data-menu-fade
          href={`mailto:${CONTENT.profile.email}`}
          className="link-u self-start text-[1.35rem] leading-tight tracking-[0.01em]"
        >
          {CONTENT.profile.email}
        </a>
        <div data-menu-fade className="type-label flex flex-wrap gap-x-7 gap-y-3">
          <a href={CONTENT.profile.instagramUrl} target="_blank" rel="noopener noreferrer" className="link-u">
            Instagram
          </a>
          <a href={CONTENT.profile.instagramDumpUrl} target="_blank" rel="noopener noreferrer" className="link-u">
            {CONTENT.profile.secondaryHandle}
          </a>
          <a href={CONTENT.profile.youtubeUrl} target="_blank" rel="noopener noreferrer" className="link-u">
            YouTube
          </a>
        </div>
      </div>
    </div>
  );
}
