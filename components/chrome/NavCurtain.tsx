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
  /** Full-screen script title, then run an outbound action (email / social). */
  openOutbound: (label: string, action: () => void) => void;
};

const NavCurtainContext = createContext<NavCurtainContextValue>({
  goToSection: () => {},
  openOutbound: (_label, action) => action(),
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
    (nextLabel: string, action: () => void, at: "mid" | "end" = "mid") => {
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

        gsap.set(overlay, { autoAlpha: 0 });
        gsap.set(title, { autoAlpha: 0, y: 28, scale: 0.96 });

        tl.to(overlay, { autoAlpha: 1, duration: 0.45, ease: "power2.out" })
          .to(
            title,
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" },
            "-=0.15",
          );

        if (at === "mid") {
          tl.add(() => {
            action();
          })
            .to({}, { duration: 0.28 })
            .to(title, { autoAlpha: 0, y: -16, duration: 0.4, ease: "power2.in" })
            .to(overlay, { autoAlpha: 0, duration: 0.45, ease: "power2.inOut" }, "-=0.12");
        } else {
          tl.to({}, { duration: 0.35 })
            .to(title, { autoAlpha: 0, y: -16, duration: 0.4, ease: "power2.in" })
            .to(overlay, { autoAlpha: 0, duration: 0.45, ease: "power2.inOut" }, "-=0.12");
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
        "mid",
      );
    },
    [playCurtain, scrollTo],
  );

  const openOutbound = useCallback(
    (nextLabel: string, action: () => void) => {
      /* End: so Flip / mailto / window.open happens after the curtain clears. */
      playCurtain(nextLabel, action, "end");
    },
    [playCurtain],
  );

  const value = useMemo(() => ({ goToSection, openOutbound }), [goToSection, openOutbound]);

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
  /** Runs after the curtain mid-point (default: navigate / window.open). */
  onAfterCurtain?: (anchor: HTMLAnchorElement) => void;
} & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "children" | "className" | "target" | "rel" | "aria-label"
>) {
  const { openOutbound } = useNavCurtain();

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented) return;
    if (e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const el = e.currentTarget;
    openOutbound(label, () => {
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
