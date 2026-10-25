import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

/**
 * Single registration point for every GSAP plugin the site uses. Import GSAP
 * from here (never from "gsap" directly) so plugins are always registered and
 * the one house easing (expo.out) is the default.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip, DrawSVGPlugin, useGSAP);
  gsap.defaults({ ease: "expo.out", duration: 1.2 });
}

/** Shared timing language so every section feels like the same hand. */
export const MOTION = {
  /** big headlines and hero lettering */
  display: 1.3,
  /** interface elements, small text */
  ui: 0.6,
  /** gap between staggered siblings */
  stagger: 0.09,
  ease: "expo.out",
  easeInOut: "expo.inOut",
} as const;

export { gsap, ScrollTrigger, SplitText, Flip, DrawSVGPlugin, useGSAP };
