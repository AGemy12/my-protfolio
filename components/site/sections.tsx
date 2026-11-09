import { getLocale, getTranslations } from "next-intl/server";
import {
  ArrowRight,
  Cloud,
  Database,
  Mail,
  MapPin,
  Monitor,
  Phone,
  Server,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ServiceIcon, SkillIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SKILL_CATEGORIES,
  tr,
  trList,
  type Experience,
  type Project,
  type Service,
  type Settings,
  type Skill,
} from "@/lib/types";

type SkillCategory = (typeof SKILL_CATEGORIES)[number];
import { Reveal } from "./reveal";
import { Section } from "./section";
import { ProjectCard } from "./project-card";
import { ContactForm } from "./contact-form";
import { Socials } from "./socials";

export async function About({ settings: s }: { settings: Settings }) {
  const locale = await getLocale();
  const t = await getTranslations("about");
  const paragraphs = tr(s.about, locale).split(/\n\s*\n/).filter(Boolean);
  const details = [
    { icon: MapPin, label: t("location"), value: tr(s.location, locale) },
    { icon: Mail, label: t("email"), value: s.email, href: `mailto:${s.email}` },
    { icon: Phone, label: t("phone"), value: s.phone, href: `tel:${s.phone.replace(/\s/g, "")}` },
  ].filter((d) => d.value);

  return (
    <Section id="about" eyebrow={t("eyebrow")} title={t("title")}>
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <Reveal className="space-y-5 text-lg leading-relaxed text-pretty text-muted-foreground">
          {paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? "text-foreground" : undefined}>
              {p}
            </p>
          ))}
        </Reveal>
        <Reveal delay={0.1}>
          <Card className="gap-0 rounded-3xl py-0 shadow-none">
            <dl className="divide-y">
              {details.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-4 p-5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-xs text-muted-foreground">{label}</dt>
                    <dd className="truncate font-medium" dir={href ? "ltr" : undefined}>
                      {href ? (
                        <a href={href} className="transition hover:text-brand">
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}

const SKILL_CATEGORY_ICONS: Record<SkillCategory, LucideIcon> = {
  frontend: Monitor,
  backend: Server,
  database: Database,
  devops: Cloud,
  tools: Wrench,
  ai: Sparkles,
};

export async function Skills({ skills }: { skills: Skill[] }) {
  const t = await getTranslations("skills");
  const groups = SKILL_CATEGORIES.map((c) => ({ c, items: skills.filter((s) => s.category === c) })).filter(
    (g) => g.items.length,
  );
  return (
    <Section
      id="skills"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("lead")}
      action={
        <div className="flex items-center gap-6 rounded-2xl border bg-card px-5 py-3.5">
          <div>
            <p className="text-2xl font-semibold text-brand tabular-nums" dir="ltr">
              {skills.length}
            </p>
            <p className="text-xs text-muted-foreground">{t("countLabel", { count: skills.length })}</p>
          </div>
          <span aria-hidden className="h-9 w-px bg-border" />
          <div>
            <p className="text-2xl font-semibold text-brand tabular-nums" dir="ltr">
              {groups.length}
            </p>
            <p className="text-xs text-muted-foreground">{t("groupsLabel", { count: groups.length })}</p>
          </div>
        </div>
      }
    >
      {/* masonry: cards keep their natural height, so short groups don't leave empty boxes */}
      <div className="gap-4 md:columns-2 lg:columns-3">
        {groups.map(({ c, items }, i) => {
          const Icon = SKILL_CATEGORY_ICONS[c];
          return (
            <Reveal key={c} delay={i * 0.05} className="mb-4 break-inside-avoid">
              <article className="group relative isolate overflow-hidden rounded-3xl border bg-card p-6 transition-colors duration-500 hover:border-brand/40">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -end-16 -top-16 -z-10 size-44 rounded-full bg-brand/15 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                />
                <header className="mb-5 flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand ring-1 ring-brand/15 transition-colors duration-500 ring-inset group-hover:bg-brand group-hover:text-brand-foreground">
                    <Icon className="size-4.5" />
                  </span>
                  <h3 className="flex-1 font-semibold tracking-tight rtl:tracking-normal">{t(`categories.${c}`)}</h3>
                  <span
                    className="rounded-full border px-2 py-0.5 font-mono text-[11px] text-muted-foreground tabular-nums"
                    dir="ltr"
                  >
                    {String(items.length).padStart(2, "0")}
                  </span>
                </header>
                <ul className="flex flex-wrap gap-2">
                  {items.map((s) => (
                    <li
                      key={s._id}
                      dir="ltr"
                      className="group/chip inline-flex items-center gap-2 rounded-xl border bg-background/60 px-3 py-1.5 text-sm transition-colors duration-200 hover:border-brand/50 hover:bg-brand-soft hover:text-brand"
                    >
                      <SkillIcon
                        name={s.icon}
                        className="size-4 text-muted-foreground transition-colors duration-200 group-hover/chip:text-brand"
                      />
                      {s.name}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

export async function ExperienceSection({ items }: { items: Experience[] }) {
  const locale = await getLocale();
  const t = await getTranslations("experience");
  return (
    <Section id="experience" eyebrow={t("eyebrow")} title={t("title")}>
      <ol className="relative space-y-6 border-s ps-6 sm:ps-10">
        {items.map((e, i) => (
          <Reveal as="li" key={e._id} delay={i * 0.05} className="relative">
            <span className="absolute -start-[1.95rem] top-7 grid size-3 place-items-center rounded-full border-2 border-brand bg-background sm:-start-[2.95rem]" />
            <Card className="gap-4 rounded-3xl shadow-none transition-colors hover:border-brand/50">
              <CardHeader className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-lg">{tr(e.role, locale)}</CardTitle>
                  <p className="mt-1 text-muted-foreground">
                    {e.companyUrl ? (
                      <a href={e.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
                        {e.company}
                      </a>
                    ) : (
                      e.company
                    )}
                    {tr(e.location, locale) && <span> · {tr(e.location, locale)}</span>}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="font-mono text-sm text-muted-foreground" dir="ltr">
                    {e.start} — {e.current ? t("present") : e.end}
                  </span>
                  <Badge variant="brand">{t(`types.${e.type}`)}</Badge>
                </div>
              </CardHeader>
              {trList(e.highlights, locale).length > 0 && (
                <CardContent>
                  <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                    {trList(e.highlights, locale).map((h, j) => (
                      <li key={j} className="flex gap-3">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              )}
            </Card>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

export async function ProjectsSection({ projects }: { projects: Project[] }) {
  const locale = await getLocale();
  const t = await getTranslations("projects");
  const featured = projects.filter((p) => p.featured);
  const shown = (featured.length ? featured : projects).slice(0, 6);
  return (
    <Section
      id="projects"
      eyebrow={t("eyebrow")}
      title={t("title")}
      action={
        <Button asChild variant="outline" size="lg" className="group rounded-full hover:border-brand hover:text-brand">
          <Link href="/projects">
            {t("viewAll")}
            <ArrowRight className="transition group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
          </Link>
        </Button>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p, i) => (
          <Reveal key={p._id} delay={(i % 3) * 0.06} className="h-full">
            <ProjectCard
              project={p}
              locale={locale}
              priority={i < 3}
              labels={{ category: t(`categories.${p.category}`), private: t("private"), details: t("details") }}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export async function ServicesSection({ services }: { services: Service[] }) {
  const locale = await getLocale();
  const t = await getTranslations("services");
  return (
    <Section id="services" eyebrow={t("eyebrow")} title={t("title")}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s, i) => (
          <Reveal key={s._id} delay={i * 0.06} className="h-full">
            <article className="group relative isolate flex h-full flex-col overflow-hidden rounded-3xl border bg-card p-7 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-2xl hover:shadow-brand/10">
              {/* soft glow that blooms on hover */}
              <span
                aria-hidden
                className="pointer-events-none absolute -end-20 -top-20 -z-10 size-56 rounded-full bg-brand/15 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
              />
              {/* faint top sheen */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-brand/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />

              <div className="flex items-start justify-between">
                <span className="grid size-13 place-items-center rounded-2xl bg-brand-soft text-brand ring-1 ring-brand/15 transition-all duration-500 ring-inset group-hover:scale-105 group-hover:rotate-[-4deg] group-hover:bg-brand group-hover:text-brand-foreground group-hover:shadow-lg group-hover:shadow-brand/30">
                  <ServiceIcon name={s.icon} className="size-5.5" />
                </span>
                <span
                  className="font-mono text-sm tracking-widest text-muted-foreground/50 tabular-nums transition-colors duration-500 group-hover:text-brand"
                  dir="ltr"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="mt-10 flex-1">
                <h3 className="text-lg leading-snug font-semibold tracking-tight text-balance">
                  {tr(s.title, locale)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-pretty text-muted-foreground">
                  {tr(s.description, locale)}
                </p>
              </div>

              {/* accent line that draws in on hover */}
              <span
                aria-hidden
                className="mt-7 block h-0.5 w-10 rounded-full bg-brand/30 transition-all duration-500 ease-out group-hover:w-full group-hover:bg-brand"
              />
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

const contactLink =
  "h-auto w-full justify-start gap-3 rounded-2xl bg-card p-4 text-base font-normal hover:border-brand hover:bg-card dark:bg-card has-[>svg]:px-4 [&>svg]:size-5 [&>svg]:text-brand";

export async function ContactSection({ settings: s }: { settings: Settings }) {
  const t = await getTranslations("contact");
  return (
    <Section id="contact" eyebrow={t("eyebrow")} title={t("title")}>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
        <Reveal>
          <p className="text-lg text-muted-foreground">{t("lead")}</p>
          <p className="mt-10 mb-4 text-sm font-medium">{t("orReach")}</p>
          <div className="space-y-3">
            {s.email && (
              <Button asChild variant="outline" className={contactLink}>
                <a href={`mailto:${s.email}`}>
                  <Mail />
                  <span dir="ltr">{s.email}</span>
                </a>
              </Button>
            )}
            {s.phone && (
              <Button asChild variant="outline" className={contactLink}>
                <a
                  href={s.whatsapp || `tel:${s.phone.replace(/\s/g, "")}`}
                  target={s.whatsapp ? "_blank" : undefined}
                  rel="noopener noreferrer"
                >
                  <Phone />
                  <span dir="ltr">{s.phone}</span>
                </a>
              </Button>
            )}
          </div>
          <Socials settings={s} className="mt-6" />
        </Reveal>
        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  );
}
