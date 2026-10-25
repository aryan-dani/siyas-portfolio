"use client";

import { useEffect, type ReactNode } from "react";
import { SmoothScrollProvider } from "@/components/motion/SmoothScroll";
import { InquiryProvider } from "@/lib/inquiry";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { MediaCursor } from "@/components/chrome/MediaCursor";

/**
 * Everything that persists across routes: smooth scrolling, the header, the
 * media cursor and the shared inquiry state. Pages render inside #content.
 */
export function SiteShell({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Tells the boot script's failsafe that the app started.
    window.__siyaReady = true;
  }, []);

  /* The boot script decides before first paint, but the visitor's setting can
     differ by the time React runs (or change while the page is open). Whenever
     motion is off, nothing may stay hidden waiting for an animation that will
     never play, and a pending intro must not trap the page. */
  useEffect(() => {
    if (!reducedMotion) return;
    const root = document.documentElement;
    root.classList.remove("js-motion");
    if (root.dataset.intro !== "done") root.dataset.intro = "done";
  }, [reducedMotion]);

  return (
    <SmoothScrollProvider>
      <InquiryProvider>
        <SiteHeader />
        <MediaCursor />
        <div id="content">{children}</div>
      </InquiryProvider>
    </SmoothScrollProvider>
  );
}
