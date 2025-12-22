"use client";
import { ElementType } from "react";
import { motion } from "motion/react";

interface SimpleBtnProps {
  title: string;
  type?: "button" | "submit" | "reset";
  customStyle?: string;
  hasIcon?: boolean;
  Icon?: ElementType;
  handleClickEvent?: () => void;
}

export default function SimpleBtn({
  title,
  type = "button",
  hasIcon,
  Icon,
  customStyle,
  handleClickEvent,
}: SimpleBtnProps) {
  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center justify-center gap-2 rounded-lg border-2 border-primary bg-primary-50 min-w-[120px] py-2.5 px-4 transition-all duration-300 ease-out hover:bg-primary hover:text-white hover:shadow-light-shadow ${customStyle}`}
      onClick={handleClickEvent}
    >
      <span className="text-text capitalize text-sm font-bold transition-colors duration-300">
        {" "}
        {title}{" "}
      </span>
      {hasIcon && Icon && (
        <Icon className="text-xl text-text transition-colors duration-300" />
      )}
    </motion.button>
  );
}
