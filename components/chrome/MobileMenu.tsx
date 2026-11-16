"use client";

import Link from "next/link";
import { useEffect, useRef, type RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { CONTENT, NAV } from "@/lib/content";
import { prefersReducedMotionNow, useMediaQuery, MQ } from "@/lib/hooks";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";
import { useNavCurtain } from "@/components/chrome/NavCurtain";

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
  const { lock, unlock } = useSmoothScroll();
  const { goToSection } = useNavCurtain();
  const isDesktop = useMediaQuery(MQ.desktop);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const items = root.querySelectorAll("[data-menu-item]");
      const fades = root.querySelectorAll("[data-menu-fade]");
      const lines = root.querySelectorAll("[data-menu-line]");

      gsap.set(root, { yPercent: -100, visibility: "hidden" });
      gsap.set(items, { yPercent: 115 });
      gsap.set(fades, { autoAlpha: 0, y: 20 });
      gsap.set(lines, { scaleX: 0 });

      const tl = gsap.timeline({
        paused: true,
        onReverseComplete: () => {
          gsap.set(root, { visibility: "hidden" });
        },
      });
      tl.set(root, { visibility: "visible" })
        .to(root, { yPercent: 0, duration: 0.95, ease: "expo.inOut" })
        .to(items, { yPercent: 0, duration: 1.2, stagger: 0.08, ease: "expo.out" }, "-=0.5")
        .to(lines, { scaleX: 1, duration: 0.85, stagger: 0.08, ease: "expo.out" }, "-=1.05")
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

  const handleNav = (href: string, label: string) => (e: React.MouseEvent) => {
    if (!isHome) {
      onClose();
      return;
    }
    e.preventDefault();
    onClose();
    window.setTimeout(() => goToSection(href, label), 280);
  };

  return (
    <div
      id="mobile-menu"
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      data-lenis-prevent
      className="mobile-menu invisible fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto bg-burgundy px-[var(--gutter)] pt-28 pb-10 text-buttermilk md:hidden"
    >
      <nav aria-label="Mobile">
        <ul>
          {NAV.map((item, i) => (
            <li key={item.href} className="overflow-hidden">
              <a
                data-menu-item
                href={isHome ? item.href : `/${item.href}`}
                onClick={handleNav(item.href, item.label)}
                className="type-display mobile-menu__link flex items-start gap-4 py-[0.05em] text-[clamp(4rem,21vw,7.5rem)] leading-[0.95] normal-case"
                style={{ textTransform: "none" }}
              >
                <span className="type-nav mt-[0.9em] w-6 shrink-0 text-[0.7rem] opacity-70">
                  0{i + 1}
                </span>
                {item.label}
              </a>
              <span
                data-menu-line
                className="mobile-menu__line"
                aria-hidden="true"
              />
            </li>
          ))}
          <li className="overflow-hidden">
            <Link
              data-menu-item
              href="/collaborate"
              onClick={() => onClose()}
              className="type-display mobile-menu__link flex items-start gap-4 py-[0.05em] text-[clamp(4rem,21vw,7.5rem)] leading-[0.95] normal-case"
              style={{ textTransform: "none" }}
            >
              <span className="type-nav mt-[0.9em] w-6 shrink-0 text-[0.7rem] opacity-70">
                04
              </span>
              collaborate
            </Link>
            <span
              data-menu-line
              className="mobile-menu__line"
              aria-hidden="true"
            />
          </li>
        </ul>
      </nav>

      <div className="flex flex-col gap-6">
        <a
          data-menu-fade
          href={`mailto:${CONTENT.profile.email}`}
          className="link-u self-start text-[1.35rem] leading-tight tracking-[0.01em] touch-target"
        >
          {CONTENT.profile.email}
        </a>
        <div data-menu-fade className="type-nav flex flex-wrap gap-x-7 gap-y-3">
          <Link
            href="/ugc-creator-pune"
            onClick={() => onClose()}
            className="link-u touch-target"
          >
            ugc creator pune
          </Link>
          <a
            href={CONTENT.profile.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-u touch-target"
          >
            instagram
          </a>
          <a
            href={CONTENT.profile.instagramDumpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-u touch-target"
          >
            {CONTENT.profile.secondaryHandle}
          </a>
          <a
            href={CONTENT.profile.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-u touch-target"
          >
            youtube
          </a>
        </div>
      </div>
    </div>
  );
}
