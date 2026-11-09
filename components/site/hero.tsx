import { Fragment } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowDownToLine, ArrowRight, ArrowUpRight, CodeXml, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { tr, trList, type Project, type Settings } from "@/lib/types";
import { SmartImage } from "@/components/smart-image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CountUp, RotatingRoles, Spotlight } from "./hero-fx";
import { ProjectDialog } from "./project-dialog";
import { Reveal } from "./reveal";
import { Socials } from "./socials";

/** Renders `*word*` in the headline as highlighted text (editable from the dashboard). */
function Statement({ text }: { text: string }) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") && part.length > 2 ? (
      <span key={i} className="relative inline-block">
        <span className="bg-linear-to-r from-brand to-brand-2 box-decoration-clone bg-clip-text text-transparent rtl:bg-linear-to-l">
          {part.slice(1, -1)}
        </span>
        <svg
          aria-hidden
          viewBox="0 0 200 14"
          preserveAspectRatio="none"
          className="hero-draw pointer-events-none absolute inset-x-0 -bottom-[0.06em] h-[0.2em] w-full overflow-visible text-brand/60 rtl:-bottom-[0.1em] rtl:-scale-x-100"
        >
          <path
            d="M3 10 C 50 3, 125 2, 197 7"
            pathLength={1}
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
          />
        </svg>
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

function host(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="hero-driftabsolute -top-56 start-[8%] size-152 rounded-full bg-brand/20 blur-[130px] dark:bg-brand/25" />
      <div className="hero-drift-late absolute top-[28%] -end-48 size-120 rounded-full bg-brand-2/15 blur-[130px]" />
      <div className="bg-noise absolute inset-0 opacity-[0.04] mix-blend-overlay dark:opacity-[0.07]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-background to-transparent" />
    </div>
  );
}

function StatChip({ value, label, className }: { value: number; label: string; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card/80 px-4 py-3 shadow-xl shadow-black/5 backdrop-blur-md dark:shadow-black/40",
        className,
      )}
    >
      <div className="flex items-baseline gap-0.5 text-3xl leading-none font-bold tabular-nums">
        <CountUp value={value} />
        <span className="text-brand">+</span>
      </div>
      <div className="mt-1.5 max-w-36 text-xs leading-snug text-muted-foreground">{label}</div>
    </div>
  );
}

