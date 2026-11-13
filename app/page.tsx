import { ViewTransition } from "react";
import { Intro } from "@/components/motion/Intro";
import { Hero } from "@/components/sections/Hero";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Gallery } from "@/components/sections/Gallery";
import { Numbers } from "@/components/sections/Numbers";
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
        <Hero />
        <SelectedWork />
        <Gallery />
        <Numbers />
        <Contact />
        <Footer />
      </main>
    </ViewTransition>
  );
}
