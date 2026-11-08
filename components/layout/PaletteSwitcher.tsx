"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useAppearance } from "@/contexts/ThemeContext";
import { palettes } from "@/data/portfolio";
import { CheckIcon } from "@/components/ui/Icons";
import { iconButton } from "@/components/layout/ThemeToggle";

export default function PalettePicker() {
  const t = useTranslations();
  const { palette, setPalette } = useAppearance();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={t("nav.palette")}
        title={t("nav.palette")}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className={iconButton}
      >
        <span className="h-3.5 w-3.5 rounded-full bg-accent ring-[3px] ring-accent-soft" />
      </button>

      {open && (
        <div
          id={menuId}
          role="radiogroup"
          aria-label={t("nav.palette")}
          className="absolute end-0 top-[calc(100%+10px)] z-30 w-[220px] animate-fade-in rounded-2xl border border-line bg-surface p-1.5 shadow-[0_10px_30px_rgb(0_0_0/0.08)] [animation-duration:0.35s]"
        >
          {palettes.map((p) => {
            const active = p.id === palette;
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => {
                  setPalette(p.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-[14.5px] transition-colors duration-200 hover:bg-panel ${
                  active ? "text-fg" : "text-muted"
                }`}
              >
                <span
                  className="grid h-6 w-6 flex-none place-items-center rounded-full border border-line"
                  style={{ background: p.bg }}
                >
                  <span className="h-3 w-3 rounded-full" style={{ background: p.accent }} />
                </span>
                <span className="flex-1">{t(`palettes.${p.id}`)}</span>
                {active && <CheckIcon className="text-accent" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
