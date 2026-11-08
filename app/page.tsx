import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Work from "@/components/sections/Work";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";

// Static Site Generation: this page is pre-rendered at build time
export const dynamic = "force-static";

export default function HomePage() {
  return (
    <main id="top">
      <Hero />
      <About />
      <Services />
      <Work />
      <Experience />
      <Skills />
      <Contact />
    </main>
  );
}
