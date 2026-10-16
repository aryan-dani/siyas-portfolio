"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type AvatarGroupItem = {
  id: string;
  initials: string;
  name: string;
  subtitle: string;
  accentColor: string;
  bgGradient: string;
};

/**
 * Animate UI - Avatar Group Component
 * Displays overlapping brand/partner avatars and smoothly shifts each avatar
 * forward on hover with a spring-animated floating tooltip.
 * Reference: https://animate-ui.com/docs/components/animate/avatar-group
 */
export function AnimateUIAvatarGroup({
  items,
  className = "",
}: {
  items: AvatarGroupItem[];
  className?: string;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div
      className={`inline-flex items-center -space-x-3.5 ${className}`}
      role="group"
      aria-label="Featured startup and brand collaborators"
    >
      {items.map((item, idx) => {
        const isHovered = hoveredIdx === idx;

        return (
          <div
            key={item.id}
            className="relative inline-flex"
            style={{
              zIndex: isHovered ? 50 : items.length - idx,
            }}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            onFocus={() => setHoveredIdx(idx)}
            onBlur={() => setHoveredIdx(null)}
          >
            {/* Spring Tooltip (Animate UI Tooltip spec: stiffness 300, damping 35) */}
            <AnimatePresence>
              {isHovered ? (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.88 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.92 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 35,
                  }}
                  className="pointer-events-none absolute -top-14 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-xl border border-white/20 bg-[#12070A]/95 px-3.5 py-1.5 text-center shadow-[0_14px_34px_rgba(0,0,0,0.65)] backdrop-blur-md"
                >
                  <p className="font-display text-xs font-bold tracking-tight text-white">
                    {item.name}
                  </p>
                  <p className="font-mono text-[10px] text-rose-300/80">
                    {item.subtitle}
                  </p>
                  {/* Tooltip Caret */}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-r border-b border-white/20 bg-[#12070A]"
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Avatar Circle (Animate UI AvatarGroup spec: stiffness 300, damping 17, translate -30%) */}
            <motion.button
              type="button"
              data-cursor-box
              aria-label={`${item.name} — ${item.subtitle}`}
              animate={{
                y: isHovered ? -10 : 0,
                scale: isHovered ? 1.12 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 17,
              }}
              className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#0d0608] font-display text-xs font-bold tracking-tight text-white shadow-[0_8px_20px_rgba(0,0,0,0.45)] focus:outline-none sm:h-13 sm:w-13"
              style={{
                background: item.bgGradient,
              }}
            >
              <span>{item.initials}</span>
              <span
                aria-hidden="true"
                className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border border-[#0d0608]"
                style={{ backgroundColor: item.accentColor }}
              />
            </motion.button>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Interactive 3D Tilt + Cursor-Tracking Radial Spotlight Card
 */
export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(225, 29, 72, 0.24)",
  enableTilt = true,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  enableTilt?: boolean;
  onClick?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });

    if (enableTilt) {
      const pctX = x / rect.width - 0.5;
      const pctY = y / rect.height - 0.5;
      setTilt({
        rotateX: -pctY * 7,
        rotateY: pctX * 7,
      });
    }
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 22,
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      className={`group relative overflow-hidden ${className}`}
    >
      {/* Dynamic Cursor-Following Spotlight Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px z-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(520px circle at ${coords.x}px ${coords.y}px, ${spotlightColor}, transparent 45%)`,
        }}
      />
      <div className="relative z-10 h-full w-full">{children}</div>
    </motion.div>
  );
}

/**
 * Animate UI - Spring Sliding Pill Tabs
 */
export function AnimatedFilterTabs({
  tabs,
  activeTab,
  onChange,
  layoutId = "siya-animated-tabs",
}: {
  tabs: { id: string; label: string; count?: number }[];
  activeTab: string;
  onChange: (id: string) => void;
  layoutId?: string;
}) {
  return (
    <div
      role="tablist"
      className="inline-flex flex-wrap items-center gap-1 rounded-full border border-white/12 bg-white/[0.04] p-1.5 backdrop-blur-md"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            data-cursor-box
            onClick={() => onChange(tab.id)}
            className={`relative rounded-full px-4 py-2 font-mono text-xs transition-colors duration-200 ${
              isActive ? "text-[#0d0608] font-semibold" : "text-cream/70 hover:text-white"
            }`}
          >
            {isActive ? (
              <motion.span
                layoutId={layoutId}
                transition={{
                  type: "spring",
                  stiffness: 340,
                  damping: 28,
                }}
                className="absolute inset-0 rounded-full bg-cream shadow-[0_4px_20px_rgba(255,255,255,0.25)]"
              />
            ) : null}
            <span className="relative z-10 inline-flex items-center gap-1.5">
              <span>{tab.label}</span>
              {typeof tab.count === "number" ? (
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isActive
                      ? "bg-[#0d0608]/15 text-[#0d0608]"
                      : "bg-white/10 text-cream/60"
                  }`}
                >
                  {tab.count}
                </span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
