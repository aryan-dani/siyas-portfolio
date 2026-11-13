"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotionNow } from "@/lib/hooks";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";

type NavCurtainContextValue = {
  goToSection: (href: string, label: string) => void;
  /**
   * Curtain clears, then the action runs (Instagram Flip preview).
   * Prefer `openOutboundCover` for mailto / window.open so user activation survives.
   */
  openOutbound: (label: string, action: () => void) => void;
  /** Action fires while the sheet fully covers the page (keeps user activation). */
  openOutboundCover: (label: string, action: () => void) => void;
};

const NavCurtainContext = createContext<NavCurtainContextValue>({
  goToSection: () => {},
  openOutbound: (_label, action) => action(),
  openOutboundCover: (_label, action) => action(),
});

export function useNavCurtain() {
  return useContext(NavCurtainContext);
}

export function NavCurtainProvider({ children }: { children: ReactNode }) {
  const { scrollTo } = useSmoothScroll();
  const [label, setLabel] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const busyRef = useRef(false);

  const playCurtain = useCallback(
    (nextLabel: string, action: () => void, at: "cover" | "end" = "cover") => {
      if (busyRef.current) return;
      busyRef.current = true;

      if (prefersReducedMotionNow()) {
        action();
        busyRef.current = false;
        return;
      }

      setLabel(nextLabel);

      requestAnimationFrame(() => {
        const overlay = overlayRef.current;
        const title = titleRef.current;
        if (!overlay || !title) {
          action();
          busyRef.current = false;
          setLabel(null);
          return;
        }

        const tl = gsap.timeline({
          onComplete: () => {
            if (at === "end") action();
            setLabel(null);
            busyRef.current = false;
          },
        });

        gsap.set(overlay, { yPercent: 100, autoAlpha: 1, visibility: "visible" });
        gsap.set(title, { autoAlpha: 0, y: 28, scale: 0.96 });

        /* Sheet rises from below with a curved edge, holds the title, lifts away. */
        tl.to(overlay, { yPercent: 0, duration: 0.7, ease: "expo.inOut" })
          .to(
            title,
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "expo.out" },
            "-=0.25",
          );

        if (at === "cover") {
          tl.add(() => {
            action();
          })
            .to({}, { duration: 0.22 })
            .to(title, { autoAlpha: 0, y: -16, duration: 0.35, ease: "power2.in" })
            .to(overlay, { yPercent: -110, duration: 0.7, ease: "expo.inOut" }, "-=0.1");
        } else {
          tl.to({}, { duration: 0.28 })
            .to(title, { autoAlpha: 0, y: -16, duration: 0.35, ease: "power2.in" })
            .to(overlay, { yPercent: -110, duration: 0.7, ease: "expo.inOut" }, "-=0.1");
        }
      });
    },
    [],
  );

  const goToSection = useCallback(
    (href: string, nextLabel: string) => {
      playCurtain(
        nextLabel,
        () => {
          scrollTo(href, { offset: -20, immediate: true });
        },
        "cover",
      );
    },
    [playCurtain, scrollTo],
  );

  const openOutbound = useCallback(
    (nextLabel: string, action: () => void) => {
      playCurtain(nextLabel, action, "end");
    },
    [playCurtain],
  );

  const openOutboundCover = useCallback(
    (nextLabel: string, action: () => void) => {
      playCurtain(nextLabel, action, "cover");
    },
    [playCurtain],
  );

  const value = useMemo(
    () => ({ goToSection, openOutbound, openOutboundCover }),
    [goToSection, openOutbound, openOutboundCover],
  );

  return (
    <NavCurtainContext.Provider value={value}>
      {children}
      <div
        ref={overlayRef}
        className="nav-curtain"
        aria-hidden={label ? "false" : "true"}
        data-active={label ? "true" : "false"}
      >
        <p ref={titleRef} className="nav-curtain__title">
          {label}
        </p>
      </div>
    </NavCurtainContext.Provider>
  );
}

/**
 * Anchor that keeps href for no-JS / middle-click, and plays the nav curtain
 * ("opening …") before handing off on a plain left click.
 */
export function OutboundLink({
  href,
  label,
  className,
  children,
  "aria-label": ariaLabel,
  target,
  rel,
  onAfterCurtain,
  ...rest
}: {
  href: string;
  /** Script curtain copy, e.g. "opening email" */
  label: string;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
  target?: string;
  rel?: string;
  /** Runs after the curtain cover point (default: navigate / window.open). */
  onAfterCurtain?: (anchor: HTMLAnchorElement) => void;
} & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "children" | "className" | "target" | "rel" | "aria-label"
>) {
  const { openOutboundCover } = useNavCurtain();

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented) return;
    if (e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const el = e.currentTarget;
    openOutboundCover(label, () => {
      if (onAfterCurtain) {
        onAfterCurtain(el);
        return;
      }
      if (href.startsWith("mailto:") || href.startsWith("tel:")) {
        window.location.href = href;
        return;
      }
      window.open(href, target ?? "_blank", "noopener,noreferrer");
    });
  };

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={className}
      aria-label={ariaLabel}
      onClick={onClick}
      {...rest}
    >
      {children}
    </a>
  );
}
