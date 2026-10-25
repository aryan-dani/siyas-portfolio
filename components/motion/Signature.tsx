"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { SIGNATURE_SIYA } from "@/lib/signature-paths";
import { prefersReducedMotionNow } from "@/lib/hooks";

/**
 * "Siya" in the script face, as outline path data. It is "written" by drawing
 * the outline with GSAP DrawSVG, then letting the ink fill in.
 */
export function buildSignatureTimeline(
  path: SVGPathElement,
  { draw = 1.8, paused = true }: { draw?: number; paused?: boolean } = {}
) {
  const tl = gsap.timeline({ paused });
  tl.fromTo(
    path,
    { drawSVG: "0%" },
    { drawSVG: "100%", duration: draw, ease: "power2.inOut" }
  )
    .to(path, { fillOpacity: 1, duration: draw * 0.55, ease: "power1.inOut" }, draw * 0.45)
    .to(path, { strokeOpacity: 0, duration: draw * 0.35, ease: "power1.out" }, draw * 0.85);
  return tl;
}

export function SignaturePath({
  pathRef,
  strokeWidth = 1.2,
}: {
  pathRef: React.Ref<SVGPathElement>;
  strokeWidth?: number;
}) {
  return (
    <path
      ref={pathRef}
      d={SIGNATURE_SIYA.d}
      fill="currentColor"
      fillOpacity={0}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    />
  );
}

/** A signature that writes itself when scrolled into view. */
export function Signature({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const svg = svgRef.current;
      const path = pathRef.current;
      if (!svg || !path || prefersReducedMotionNow()) {
        // No motion: show the finished signature.
        if (path) path.setAttribute("fill-opacity", "1");
        if (path) path.setAttribute("stroke-opacity", "0");
        return;
      }
      const tl = buildSignatureTimeline(path, { draw: 2.2 });
      gsap.set(path, { drawSVG: "0%" });
      gsap.set(svg, { opacity: 1 });
      const st = ScrollTrigger.create({
        trigger: svg,
        start: "top 85%",
        once: true,
        onEnter: () => tl.play(),
      });
      return () => st.kill();
    },
    { scope: svgRef }
  );

  return (
    <svg
      ref={svgRef}
      data-reveal="signature"
      viewBox={SIGNATURE_SIYA.viewBox}
      className={className}
      role="img"
      aria-label="Siya"
    >
      <SignaturePath pathRef={pathRef} />
    </svg>
  );
}
