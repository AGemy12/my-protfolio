"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowUp } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";

/** Shown once the visitor is most of a screen down the page. */
const threshold = () => Math.min(600, window.innerHeight * 0.8);

/**
 * Floating "back to top" button. The ring around it fills with scroll progress,
 * it springs in once the page is scrolled, and sits at the inline end (right in
 * English, left in Arabic), clear of the phone's home indicator.
 */
export function ScrollTop() {
  const t = useTranslations("nav");
  const reduce = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  const [visible, setVisible] = useState(false);

  // Covers a reload mid-page, before any scroll event fires.
  useEffect(() => setVisible(window.scrollY > threshold()), []);
  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > threshold()));

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label={t("top")}
          onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
          initial={{ opacity: 0, scale: 0.6, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 16 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
          className="group fixed inset-e-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 grid size-12 place-items-center rounded-full border bg-background/80 text-heading shadow-lg shadow-black/5 backdrop-blur-xl transition-colors duration-300 outline-none hover:border-brand/40 hover:bg-brand hover:text-brand-foreground focus-visible:ring-[3px] focus-visible:ring-brand/40 sm:inset-e-6 sm:bottom-[max(1.5rem,env(safe-area-inset-bottom))] sm:size-13 dark:shadow-black/30"
        >
          {/* Scroll progress ring, drawn just inside the border. */}
          <svg viewBox="0 0 48 48" aria-hidden className="pointer-events-none absolute inset-0 size-full -rotate-90">
            <circle cx="24" cy="24" r="22" fill="none" strokeWidth="2" className="stroke-border/60" />
            <motion.circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              className="stroke-brand transition-colors duration-300 group-hover:stroke-brand-foreground/70"
              style={{ pathLength: progress }}
            />
          </svg>
          <ArrowUp
            strokeWidth={2.25}
            className="size-[1.15rem] transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
