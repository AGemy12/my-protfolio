import React from "react";
import MyPhoto from "../sections/hero/MyPhoto";
import HeroDetails from "../sections/hero/HeroDetails";

export default function HeroSection() {
  return (
    <div
      className="relative w-full overflow-hidden min-h-screen flex items-center justify-center"
      id="hero"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 container mx-auto ">
        <HeroDetails />
        <MyPhoto />
      </div>
    </div>
  );
}
