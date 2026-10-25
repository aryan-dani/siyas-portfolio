"use client";

import { useEffect } from "react";

const COLORS = {
  cream: "#FFF1B5",
  blue: "#C1DBE8",
  burgundy: "#43302E",
} as const;

type Theme = keyof typeof COLORS;

function isTheme(value: string | undefined): value is Theme {
  return value === "cream" || value === "blue" || value === "burgundy";
}

/**
 * Cross-fades the whole page (background + ink) as chapters pass the middle of
 * the viewport. Sections opt in with data-theme-section="cream|blue|burgundy".
 * The colours themselves are CSS variables on <html data-theme>, so the fade is
 * a pure CSS transition; this component only decides which theme is current.
 */
export function SectionTheme() {
  useEffect(() => {
    const root = document.documentElement;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    const sections = document.querySelectorAll<HTMLElement>("[data-theme-section]");

    let current: Theme | null = null;

    const apply = (theme: Theme) => {
      if (theme === current) return;
      current = theme;
      if (theme === "cream") delete root.dataset.theme;
      else root.dataset.theme = theme;
      meta?.setAttribute("content", COLORS[theme]);
    };

    /* Pick the chapter whose box contains the viewport midpoint. An
       IntersectionObserver with a 0-height root margin can miss the line
       during Lenis jumps and leave the previous colour stuck. */
    const pick = () => {
      const mid = window.innerHeight * 0.5;
      let next: Theme = "cream";
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= mid && rect.bottom > mid) {
          const theme = section.dataset.themeSection;
          if (isTheme(theme)) next = theme;
        }
      });
      apply(next);
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        pick();
      });
    };

    pick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.__siyaLenis?.on("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.__siyaLenis?.off("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
      apply("cream");
    };
  }, []);

  return null;
}
