"use client";
import { motion, easeOut } from "motion/react";
import Image from "next/image";

interface SkillItemProps {
  title: string;
  imgSrc: string;
  define: string;
}

export default function SkillsItem({ title, imgSrc, define }: SkillItemProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: easeOut,
      },
    },
  };
  return (
    <motion.div
      className="flex flex-col items-center gap-4 p-6 rounded-xl bg-main-bg border-2 border-primary-20 hover:border-primary/40 hover:shadow-light-shadow transition-all duration-300 ease-out cursor-default"
      variants={itemVariants}
      whileHover={{ y: -8, scale: 1.05 }}
    >
      <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
        <Image
          alt={title}
          src={imgSrc}
          width={96}
          height={96}
          sizes="(max-width: 768px) 80px, 96px"
          className="object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <h4 className="text-text font-bold text-base md:text-lg text-center">
        {title}
      </h4>
      <p className="p-3 capitalize text-muted text-xs md:text-sm font-semibold rounded-lg bg-primary-10 border border-primary/20 text-center">
        {define}
      </p>
    </motion.div>
  );
}
