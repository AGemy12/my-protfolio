import { Fragment } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowDownToLine, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { siteText, tr, type Experience, type Settings, type Skill } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/smart-image";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";
import { SkillMarquee } from "./marquee";

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
  experience,
  skills,
}: {
  settings: Settings;
  experience: Experience[];
  skills: Skill[];
}) {
  const locale = await getLocale();
  const t = await getTranslations("hero");
  const cv = (locale === "ar" ? s.cvAr || s.cvEn : s.cvEn || s.cvAr) || "";
  const name = tr(s.name, locale);
  const current = experience.find((e) => e.current && e.type === "work") ?? experience.find((e) => e.current);

  const facts = [
    s.yearsExperience > 0 && { label: t("facts.experience"), value: t("facts.years", { count: s.yearsExperience }) },
    s.projectsDone > 0 && { label: t("facts.projects"), value: t("facts.projectsValue", { count: s.projectsDone }) },
    current && { label: t("facts.current"), value: current.company },
    tr(s.location, locale) && { label: t("facts.location"), value: tr(s.location, locale) },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <section className="relative overflow-hidden pt-28 md:pt-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div>
            <Reveal>
              <h1 className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground">
                <span aria-hidden className="h-0.5 w-6 bg-brand" />
                <span className="font-semibold text-heading">{name}</span>
                <span>{tr(s.role, locale)}</span>
              </h1>
            </Reveal>

            <Reveal delay={0.05}>
              <p className="mt-6 text-[2.2rem] leading-[1.15] font-bold text-balance text-heading sm:text-5xl lg:text-[3.4rem] ltr:tracking-[-0.03em] rtl:leading-[1.45] rtl:lg:text-[3rem]">
                <Statement text={tr(s.headline, locale)} />
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-pretty sm:text-lg">{tr(s.bio, locale)}</p>
            </Reveal>

            <Reveal delay={0.15} className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="group h-12 rounded-lg bg-brand px-6 text-base text-brand-foreground hover:bg-brand/90"
              >
                <Link href="/#contact">
                  {siteText(s.texts, "heroPrimary", locale, t("startProject"))}
                  <ArrowRight className="transition group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-lg bg-transparent px-6 text-base hover:border-brand hover:bg-transparent hover:text-brand dark:bg-transparent"
              >
                <Link href="/#projects">{siteText(s.texts, "heroSecondary", locale, t("viewWork"))}</Link>
              </Button>
              {cv && (
                <a
                  href={cv}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-1.5 px-2 text-sm text-muted-foreground transition-colors hover:text-brand"
                >
                  <ArrowDownToLine className="size-4" />
                  {t("downloadCv")}
                </a>
              )}
            </Reveal>
          </div>

          {/* Portrait */}
          <Reveal delay={0.1}>
            <div className="bg-metal relative mx-auto aspect-4/5 w-full max-w-sm overflow-hidden rounded-2xl lg:max-w-none">
              {s.avatar ? (
                <SmartImage
                  src={s.avatar}
                  alt={name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 400px, 384px"
                  className="object-contain object-bottom"
                />
              ) : (
                <span className="absolute inset-0 grid place-items-center text-7xl font-bold text-(--metal-dim)">
                  {name.slice(0, 2)}
                </span>
              )}
              <p className="absolute inset-x-0 bottom-4 mx-auto flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/55 px-4 py-1.5 text-sm text-white backdrop-blur-md">
                <span className={cn("size-2 rounded-full", s.available ? "bg-emerald-400" : "bg-white/40")} />
                {s.available ? t("available") : t("busy")}
              </p>
            </div>
          </Reveal>
        </div>

        {facts.length > 0 && (
          <Reveal delay={0.2}>
            <dl className="mt-16 grid grid-cols-2 border-y md:mt-20 md:grid-cols-4">
              {facts.map((item, i) => (
                <div
                  key={item.label}
                  className={cn(
                    "min-w-0 py-4",
                    i % 2 === 1 && "border-s ps-5",
                    i >= 2 && "border-t md:border-t-0",
                    i > 0 ? "md:border-s md:ps-6" : "md:border-s-0 md:ps-0",
                  )}
                >
                  <dt className="text-sm text-muted-foreground">{item.label}</dt>
                  <dd className="mt-0.5 truncate font-medium text-heading">{item.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}

        <SkillMarquee skills={skills} label={t("stack")} className="mt-12" />
      </div>
    </section>
  );
}
