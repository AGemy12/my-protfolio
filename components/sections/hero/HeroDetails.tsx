"use client";
import { motion } from "motion/react";
import MainBtn from "@/components/buttons/MainBtn";
import AltBtn from "@/components/buttons/AltBtn";
import SocialLinks from "./SocialLinks";

export default function HeroDetails() {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/assets/media/cv/cv.pdf";
    link.download = "cv.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.8, 0.25, 1] }}
      className="flex flex-col gap-6 md:gap-8 lg:gap-10 justify-center w-full"
    >
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 w-fit"
      >
        <span className="text-primary text-xs md:text-sm font-semibold uppercase tracking-wider">
          Frontend Web Developer
        </span>
      </motion.div>

      {/* Main Headline */}
      <div className="space-y-2 md:space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] text-text"
        >
          Hello, I&apos;m{" "}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Ahmad
          </span>
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] text-primary uppercase tracking-tight"
        >
          Marzouk
        </motion.h2>
      </div>

      {/* Value Proposition */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="text-base md:text-lg lg:text-xl text-muted leading-relaxed max-w-2xl"
      >
        I specialize in building{" "}
        <span className="text-text font-semibold">seamless and responsive</span>{" "}
        web interfaces, combining clean code with creative design to deliver{" "}
        <span className="text-primary font-semibold">
          outstanding user experiences
        </span>
        .
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex flex-wrap items-center gap-4 md:gap-6"
      >
        <MainBtn title="Download My CV" handleClickEvent={handleDownload} />
        <AltBtn
          title="Contact Me"
          isBtn={false}
          linkPath="https://web.whatsapp.com/send?phone=01149560988&text="
        />
      </motion.div>

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <SocialLinks />
      </motion.div>
    </motion.div>
  );
}
