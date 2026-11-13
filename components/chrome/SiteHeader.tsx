"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { NAV } from "@/lib/content";
import { whenIntroRevealing } from "@/lib/intro";
import { prefersReducedMotionNow } from "@/lib/hooks";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";
import { MobileMenu } from "@/components/chrome/MobileMenu";
import { useNavCurtain } from "@/components/chrome/NavCurtain";

const SECTION_IDS = NAV.map((n) => n.href.slice(1));
const DOCK_AT = 72;
const IDLE_MS = 5000;

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { scrollTo, subscribe } = useSmoothScroll();
  const { goToSection } = useNavCurtain();

  const [menuOpen, setMenuOpen] = useState(false);
  const [idleHidden, setIdleHidden] = useState(false);
  const [docked, setDocked] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const innerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const idleTimerRef = useRef<number | null>(null);
  const lastActivityRef = useRef(0);
  const dockedRef = useRef(false);
  const menuOpenRef = useRef(false);

  const clearIdle = useCallback(() => {
    if (idleTimerRef.current != null) {
      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const scheduleIdle = useCallback(() => {
    clearIdle();
    if (!dockedRef.current || menuOpenRef.current) return;
    idleTimerRef.current = window.setTimeout(() => {
      if (!menuOpenRef.current && dockedRef.current) setIdleHidden(true);
    }, IDLE_MS);
  }, [clearIdle]);

  const bumpActivity = useCallback(() => {
    const now = performance.now();
    /* Throttle: scroll/wheel fire continuously; one timer + timestamp is enough. */
    if (now - lastActivityRef.current < 120) {
      setIdleHidden(false);
      return;
    }
    lastActivityRef.current = now;
    setIdleHidden(false);
    scheduleIdle();
  }, [scheduleIdle]);

  /* Stay visible while scrolling; hide only after idle once docked. */
  useEffect(() => {
    let wasDocked = false;
    const unsub = subscribe(({ y }) => {
      const nextDocked = y > DOCK_AT;
      if (nextDocked !== wasDocked) {
        wasDocked = nextDocked;
        dockedRef.current = nextDocked;
        setDocked(nextDocked);
      }
      if (!nextDocked) {
        clearIdle();
        setIdleHidden(false);
        return;
      }
      bumpActivity();
    });

    const onActivity = () => bumpActivity();
    window.addEventListener("pointerdown", onActivity, { passive: true });
    window.addEventListener("keydown", onActivity);
    window.addEventListener("touchstart", onActivity, { passive: true });
    window.addEventListener("wheel", onActivity, { passive: true });

    return () => {
      unsub();
      clearIdle();
      window.removeEventListener("pointerdown", onActivity);
      window.removeEventListener("keydown", onActivity);
      window.removeEventListener("touchstart", onActivity);
      window.removeEventListener("wheel", onActivity);
    };
  }, [subscribe, clearIdle, bumpActivity]);

  useEffect(() => {
    menuOpenRef.current = menuOpen;
    if (menuOpen) {
      clearIdle();
    } else if (dockedRef.current) {
      scheduleIdle();
    }
  }, [menuOpen, clearIdle, scheduleIdle]);

  useEffect(() => {
    if (!isHome) return;
    const targets = ["top", ...SECTION_IDS]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!targets.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id === "top" ? null : entry.target.id);
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [isHome]);

  useGSAP(
    () => {
      const el = innerRef.current;
      if (!el || prefersReducedMotionNow()) return;
      const tween = gsap.fromTo(
        el,
        { opacity: 0, y: -18 },
        {
          opacity: 1,
          y: 0,
          duration: 1.3,
          delay: 0.35,
          paused: true,
          onComplete: () => {
            gsap.set(el, { clearProps: "transform,opacity" });
            el.dataset.revealed = "true";
          },
        },
      );
      const disarm = whenIntroRevealing(() => tween.play());
      return () => disarm();
    },
    { scope: innerRef },
  );

  const goTo = (href: string, label: string) => (e: React.MouseEvent) => {
    if (!isHome) return;
    e.preventDefault();
    setMenuOpen(false);
    goToSection(href, label);
  };

  const hidden = idleHidden && !menuOpen;

  return (
    <>
      <header
        id="site-header"
        className={`site-header fixed inset-x-0 top-0 z-50 ${
          hidden ? "site-header--hidden" : ""
        }`}
        style={{
          viewTransitionName: "site-header",
          color: menuOpen ? "var(--buttermilk)" : undefined,
        }}
      >
        <div
          ref={innerRef}
          data-reveal="header"
          className="wrap flex h-[4.5rem] items-center justify-between md:h-24"
        >
          <Link
            href="/"
            aria-label="heartsfromsiya, home"
            data-docked={docked ? "true" : "false"}
            data-magnetic
            onClick={(e) => {
              if (!isHome) return;
              e.preventDefault();
              setMenuOpen(false);
              if (docked || activeSection) goToSection("#top", "siya");
              else scrollTo(0);
            }}
            className="brand-mark"
          >
            <span className="brand-mark__lead">heartsfrom</span>
            <span className="brand-mark__script">Siya</span>
          </Link>

          <nav
            aria-label="Primary"
            data-docked={docked ? "true" : "false"}
            className="nav-menu hidden md:flex"
          >
            {NAV.map((item) => (
              <a
                key={item.href}
                href={isHome ? item.href : `/${item.href}`}
                onClick={goTo(item.href, item.label)}
                data-active={activeSection === item.href.slice(1) ? "true" : "false"}
                data-magnetic
                className="nav-menu__link type-nav"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            ref={toggleRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="type-nav has-roll site-header__toggle -mr-1 px-1 py-2 md:hidden"
          >
            <span className="roll" aria-hidden="true">
              <span className="roll__inner">
                <span>{menuOpen ? "close" : "menu"}</span>
                <span>{menuOpen ? "close" : "menu"}</span>
              </span>
            </span>
            <span className="sr-only">{menuOpen ? "close menu" : "open menu"}</span>
          </button>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        toggleRef={toggleRef}
        isHome={isHome}
      />
    </>
  );
}
