import React from "react";
import MyPhoto from "../sections/hero/MyPhoto";
import HeroDetails from "../sections/hero/HeroDetails";

export default function HeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-main-bg to-primary/10 pt-0"
      id="hero"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(51,153,255,0.1),transparent_50%)] pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <HeroDetails />
        <MyPhoto />
      </div>
    </section>
  );
}
