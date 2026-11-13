"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotionNow } from "@/lib/hooks";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";

type NavCurtainContextValue = {
  goToSection: (href: string, label: string) => void;
};

const NavCurtainContext = createContext<NavCurtainContextValue>({
  goToSection: () => {},
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

  const goToSection = useCallback(
    (href: string, nextLabel: string) => {
      if (busyRef.current) return;
      busyRef.current = true;

      if (prefersReducedMotionNow()) {
        scrollTo(href, { offset: -24, immediate: true });
        busyRef.current = false;
        return;
      }

      setLabel(nextLabel);

      requestAnimationFrame(() => {
        const overlay = overlayRef.current;
        const title = titleRef.current;
        if (!overlay || !title) {
          scrollTo(href, { offset: -24 });
          busyRef.current = false;
          setLabel(null);
          return;
        }

        const tl = gsap.timeline({
          onComplete: () => {
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
          )
          .add(() => {
            scrollTo(href, { offset: -20, immediate: true });
          })
          .to({}, { duration: 0.28 })
          .to(title, { autoAlpha: 0, y: -16, duration: 0.4, ease: "power2.in" })
          .to(overlay, { autoAlpha: 0, duration: 0.45, ease: "power2.inOut" }, "-=0.12");
      });
    },
    [scrollTo],
  );

  const value = useMemo(() => ({ goToSection }), [goToSection]);

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
