"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { NAV } from "@/lib/content";
import { whenIntroRevealing } from "@/lib/intro";
import { prefersReducedMotionNow } from "@/lib/hooks";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";
import { MobileMenu } from "@/components/chrome/MobileMenu";

const SECTION_IDS = NAV.map((n) => n.href.slice(1));

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { scrollTo, subscribe } = useSmoothScroll();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolledAway, setScrolledAway] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const innerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  /* Hide while reading down, return on any scroll up. */
  useEffect(() => {
    return subscribe(({ y, direction }) => {
      setScrolledAway(y > 140 && direction === 1);
    });
  }, [subscribe]);

  /* Which chapter is under the middle of the screen (home only). The hero is
     observed too, so scrolling back to the top clears the highlight. */
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
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [isHome]);

  /* The header arrives with the page, once the intro lifts. */
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
        }
      );
      const disarm = whenIntroRevealing(() => tween.play());
      return () => disarm();
    },
    { scope: innerRef }
  );

  const goTo = (href: string) => (e: React.MouseEvent) => {
    if (!isHome) return; // normal navigation to /#section
    e.preventDefault();
    setMenuOpen(false);
    scrollTo(href);
  };

  const hidden = scrolledAway && !menuOpen;

  return (
    <>
      <header
        id="site-header"
        className={`fixed inset-x-0 top-0 z-50 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
        style={{
          viewTransitionName: "site-header",
          color: menuOpen ? "var(--buttermilk)" : undefined,
          transition: "transform 0.7s var(--ease-out), color 0.5s var(--ease-out)",
        }}
      >
        <div
          ref={innerRef}
          data-reveal="header"
          className="wrap flex h-[4.5rem] items-center justify-between md:h-24"
        >
          <Link
            href="/"
            aria-label="Siya Pawar, home"
            onClick={(e) => {
              if (!isHome) return;
              e.preventDefault();
              setMenuOpen(false);
              scrollTo(0);
            }}
            className="type-script text-[2.3rem] leading-none md:text-[2.7rem]"
            style={{ WebkitTextStroke: "0.35px currentColor" }}
          >
            Siya
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-11 md:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={isHome ? item.href : `/${item.href}`}
                onClick={goTo(item.href)}
                data-active={activeSection === item.href.slice(1) ? "true" : "false"}
                className="type-label link-u"
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
            className="type-label has-roll -mr-1 px-1 py-2 md:hidden"
          >
            <span className="roll" aria-hidden="true">
              <span className="roll__inner">
                <span>{menuOpen ? "Close" : "Menu"}</span>
                <span>{menuOpen ? "Close" : "Menu"}</span>
              </span>
            </span>
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
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
