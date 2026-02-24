"use client";

import { motion } from "motion/react";
import Image from "next/image";

export default function MyPhoto() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex justify-center"
    >
      {/* Soft radial glow */}
      <div className="absolute inset-0 flex justify-center">
        <div className="w-[380px] sm:w-[420px] md:w-[480px] h-[380px] sm:h-[420px] md:h-[480px] bg-primary/10 blur-3xl rounded-full" />
      </div>

      {/* Outer soft shadow layer */}
      <div className="relative group">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary/30 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

        {/* Glass card */}
        <div
          className="
            relative rounded-3xl
            border border-white/10
            bg-gradient-to-b from-white/10 to-white/5
            backdrop-blur-lg
            shadow-[0_25px_80px_-25px_rgba(0,0,0,0.5)]
            overflow-hidden
            transition-all duration-500
          "
        >
          <Image
            src="/assets/media/my-photo.png"
            alt="Ahmad Marzouk"
            width={600}
            height={600}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      </div>
    </motion.div>
  );
}
