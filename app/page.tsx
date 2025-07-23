"use client";
import HeroSection from "@/components/main/HeroSection";
import Skills from "@/components/main/Skills";
import About from "@/components/main/About";
import Projects from "@/components/main/Projects";
import Contact from "@/components/main/Contact";

export default function page() {
  return (
    <div className="flex flex-col sm:gap-20 md:gap-40">
      <HeroSection />
      <About />
      <Skills />
      <Projects />
      <Contact />
    </div>
  );
}
