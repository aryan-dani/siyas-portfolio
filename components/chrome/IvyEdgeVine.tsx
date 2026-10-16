"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/hooks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function IvyEdgeVine() {
  const leftPathRef = useRef<SVGPathElement | null>(null);
  const rightPathRef = useRef<SVGPathElement | null>(null);
  const leavesRef = useRef<SVGGElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const leftPath = leftPathRef.current;
    const rightPath = rightPathRef.current;
    if (!leftPath || !rightPath) return;

    const leftLen = leftPath.getTotalLength();
    const rightLen = rightPath.getTotalLength();

    gsap.set(leftPath, {
      strokeDasharray: leftLen,
      strokeDashoffset: leftLen * 0.88,
    });
    gsap.set(rightPath, {
      strokeDasharray: rightLen,
      strokeDashoffset: rightLen * 0.88,
    });

    const ctx = gsap.context(() => {
      gsap.to([leftPath, rightPath], {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      if (leavesRef.current) {
        const leaves = leavesRef.current.querySelectorAll(".ivy-leaf");
        gsap.fromTo(
          leaves,
          { scale: 0.2, opacity: 0, transformOrigin: "center center" },
          {
            scale: 1,
            opacity: 0.55,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: document.documentElement,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.8,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[45] overflow-hidden"
    >
      {/* Left edge botanical ivy vine */}
      <svg
        viewBox="0 0 60 1200"
        preserveAspectRatio="none"
        className="absolute top-0 left-0 h-full w-8 opacity-65 md:w-12"
        fill="none"
      >
        <path
          ref={leftPathRef}
          d="M 12 0 C 34 150, 6 310, 26 460 C 44 610, 8 770, 28 930 C 42 1060, 14 1140, 22 1200"
          stroke="#3E5A3A"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <g ref={leavesRef} fill="#3E5A3A">
          <path
            className="ivy-leaf"
            d="M 24 180 C 38 172, 44 184, 30 194 C 24 188, 22 184, 24 180 Z"
          />
          <path
            className="ivy-leaf"
            d="M 16 360 C 4 352, 2 366, 14 374 C 18 368, 18 364, 16 360 Z"
          />
          <path
            className="ivy-leaf"
            d="M 30 530 C 44 522, 48 536, 34 544 C 30 538, 28 534, 30 530 Z"
          />
          <path
            className="ivy-leaf"
            d="M 18 740 C 6 732, 4 746, 16 754 C 20 748, 20 744, 18 740 Z"
          />
          <path
            className="ivy-leaf"
            d="M 28 950 C 42 942, 46 956, 32 964 C 28 958, 26 954, 28 950 Z"
          />
        </g>
      </svg>

      {/* Right edge botanical ivy vine */}
      <svg
        viewBox="0 0 60 1200"
        preserveAspectRatio="none"
        className="absolute top-0 right-0 h-full w-8 opacity-65 md:w-12"
        fill="none"
      >
        <path
          ref={rightPathRef}
          d="M 48 0 C 26 160, 52 330, 32 490 C 16 650, 50 810, 30 960 C 18 1080, 46 1150, 38 1200"
          stroke="#3E5A3A"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <g fill="#3E5A3A" opacity="0.5">
          <path d="M 36 240 C 22 232, 18 246, 32 254 C 36 248, 38 244, 36 240 Z" />
          <path d="M 42 610 C 54 602, 56 616, 44 624 C 40 618, 40 614, 42 610 Z" />
          <path d="M 32 880 C 18 872, 14 886, 28 894 C 32 888, 34 884, 32 880 Z" />
        </g>
      </svg>
    </div>
  );
}
