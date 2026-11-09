"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, ExternalLink, XIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { SmartImage } from "@/components/smart-image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Full-screen image viewer: arrows, keyboard, swipe, thumbnails. RTL-aware. */
export function ProjectLightbox({
  images,
  title,
  index,
  onIndexChange,
  open,
  onOpenChange,
}: {
  images: string[];
  title: string;
  index: number;
  onIndexChange: (i: number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("projects");
  const rtl = useLocale() === "ar";
  const [dir, setDir] = useState(1);
  const thumbs = useRef<HTMLDivElement>(null);
  const count = images.length;
  const multi = count > 1;

  const go = useCallback(
    (step: number) => {
      if (!multi) return;
      setDir(step);
      onIndexChange((index + step + count) % count);
    },
    [count, index, multi, onIndexChange],
  );

  const jump = (i: number) => {
    setDir(i > index ? 1 : -1);
    onIndexChange(i);
  };

  // Keyboard: arrows follow reading direction.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(rtl ? -1 : 1);
      else if (e.key === "ArrowLeft") go(rtl ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go, rtl]);

  // Keep the active thumbnail in view.
  useEffect(() => {
    thumbs.current
      ?.querySelector<HTMLElement>(`[data-index="${index}"]`)
      ?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [index, open]);

  const src = images[index];
  // Physical x offset for the slide animation (next slides in from the reading-end side).
  const offset = (d: number) => (rtl ? -d : d) * 80;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex h-dvh max-h-dvh w-screen max-w-none flex-col gap-0 rounded-none border-0 bg-black/95 p-0 text-white shadow-none sm:max-w-none"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{t("imageOf", { current: index + 1, total: count })}</DialogDescription>

        {/* Top bar */}
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{title}</p>
            <p className="font-mono text-xs text-white/60 tabular-nums" dir="ltr">
              {index + 1} / {count}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {src && (
              <Button asChild variant="ghost" size="icon" className="rounded-full text-white/80 hover:bg-white/10 hover:text-white">
                <a href={src} target="_blank" rel="noopener noreferrer" aria-label={t("openOriginal")}>
                  <ExternalLink />
                </a>
              </Button>
            )}
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full text-white/80 hover:bg-white/10 hover:text-white" aria-label={t("close")}>
                <XIcon />
              </Button>
            </DialogClose>
          </div>
        </div>

        {/* Stage */}
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            {src && (
              <motion.div
                key={src}
                custom={dir}
                variants={{
                  enter: (d: number) => ({ opacity: 0, x: offset(d) }),
                  center: { opacity: 1, x: 0 },
                  exit: (d: number) => ({ opacity: 0, x: -offset(d) }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                drag={multi ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  const swipe = info.offset.x + info.velocity.x * 0.2;
                  if (Math.abs(swipe) < 80) return;
                  // Swiping toward the reading-start reveals the next image.
                  go((swipe < 0) !== rtl ? 1 : -1);
                }}
                className="absolute inset-0 px-4 sm:px-20"
              >
                <SmartImage
                  src={src}
                  alt={`${title} ${index + 1}`}
                  fill
                  sizes="100vw"
                  draggable={false}
                  className="pointer-events-none object-contain select-none"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {multi && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => go(-1)}
                aria-label={t("previous")}
                className="absolute start-3 top-1/2 hidden size-11 -translate-y-1/2 rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white sm:inline-flex"
              >
                <ChevronLeft className="size-5 rtl:-scale-x-100" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => go(1)}
                aria-label={t("next")}
                className="absolute end-3 top-1/2 hidden size-11 -translate-y-1/2 rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white sm:inline-flex"
              >
                <ChevronRight className="size-5 rtl:-scale-x-100" />
              </Button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {multi && (
          <div ref={thumbs} className="flex justify-center-safe gap-2 overflow-x-auto px-4 py-4 [scrollbar-width:none]">
            {images.map((img, i) => (
              <button
                key={img}
                type="button"
                data-index={i}
                onClick={() => jump(i)}
                aria-label={t("imageOf", { current: i + 1, total: count })}
                aria-current={i === index}
                className={cn(
                  "relative aspect-[16/10] w-20 shrink-0 overflow-hidden rounded-lg border-2 transition sm:w-24",
                  i === index ? "border-white opacity-100" : "border-transparent opacity-50 hover:opacity-90",
                )}
              >
                <SmartImage src={img} alt="" fill sizes="96px" className="object-cover object-top" />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
