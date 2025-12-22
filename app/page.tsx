import HeroSection from "@/components/main/HeroSection";
import Skills from "@/components/main/Skills";
import About from "@/components/main/About";
import Projects from "@/components/main/Projects";
import Contact from "@/components/main/Contact";

// Static Site Generation - This page is pre-rendered at build time
export const dynamic = "force-static";

export default function HomePage() {
  return (
    <main className="flex flex-col">
      <HeroSection />
      <About />
      <Skills />
      <Projects />
      <Contact />
    </main>
  );
}
