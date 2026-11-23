"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight, Expand, Images } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { SmartImage } from "@/components/smart-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { tr, type Project } from "@/lib/types";
import { ProjectLightbox } from "./project-lightbox";

/**
 * Everything about one project: cover, links, overview, facts, stack and gallery.
 * Shared by the dialog (`variant="dialog"`) and the project's own page (`variant="page"`),
 * so both always show the same content.
 */
export function ProjectDetails({
  project: p,
  variant,
  coverAction,
}: {
  project: Project;
  variant: "dialog" | "page";
  /** Rendered over the cover's top corner (the dialog's close button). */
  coverAction?: ReactNode;
}) {
  const t = useTranslations("projects");
  const locale = useLocale();
  const [viewer, setViewer] = useState<number | null>(null);
  const inDialog = variant === "dialog";

  const title = tr(p.title, locale);
  const summary = tr(p.summary, locale);
  const description = tr(p.description, locale);
  const images = useMemo(() => [...new Set([p.cover, ...p.gallery].filter(Boolean))], [p.cover, p.gallery]);
  const gallery = images.slice(1);

  const facts = [
    { label: t("role"), value: tr(p.role, locale) },
    { label: t("year"), value: p.year ? String(p.year) : "" },
    { label: t("category"), value: t(`categories.${p.category}`) },
  ].filter((f) => f.value);

  const titleClass = cn(
    "leading-tight font-semibold tracking-tight text-balance",
    inDialog ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl rtl:leading-[1.35]",
  );
  const leadClass = cn("mt-3 text-pretty text-muted-foreground", inDialog ? "text-base" : "text-lg");
  const SectionHeading = inDialog ? "h3" : "h2";

  return (
    <>
      {/* Cover */}
      <div className="relative">
        {p.cover ? (
          <button
            type="button"
            onClick={() => setViewer(0)}
            className={cn(
              "group/cover relative block aspect-[16/9] w-full overflow-hidden bg-muted",
              inDialog ? "border-b" : "rounded-2xl border",
            )}
            aria-label={t("viewImages", { count: images.length })}
          >
            <SmartImage
              src={p.cover}
              alt={title}
              fill
              priority={!inDialog}
              sizes="(min-width: 896px) 896px, 100vw"
              className="object-cover object-top transition duration-700 group-hover/cover:scale-[1.02]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition group-hover/cover:opacity-100" />
            <span className="absolute end-4 bottom-4 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
              {images.length > 1 ? <Images className="size-3.5" /> : <Expand className="size-3.5" />}
              {t("viewImages", { count: images.length })}
            </span>
          </button>
        ) : (
          <div className={cn("bg-metal h-24", inDialog ? "border-b" : "rounded-2xl border")} />
        )}
        {coverAction}
      </div>

      <div className={inDialog ? "p-6 sm:p-8" : "pt-8 sm:pt-10"}>
        <Badge variant="outline" className="mb-3 px-2.5 py-1">
          {t(`categories.${p.category}`)}
        </Badge>
        {inDialog ? (
          <>
            <DialogTitle className={titleClass}>{title}</DialogTitle>
            <DialogDescription className={leadClass}>{summary}</DialogDescription>
          </>
        ) : (
          <>
            <h1 className={titleClass}>{title}</h1>
            {summary && <p className={leadClass}>{summary}</p>}
          </>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {p.liveUrl && (
            <Button asChild className="h-10 rounded-full px-5">
              <a href={p.liveUrl} target="_blank" rel="noopener noreferrer">
                {t("live")} <ArrowUpRight className="rtl:-scale-x-100" />
              </a>
            </Button>
          )}
          {p.repoUrl && (
            <Button asChild variant="outline" className="h-10 rounded-full px-5 hover:border-brand">
              <a href={p.repoUrl} target="_blank" rel="noopener noreferrer">
                <SiGithub /> {t("code")}
              </a>
            </Button>
          )}
          {!p.liveUrl && !p.repoUrl && (
            <Badge variant="brand" className="h-10 px-5 text-sm font-normal">
              {t("private")}
            </Badge>
          )}
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_240px]">
          <section>
            {description && (
              <>
                <SectionHeading className="mb-3 font-mono text-xs tracking-[0.2em] text-brand uppercase">
                  {t("overview")}
                </SectionHeading>
                <div className="space-y-3 leading-relaxed text-pretty text-muted-foreground">
                  {description.split(/\n\s*\n/).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </>
            )}
          </section>
          <aside className="space-y-6">
            {facts.length > 0 && (
              <dl className="divide-y rounded-2xl border">
                {facts.map((f) => (
                  <div key={f.label} className="flex justify-between gap-4 px-4 py-3 text-sm">
                    <dt className="text-muted-foreground">{f.label}</dt>
                    <dd className="text-end font-medium">{f.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {p.tech.length > 0 && (
              <div>
                <SectionHeading className="mb-3 text-sm font-medium">{t("stack")}</SectionHeading>
                <ul className="flex flex-wrap gap-1.5" dir="ltr">
                  {p.tech.map((tech) => (
                    <li key={tech}>
                      <Badge variant="secondary" className="rounded-md font-mono text-xs font-normal text-muted-foreground">
                        {tech}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>

        {gallery.length > 0 && (
          <section className="mt-10">
            <SectionHeading className="mb-4 font-mono text-xs tracking-[0.2em] text-brand uppercase">
              {t("gallery")} <span className="text-muted-foreground">({gallery.length})</span>
            </SectionHeading>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {gallery.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setViewer(i + 1)}
                  aria-label={t("imageOf", { current: i + 2, total: images.length })}
                  className="group/img relative aspect-[16/10] overflow-hidden rounded-xl border bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <SmartImage
                    src={src}
                    alt={`${title} ${i + 2}`}
                    fill
                    sizes="(min-width: 640px) 280px, 50vw"
                    className="object-cover object-top transition duration-500 group-hover/img:scale-[1.05]"
                  />
                  <span className="absolute inset-0 grid place-items-center bg-black/0 text-white opacity-0 transition group-hover/img:bg-black/35 group-hover/img:opacity-100">
                    <Expand className="size-5" />
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      {images.length > 0 && (
        <ProjectLightbox
          images={images}
          title={title}
          index={viewer ?? 0}
          onIndexChange={setViewer}
          open={viewer !== null}
          onOpenChange={(o) => !o && setViewer(null)}
        />
      )}
    </>
  );
}
