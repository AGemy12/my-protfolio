"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Cycles through the roles set in the dashboard (Settings → hero roles). */
export function RotatingRoles({ roles }: { roles: string[] }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (roles.length < 2) return;
    const id = setInterval(() => setI((v) => (v + 1) % roles.length), 2800);
    return () => clearInterval(id);
  }, [roles.length]);

  if (!roles.length) return null;

  return (
    <span className="relative inline-grid overflow-hidden py-0.5 align-middle">
      <span className="sr-only">{roles.join(" / ")}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={i}
          aria-hidden
          className="block font-medium whitespace-nowrap text-heading"
          initial={{ y: "70%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-70%", opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          {roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
