"use client";
import Link from "next/link";
import React from "react";
import { motion } from "motion/react";

interface AltBtnProps {
  title: string;
  isBtn?: boolean;
  linkPath?: string;
  handleClickEvent?: () => void;
}

const buttonClasses =
  "flex items-center justify-center py-3 px-6 md:py-3.5 md:px-8 bg-primary-10  h-[40px] text-text text-sm md:text-base font-bold capitalize transition-all duration-300 ease-out hover:text-primary hover:bg-primary-20 hover:shadow-light-shadow border-2 border-primary-20 hover:border-primary/40 rounded-md";

export default function AltBtn({
  title,
  isBtn = true,
  linkPath,
  handleClickEvent,
}: AltBtnProps) {
  const buttonContent = (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={buttonClasses}
    >
      {title}
    </motion.div>
  );

  return (
    <>
      {isBtn ? (
        <button
          onClick={handleClickEvent}
          className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
        >
          {buttonContent}
        </button>
      ) : (
        <Link
          href={linkPath ? linkPath : "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
        >
          {buttonContent}
        </Link>
      )}
    </>
  );
}
