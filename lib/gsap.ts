import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

/**
 * Single registration point for every GSAP plugin the site uses. Import GSAP
 * from here (never from "gsap" directly) so plugins are always registered and
 * the one house easing (expo.out) is the default.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip, DrawSVGPlugin, CustomEase, useGSAP);
  CustomEase.create("soft", "0.22, 1, 0.36, 1");
  gsap.defaults({ ease: "expo.out", duration: 1.2 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** Shared timing language so every section feels like the same hand. */
export const MOTION = {
  /** big headlines and hero lettering */
  display: 1.3,
  /** interface elements, small text */
  ui: 0.6,
  /** gap between staggered siblings */
  stagger: 0.09,
  /** hover / press / magnetic settle */
  soft: 0.45,
  ease: "expo.out",
  easeInOut: "expo.inOut",
  /** softer hover/press curve registered as CustomEase "soft" */
  easeSoft: "soft",
} as const;

export { gsap, ScrollTrigger, SplitText, Flip, DrawSVGPlugin, CustomEase, useGSAP };
