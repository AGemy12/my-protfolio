"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

/**
 * Brand loader: the "Stack A" mark builds itself layer by layer — database,
 * API, then the ember interface tip drops into place — inside a hairline ring
 * with a rotating ember arc. It fades in after a short delay, so quick
 * navigations never flash it. Styles live in globals.css (`.loader*`).
 */
export function Loader({
  label,
  className,
  ...props
}: { label?: string } & React.ComponentProps<"div">) {
  const t = useTranslations("loader");
  const text = label ?? t("label");

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("loader flex flex-col items-center gap-6", className)}
      {...props}
    >
      <div className="relative grid size-24 place-items-center" aria-hidden="true">
        <span className="loader-glow absolute inset-0 rounded-full" />
        <span className="absolute inset-0 rounded-full border border-border" />
        <span className="loader-arc absolute -inset-px rounded-full" />
        <svg
          viewBox="0 0 64 64"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinejoin="round"
          className="size-11 overflow-visible text-heading"
        >
          <polygon points="14.6,43.5 49.4,43.5 55.6,56 40.5,56 32,47.5 23.5,56 8.4,56" className="loader-layer loader-layer-1" />
          <polygon points="23,26.5 41,26.5 47.2,39 16.8,39" className="loader-layer loader-layer-2" />
          <polygon points="32,8 39,22 25,22" className="loader-layer loader-layer-3 text-brand" />
        </svg>
      </div>

      <div className="flex flex-col items-center gap-3">
        <p className="text-[0.7rem] font-medium tracking-[0.32em] text-muted-foreground uppercase rtl:text-xs rtl:tracking-normal">
          {text}
          <span className="loader-dots" aria-hidden="true">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </p>
        <span className="loader-bar relative block h-px w-28 overflow-hidden rounded-full bg-border rtl:-scale-x-100" aria-hidden="true" />
      </div>
    </div>
  );
}

/** Centres the loader in the space a page would take. */
export function PageLoader({ className }: { className?: string }) {
  return (
    <div className={cn("grid min-h-[70dvh] place-items-center px-4", className)}>
      <Loader />
    </div>
  );
}
