"use client";

import React, { useRef, useState } from "react";
import {
  SmoothScrollProvider,
  useSmoothScroll,
} from "@/components/motion/SmoothScrollProvider";
import { IglooWebGLStage } from "@/components/motion/IglooWebGLStage";
import { AmbientGlassBacklight } from "@/components/motion/IglooMotionPrimitives";
import {
  IntroTypingPreloader,
  NavTransitionMeta,
  SECTION_TRANSITION_META,
  SectionNavigationCurtain,
} from "@/components/motion/StudioIntroAndTransitions";
import { CustomCursor } from "@/components/chrome/CustomCursor";
import { FloatingNavAndMenu } from "@/components/chrome/FloatingNavAndMenu";
import { HeroSection } from "@/components/sections/HeroSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { ProofSection } from "@/components/sections/ProofSection";
import { AboutRoomSection } from "@/components/sections/AboutRoomSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ContactSection } from "@/components/sections/ContactSection";

function PortfolioInner() {
  const [selectedPackage, setSelectedPackage] = useState<string>("single-reel");
  const [prefilledNote, setPrefilledNote] = useState<string>("");
  const [activeTransitionMeta, setActiveTransitionMeta] =
    useState<NavTransitionMeta | null>(null);
  const formInputRef = useRef<HTMLInputElement | null>(null);
  const { scrollTo } = useSmoothScroll();

  const navigateToSection = (target: string | number) => {
    const key = typeof target === "number" ? "#top" : target;
    const meta =
      SECTION_TRANSITION_META[key] ?? SECTION_TRANSITION_META["#top"];

    setActiveTransitionMeta(meta);

    window.setTimeout(() => {
      scrollTo(target === "#top" ? 0 : target);
    }, 240);

    window.setTimeout(() => {
      setActiveTransitionMeta(null);
    }, 680);
  };

  const handleRequestMediaKit = (
    packageName = "single-reel",
    customNote?: string
  ) => {
    setSelectedPackage(packageName);
    if (customNote !== undefined) {
      setPrefilledNote(customNote);
    }
    navigateToSection("#contact");
    window.setTimeout(() => {
      formInputRef.current?.focus({ preventScroll: true });
    }, 1050);
  };

  return (
    <div className="relative min-h-screen bg-[#080708] text-[#FAF5F0]">
      {/* Opening Monumental @HEARTSFROMSIYA Typing Intro & Curtain Reveal */}
      <IntroTypingPreloader />

      {/* Section-to-Section Smoked-Glass Curtain Transition */}
      <SectionNavigationCurtain activeMeta={activeTransitionMeta} />

      {/* Subtle 3D Floating Glass Prism Stage + Ambient Caustics */}
      <IglooWebGLStage />
      <AmbientGlassBacklight />
      <CustomCursor />

      <FloatingNavAndMenu
        onRequestMediaKit={(pkg) =>
          handleRequestMediaKit(pkg || "single-reel")
        }
        onNavigateSection={(href) => navigateToSection(href)}
      />

      <main className="relative z-10 overflow-x-hidden">
        <HeroSection
          onRequestMediaKit={(pkg) =>
            handleRequestMediaKit(pkg || "single-reel")
          }
          onNavigateSection={(href) => navigateToSection(href)}
        />
        <WorkSection
          onRequestMediaKit={() => handleRequestMediaKit("single-reel")}
        />
        <ProofSection
          onRequestMediaKit={() => handleRequestMediaKit("media-kit")}
        />
        <AboutRoomSection />
        <ServicesSection
          onSelectService={(pkg, customNote) =>
            handleRequestMediaKit(pkg, customNote)
          }
        />
        <ContactSection
          selectedPackage={selectedPackage}
          prefilledNote={prefilledNote}
          perkCode={null}
          formInputRef={formInputRef}
          onNavigateSection={(href) => navigateToSection(href)}
        />
      </main>
    </div>
  );
}

export function SiyaPortfolioApp() {
  return (
    <SmoothScrollProvider>
      <PortfolioInner />
    </SmoothScrollProvider>
  );
}