export async function Hero({ settings: s, projects }: { settings: Settings; projects: Project[] }) {
  const locale = await getLocale();
  const t = await getTranslations("hero");
  const tp = await getTranslations("projects");
  const cv = (locale === "ar" ? s.cvAr || s.cvEn : s.cvEn || s.cvAr) || "";
  const name = tr(s.name, locale);
  const location = tr(s.location, locale);
  const roles = trList(s.heroRoles, locale);
  const featured = projects.filter((p) => p.featured);
  const shipped = (featured.length ? featured : projects).slice(0, 5);
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <section className="relative isolate overflow-hidden pt-28 pb-12 md:pt-36 md:pb-16">
      <Backdrop />
      <Spotlight />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Signature line */}
        <Reveal className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 text-sm">
          <h1 className="flex items-center gap-3 font-semibold">
            <span aria-hidden className="h-px w-8 bg-linear-to-r from-brand to-brand-2" />
            {name}
            <span className="font-normal text-muted-foreground">— {tr(s.role, locale)}</span>
          </h1>
          {location && (
            <p className="inline-flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="size-3.5 text-brand" aria-hidden />
              {location}
            </p>
          )}
        </Reveal>

        <div className="mt-10 grid items-center gap-14 md:mt-14 lg:grid-cols-12 lg:gap-10">
          {/* The statement */}
          <div className="lg:col-span-8">
            <Reveal delay={0.05}>
              <p className="text-[2.35rem] leading-[1.08] font-bold text-balance sm:text-6xl lg:text-[4.25rem] xl:text-[4.75rem] ltr:tracking-[-0.04em] rtl:leading-[1.4] rtl:font-extrabold">
                <Statement text={tr(s.headline, locale)} />
              </p>
            </Reveal>

            {roles.length > 0 && (
              <Reveal delay={0.12} className="mt-8 flex items-center gap-3 text-lg text-muted-foreground sm:text-xl">
                <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-xl border bg-card/70 text-brand shadow-sm backdrop-blur">
                  <CodeXml className="size-5" />
                </span>
                <RotatingRoles roles={roles} />
                <span aria-hidden className="h-6 w-0.5 shrink-0 animate-pulse rounded-full bg-brand" />
              </Reveal>
            )}
          </div>

          {/* Portrait */}
          <Reveal delay={0.15} className="lg:col-span-4">
            <div className="relative mx-auto w-full max-w-80 sm:max-w-sm lg:max-w-none">
              <div className="relative overflow-hidden rounded-[2rem] p-px">
                {/* animated border */}
                <div
                  aria-hidden
                  className="hero-spin absolute -inset-1/2 bg-[conic-gradient(from_0deg,transparent_0deg,var(--brand)_70deg,transparent_140deg,transparent_180deg,var(--brand-2)_250deg,transparent_320deg)]"
                />
                <div className="relative aspect-4/5 overflow-hidden rounded-[calc(2rem-1px)] bg-card">
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,color-mix(in_oklab,var(--brand)_38%,transparent),transparent_65%)]"
                  />
                  <div aria-hidden className="bg-grid absolute inset-0" />
                  {s.avatar ? (
                    <SmartImage
                      src={s.avatar}
                      alt={name}
                      fill
                      priority
                      sizes="(min-width: 1024px) 360px, 384px"
                      className="object-contain object-bottom"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="absolute inset-0 grid place-items-center bg-linear-to-br from-brand to-brand-2 bg-clip-text text-8xl font-black text-transparent"
                    >
                      {initials}
                    </span>
                  )}
                  <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-card via-card/60 to-transparent" />

                  {/* Availability */}
                  <p className="absolute inset-x-0 bottom-5 mx-auto flex w-fit items-center gap-2.5 rounded-full border bg-background/70 py-1.5 ps-2 pe-4 text-sm font-medium shadow-lg backdrop-blur-md">
                    <span className="relative grid size-5 place-items-center">
                      {s.available && <span className="absolute size-full animate-ping rounded-full bg-emerald-500/40" />}
                      <span className={cn("size-2 rounded-full", s.available ? "bg-emerald-500" : "bg-muted-foreground")} />
                    </span>
                    {s.available ? t("available") : t("busy")}
                  </p>
                </div>
              </div>

              <StatChip
                value={s.yearsExperience}
                label={t("yearsExp")}
                className="hero-float absolute top-8 -start-3 sm:-start-8"
              />
              <StatChip
                value={s.projectsDone}
                label={t("projectsDone")}
                className="hero-float-late absolute bottom-24 -end-3 sm:-end-8"
              />
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-14 md:mt-24 lg:grid-cols-12 lg:gap-10">
          {/* Who + how to reach */}
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="max-w-md text-lg leading-relaxed text-pretty text-muted-foreground">{tr(s.bio, locale)}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="group h-12 rounded-full bg-brand px-6 text-base text-brand-foreground shadow-[0_12px_32px_-12px_var(--brand)] hover:bg-brand/90 hover:shadow-[0_16px_40px_-12px_var(--brand)]"
              >
                <Link href="/#contact">
                  {t("startProject")}
                  <ArrowRight className="transition group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
                </Link>
              </Button>
              {cv && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-full bg-card/60 px-6 text-base backdrop-blur hover:border-brand hover:bg-card hover:text-brand dark:bg-card/60"
                >
                  <a href={cv} target="_blank" rel="noopener noreferrer" download>
                    <ArrowDownToLine />
                    {t("downloadCv")}
                  </a>
                </Button>
              )}
            </div>

            <Socials settings={s} className="mt-8" />
          </Reveal>

          {/* Proof: what has actually shipped */}
          {shipped.length > 0 && (
            <Reveal delay={0.15} className="lg:col-span-7">
              <div className="overflow-hidden rounded-3xl border bg-card/60 shadow-sm backdrop-blur-md">
                <div className="flex items-center justify-between gap-4 border-b px-5 py-3.5">
                  <div className="flex items-center gap-4">
                    <span aria-hidden className="flex gap-1.5">
                      <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                      <span className="size-2.5 rounded-full bg-[#febc2e]" />
                      <span className="size-2.5 rounded-full bg-[#28c840]" />
                    </span>
                    <h2 className="text-sm text-muted-foreground ltr:font-mono ltr:text-xs ltr:tracking-[0.18em] ltr:uppercase">
                      {t("shipped")}
                    </h2>
                  </div>
                  <Link
                    href="/projects"
                    className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-brand"
                  >
                    {t("allProjects", { count: projects.length })}
                    <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
                  </Link>
                </div>
                <ol className="p-2">
                  {shipped.map((p, i) => {
                    const domain = host(p.liveUrl);
                    return (
                      <li
                        key={p._id}
                        className="group relative grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-x-4 rounded-2xl px-3 py-3.5 transition-colors hover:bg-accent/70"
                      >
                        <span className="grid size-9 place-items-center rounded-xl border bg-background/60 font-mono text-xs text-muted-foreground tabular-nums transition-colors group-hover:border-brand/50 group-hover:bg-brand-soft group-hover:text-brand">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <ProjectDialog project={p}>
                            <button
                              type="button"
                              className="cursor-pointer text-start text-lg font-semibold transition-colors after:absolute after:inset-0 after:rounded-2xl group-hover:text-brand focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring"
                            >
                              {tr(p.title, locale)}
                            </button>
                          </ProjectDialog>
                          <p className="mt-0.5 truncate text-sm text-muted-foreground">
                            {tp(`categories.${p.category}`)}
                            {p.tech.length > 0 && (
                              <>
                                <span aria-hidden> · </span>
                                <bdi dir="ltr">{p.tech.slice(0, 3).join(", ")}</bdi>
                              </>
                            )}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 text-end">
                          <span className="font-mono text-sm tabular-nums">{p.year}</span>
                          {domain ? (
                            <a
                              href={p.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              dir="ltr"
                              className="relative z-10 inline-flex items-center gap-0.5 font-mono text-xs text-muted-foreground transition hover:text-brand"
                            >
                              {domain}
                              <ArrowUpRight className="size-3" />
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground ltr:font-mono">{tp("private")}</span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
