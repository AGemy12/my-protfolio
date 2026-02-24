"use client";
import React from "react";
import { motion } from "motion/react";

interface MainBtnProps {
  title: string;
  handleClickEvent: () => void;
}

export default function MainBtn({ title, handleClickEvent }: MainBtnProps) {
  return (
    <motion.button
      type="button"
      onClick={handleClickEvent}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="group flex items-center justify-center bg-primary text-text dark:text-white capitalize text-sm font-bold px-[30px] h-[40px] duration-300 hover:text-primary dark:hover:text-white hover:bg-primary hover:shadow-shadow relative before:absolute before:inset-[2px] before:bg-main-bg overflow-hidden transition-all ease-out rounded-md"
    >
      <span className="relative z-[1]">{title}</span>
      <i className="absolute inset-0 block z-0 before:absolute before:top-0 before:left-4/5 before:w-2.5 before:h-1 before:bg-main-bg before:-translate-x-1/2 before:skew-[325deg] before:duration-300 group-hover:before:w-5 group-hover:before:left-1/5 after:absolute after:bottom-0 after:left-1/5 after:w-2.5 after:h-1 after:bg-main-bg after:-translate-x-1/2 after:skew-[325deg] after:duration-300 group-hover:after:w-5 group-hover:after:left-4/5"></i>
    </motion.button>
  );
}
