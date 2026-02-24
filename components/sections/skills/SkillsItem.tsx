"use client";

import { motion } from "motion/react";
import Image from "next/image";

interface SkillItemProps {
  title: string;
  imgSrc: string;
}

export default function SkillsItem({ title, imgSrc }: SkillItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="
        group relative
        w-[170px] sm:w-[190px] md:w-[210px]
        rounded-2xl
        border border-white/5
        bg-white/5 dark:bg-white/5
        backdrop-blur-xl
        px-5 py-6
        shadow-[0_0_0_1px_rgba(59,130,246,0.10)]
        transition-all duration-300
        hover:bg-white/10
        hover:shadow-[0_0_0_1px_rgba(59,130,246,0.30),0_18px_60px_-25px_rgba(59,130,246,0.40)]
        cursor-default
      "
    >
      {/* glow blob */}
      <div className="pointer-events-none absolute -top-8 -right-8 h-20 w-20 rounded-full bg-primary/20 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* icon container */}
      <div
        className="relative mx-auto mb-4 flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl
        bg-gradient-to-b from-white/10 to-transparent
        border border-white/5
      "
      >
        <Image
          alt={title}
          src={imgSrc}
          width={96}
          height={96}
          sizes="(max-width: 768px) 64px, 80px"
          className="object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* title */}
      <h4 className="text-center text-[15px] md:text-base font-bold tracking-wide text-text">
        {title}
      </h4>
    </motion.div>
  );
}
