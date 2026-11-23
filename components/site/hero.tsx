import { Fragment } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowDownToLine, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { tr, trList, type Experience, type Project, type Settings } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RotatingRoles } from "./hero-fx";
import { Reveal } from "./reveal";
import { Trace } from "./trace";

/** Renders `*word*` in the headline in the ember colour (editable from the dashboard). */
function Statement({ text }: { text: string }) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") && part.length > 2 ? (
      <span key={i} className="text-brand">
        {part.slice(1, -1)}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export async function Hero({
  settings: s,
  projects,
  experience,
}: {
  settings: Settings;
  projects: Project[];
  experience: Experience[];
}) {
  const locale = await getLocale();
  const t = await getTranslations("hero");
  const cv = (locale === "ar" ? s.cvAr || s.cvEn : s.cvEn || s.cvAr) || "";
  const roles = trList(s.heroRoles, locale);
  const location = tr(s.location, locale);
  const current = experience.find((e) => e.current && e.type === "work") ?? experience.find((e) => e.current);

  const spec = [
    s.yearsExperience > 0 && { label: t("spec.experience"), value: t("spec.years", { count: s.yearsExperience }) },
    s.projectsDone > 0 && { label: t("spec.projects"), value: t("spec.projectsValue", { count: s.projectsDone }) },
    current && { label: t("spec.current"), value: current.company },
    { label: t("spec.status"), value: s.available ? t("available") : t("busy"), accent: s.available },
  ].filter(Boolean) as { label: string; value: string; accent?: boolean }[];

  return (
    <section className="relative overflow-hidden pt-28 md:pt-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14">
          <div>
            <Reveal>
              <h1 className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span aria-hidden className="h-0.5 w-6 bg-brand" />
                <span className="font-semibold text-heading">{tr(s.name, locale)}</span>
                <span>{tr(s.role, locale)}</span>
                {location && <span className="hidden sm:inline">· {location}</span>}
              </h1>
            </Reveal>

            <Reveal delay={0.05}>
              <p className="mt-6 text-[2.2rem] leading-[1.15] font-bold text-balance text-heading sm:text-5xl lg:text-[3.5rem] ltr:tracking-[-0.03em] rtl:leading-[1.45] rtl:lg:text-[3rem]">
                <Statement text={tr(s.headline, locale)} />
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-pretty sm:text-lg">{tr(s.bio, locale)}</p>
              {roles.length > 0 && (
                <p className="mt-5 flex items-center gap-3 text-sm text-muted-foreground">
                  <span aria-hidden className="font-mono text-brand">
                    {"//"}
                  </span>
                  <RotatingRoles roles={roles} />
                </p>
              )}
            </Reveal>

            <Reveal delay={0.15} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button
                asChild
                size="lg"
                className="group h-12 rounded-lg bg-brand px-6 text-base text-brand-foreground hover:bg-brand/90"
              >
                <Link href="/#contact">
                  {t("startProject")}
                  <ArrowRight className="transition group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
                </Link>
              </Button>
              <Link
                href="/projects"
                className="border-b border-foreground/30 pb-0.5 text-heading transition-colors hover:border-brand hover:text-brand"
              >
                {t("shippedCount", { count: projects.length })}
              </Link>
              {cv && (
                <a
                  href={cv}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-brand"
                >
                  <ArrowDownToLine className="size-4" />
                  {t("downloadCv")}
                </a>
              )}
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <Trace />
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <dl className="mt-16 grid grid-cols-2 border-y md:mt-20 md:grid-cols-4">
            {spec.map((item, i) => (
              <div
                key={item.label}
                className={cn(
                  "min-w-0 py-4",
                  i % 2 === 1 && "border-s ps-5",
                  i >= 2 && "border-t md:border-t-0",
                  i > 0 ? "md:border-s md:ps-6" : "md:border-s-0 md:ps-0",
                )}
              >
                <dt className="text-xs text-muted-foreground ltr:font-mono ltr:tracking-[0.14em] ltr:uppercase">
                  {item.label}
                </dt>
                <dd className={cn("mt-1 truncate font-medium", item.accent ? "text-brand" : "text-heading")}>
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
