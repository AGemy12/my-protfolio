import { ArrowUpRight, Lock } from "lucide-react";
import { SmartImage } from "@/components/smart-image";
import { tr, type Project } from "@/lib/types";
import { ProjectDialog } from "./project-dialog";

export function ProjectCard({
  project: p,
  locale,
  labels,
  priority,
  deepLink,
}: {
  project: Project;
  locale: string;
  labels: { category: string; private: string; details?: string };
  priority?: boolean;
  /** Sync the open dialog with `#slug` in the URL (used on the projects page). */
  deepLink?: boolean;
}) {
  const title = tr(p.title, locale);
  const tech = p.tech.slice(0, 4);
  const extra = p.tech.length - tech.length;
  const isPrivate = !p.liveUrl && !p.repoUrl;

  return (
    <article className="group relative isolate flex h-full flex-col overflow-hidden rounded-3xl border bg-card p-2 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-2xl hover:shadow-brand/10">
      {/* soft glow behind the body on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-24 start-1/2 -z-10 size-64 -translate-x-1/2 rounded-full bg-brand/15 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100 rtl:translate-x-1/2"
      />

      {/* framed cover */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-[1.1rem] bg-muted ring-1 ring-border/70 ring-inset">
        {p.cover ? (
          <SmartImage
            src={p.cover}
            alt={title}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-top transition duration-[1200ms] ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <div className="bg-grid absolute inset-0 grid place-items-center bg-linear-to-br from-brand-soft to-transparent">
            <span className="font-mono text-5xl font-semibold tracking-tight text-brand/40">{title.slice(0, 2)}</span>
          </div>
        )}

        {/* hover veil + call to action */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {labels.details && (
          <span className="pointer-events-none absolute inset-x-0 bottom-4 mx-auto flex w-fit translate-y-3 items-center gap-1.5 rounded-full bg-white/95 px-4 py-1.5 text-sm font-medium text-neutral-900 opacity-0 shadow-lg transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            {labels.details}
            <ArrowUpRight className="size-4 rtl:-scale-x-100" />
          </span>
        )}

        {/* meta chips */}
        <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
          <span className="rounded-full border border-white/20 bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            {labels.category}
          </span>
          {p.year ? (
            <span className="rounded-full border border-white/20 bg-black/45 px-2.5 py-1 font-mono text-[11px] text-white/90 tabular-nums backdrop-blur-md">
              {p.year}
            </span>
          ) : null}
        </div>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col px-4 pt-5 pb-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg leading-snug font-semibold tracking-tight text-balance">
            <ProjectDialog project={p} deepLink={deepLink}>
              <button
                type="button"
                className="cursor-pointer text-start transition-colors after:absolute after:inset-0 after:rounded-3xl group-hover:text-brand focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring"
              >
                {title}
              </button>
            </ProjectDialog>
          </h3>
          <span className="grid size-9 shrink-0 place-items-center rounded-full border text-muted-foreground transition-all duration-500 group-hover:rotate-45 group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground rtl:group-hover:-rotate-45">
            <ArrowUpRight className="size-4 rtl:-scale-x-100" />
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-pretty text-muted-foreground">
          {tr(p.summary, locale)}
        </p>

        <div className="mt-auto pt-5">
          <div className="mb-4 h-px bg-linear-to-r from-border via-border to-transparent rtl:bg-linear-to-l" />
          <ul className="flex flex-wrap items-center gap-1.5" dir="ltr">
            {tech.map((t) => (
              <li
                key={t}
                className="rounded-full border bg-background/60 px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors group-hover:border-brand/25"
              >
                {t}
              </li>
            ))}
            {extra > 0 && (
              <li className="px-1 font-mono text-[11px] text-muted-foreground/70">+{extra}</li>
            )}
            {isPrivate && (
              <li className="ms-auto flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-medium text-brand">
                <Lock className="size-3" />
                {labels.private}
              </li>
            )}
          </ul>
        </div>
      </div>
    </article>
  );
}
