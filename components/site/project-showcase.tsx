import { ArrowUpRight } from "lucide-react";
import { SmartImage } from "@/components/smart-image";
import { tr, type Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProjectDialog } from "./project-dialog";

/**
 * Quiet gallery tile: the screenshot in a soft frame with plenty of air, and a
 * one-line caption beneath it. Hover only zooms the image slowly, draws a
 * hairline under the title and lets a small arrow drift in.
 * The whole tile opens the project dialog.
 */
export function ShowcaseCard({
  project: p,
  locale,
  labels,
  lead = false,
  priority,
}: {
  project: Project;
  locale: string;
  labels: { category: string; featured?: string };
  lead?: boolean;
  priority?: boolean;
}) {
  const title = tr(p.title, locale);

  return (
    <article className="card-hover relative">
      {/* Press feedback on touch: the frame gives a little under the finger. */}
      <div
        className={cn(
          "relative isolate overflow-hidden rounded-2xl bg-muted transition-transform duration-300 ease-out active:scale-[0.985]",
          lead ? "aspect-16/10 md:aspect-[2.1/1]" : "aspect-16/10",
        )}
      >
        {p.cover ? (
          <SmartImage
            src={p.cover}
            alt={title}
            fill
            priority={priority}
            sizes={lead ? "(min-width: 1152px) 1104px, 100vw" : "(min-width: 1152px) 540px, (min-width: 640px) 50vw, 100vw"}
            // Only `transform` animates, on its own GPU layer, so the zoom stays smooth.
            className="object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform backface-hidden card-on:scale-[1.035]"
          />
        ) : (
          <div className="bg-metal absolute inset-0 grid place-items-center">
            <span className="text-5xl font-light text-(--metal-dim) transition-colors duration-500 card-on:text-brand">
              {title.slice(0, 2)}
            </span>
          </div>
        )}
        {/* Dark mode: a soft veil keeps bright screenshots calm; it lifts on hover (opacity only). */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden bg-black/15 transition-opacity duration-700 card-on:opacity-0 dark:block"
        />
        {/* Hairline frame that warms to the brand orange on hover. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/[0.06] ring-inset dark:ring-white/[0.07]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-brand/60 ring-inset transition-opacity duration-500 card-on:opacity-100"
        />
      </div>

      <div className={cn("flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6", lead ? "mt-6" : "mt-5")}>
        <div className="min-w-0">
          {lead && labels.featured && <p className="mb-2 text-xs tracking-wide text-brand">{labels.featured}</p>}
          <h3
            className={cn(
              "leading-snug text-heading transition-colors duration-300 card-on:text-brand",
              lead ? "text-xl font-semibold sm:text-2xl" : "text-lg font-medium",
            )}
          >
            <ProjectDialog
              project={p}
              className="cursor-pointer text-start after:absolute after:-inset-2 after:rounded-3xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring focus-visible:after:ring-offset-4 focus-visible:after:ring-offset-background"
            >
                {/* Orange hairline that draws in from the reading start. */}
                <span className="bg-linear-to-r from-brand to-brand bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] card-on:bg-[length:100%_1px] rtl:bg-right-bottom">
                  {title}
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="ms-1.5 inline size-4 align-[-0.1em] text-brand opacity-0 transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ltr:-translate-x-1.5 ltr:translate-y-1 rtl:translate-x-1.5 rtl:translate-y-1 rtl:-scale-x-100 card-on:translate-0 card-on:opacity-100"
                />
            </ProjectDialog>
          </h3>
          {lead && (
            <p className="mt-2 line-clamp-2 max-w-[60ch] text-[15px] leading-relaxed text-pretty text-muted-foreground">
              {tr(p.summary, locale)}
            </p>
          )}
        </div>
        <p className="shrink-0 text-sm whitespace-nowrap text-muted-foreground transition-colors duration-300 card-on:text-foreground">
          {labels.category}
          {p.year ? <span className="tabular-nums"> · {p.year}</span> : null}
        </p>
      </div>
    </article>
  );
}
