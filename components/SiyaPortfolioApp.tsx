"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  SmoothScrollProvider,
  useSmoothScroll,
} from "@/components/motion/SmoothScrollProvider";
import { IglooWebGLStage } from "@/components/motion/IglooWebGLStage";
import { AmbientGlassBacklight } from "@/components/motion/IglooMotionPrimitives";
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
  const [transitionPulse, setTransitionPulse] = useState(false);
  const formInputRef = useRef<HTMLInputElement | null>(null);
  const { scrollTo } = useSmoothScroll();

  const triggerGlassScroll = (target: string | number) => {
    setTransitionPulse(true);
    scrollTo(target);
    window.setTimeout(() => {
      setTransitionPulse(false);
    }, 520);
  };

  const handleRequestMediaKit = (
    packageName = "single-reel",
    customNote?: string
  ) => {
    setSelectedPackage(packageName);
    if (customNote !== undefined) {
      setPrefilledNote(customNote);
    }
    triggerGlassScroll("#contact");
    window.setTimeout(() => {
      formInputRef.current?.focus({ preventScroll: true });
    }, 900);
  };

  return (
    <div className="relative min-h-screen bg-[#080708] text-[#FAF5F0]">
      {/* Subtle 3D Floating Glass Prism Stage + Ambient Caustics */}
      <IglooWebGLStage />
      <AmbientGlassBacklight />
      <CustomCursor />

      {/* Subtle Frosted Glass Transition Veil on Section Jumps */}
      <AnimatePresence>
        {transitionPulse ? (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none fixed inset-0 z-[115] bg-white/5 backdrop-blur-md"
          />
        ) : null}
      </AnimatePresence>

      <FloatingNavAndMenu
        onRequestMediaKit={(pkg) =>
          handleRequestMediaKit(pkg || "single-reel")
        }
      />

      <main className="relative z-10 overflow-x-hidden">
        <HeroSection
          onRequestMediaKit={(pkg) =>
            handleRequestMediaKit(pkg || "single-reel")
          }
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

