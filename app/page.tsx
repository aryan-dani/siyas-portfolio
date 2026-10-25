import { ViewTransition } from "react";
import { Intro } from "@/components/motion/Intro";
import { SectionTheme } from "@/components/motion/SectionTheme";
import { Hero } from "@/components/sections/Hero";
import { Statement } from "@/components/sections/Statement";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Numbers } from "@/components/sections/Numbers";
import { About } from "@/components/sections/About";
import { Rates } from "@/components/sections/Rates";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <ViewTransition
      enter={{ "nav-forward": "page-in", "nav-back": "page-in", default: "none" }}
      exit={{ "nav-forward": "page-out", "nav-back": "page-out", default: "none" }}
      default="none"
    >
      <main id="main">
        <Intro />
        <SectionTheme />
        <Hero />
        <Statement />
        <SelectedWork />
        <Numbers />
        <About />
        <Rates />
        <Contact />
        <Footer />
      </main>
    </ViewTransition>
  );
}
