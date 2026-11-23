import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ServiceIcon, SkillIcon } from "@/components/icons";
import { SmartImage } from "@/components/smart-image";
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
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";
import { Eyebrow, Section } from "./section";
import { ProjectDialog } from "./project-dialog";
import { ContactForm } from "./contact-form";
import { Socials } from "./socials";

const arrow = "transition group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5";
const quietLink =
  "group inline-flex items-center gap-2 border-b border-foreground/30 pb-0.5 text-heading transition-colors hover:border-brand hover:text-brand";

/* ── About ──────────────────────────────────────────────────────────────── */

export async function About({ settings: s }: { settings: Settings }) {
  const locale = await getLocale();
  const t = await getTranslations("about");
  const [lead, ...rest] = tr(s.about, locale).split(/\n\s*\n/).filter(Boolean);
  const name = tr(s.name, locale);
  const details = [
    { icon: MapPin, label: t("location"), value: tr(s.location, locale) },
    { icon: Mail, label: t("email"), value: s.email, href: `mailto:${s.email}` },
    { icon: Phone, label: t("phone"), value: s.phone, href: `tel:${s.phone.replace(/\s/g, "")}` },
  ].filter((d) => d.value);

  return (
    <Section id="about" eyebrow={t("eyebrow")} title={t("title")}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <Reveal>
          {lead && (
            <p className="text-xl leading-relaxed text-pretty text-heading sm:text-2xl sm:leading-relaxed">{lead}</p>
          )}
          {rest.length > 0 && (
            <div className="mt-6 space-y-4 text-base leading-relaxed text-pretty">
              {rest.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}
        </Reveal>

        <Reveal delay={0.1} className="self-start">
          <div className="flex items-center gap-4 border-b pb-5">
            <div className="bg-metal relative size-16 shrink-0 overflow-hidden rounded-xl">
              {s.avatar ? (
                <SmartImage src={s.avatar} alt={name} fill sizes="64px" className="object-cover object-top" />
              ) : (
                <span className="absolute inset-0 grid place-items-center font-semibold text-(--metal-heading)">
                  {name.slice(0, 2)}
                </span>
              )}
            </div>
            <div>
              <p className="font-semibold text-heading">{name}</p>
              <p className="text-sm text-muted-foreground">{tr(s.role, locale)}</p>
            </div>
          </div>
          <dl className="divide-y">
            {details.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-center gap-4 py-4">
                <Icon className="size-4 shrink-0 text-brand" aria-hidden />
                <dt className="w-20 shrink-0 text-sm text-muted-foreground">{label}</dt>
                <dd className="min-w-0 truncate font-medium text-heading" dir={href ? "ltr" : undefined}>
                  {href ? (
                    <a href={href} className="transition-colors hover:text-brand">
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}

/* ── Skills: the stack as strata, from the pixel down to the disk ───────── */

export async function Skills({ skills }: { skills: Skill[] }) {
  const t = await getTranslations("skills");
  const groups = SKILL_CATEGORIES.map((c) => ({ c, items: skills.filter((s) => s.category === c) })).filter(
    (g) => g.items.length,
  );
  const last = Math.max(1, groups.length - 1);

  return (
    <Section id="skills" eyebrow={t("eyebrow")} title={t("title")} description={t("lead")}>
      <Reveal>
        <ol className="overflow-hidden rounded-2xl border">
          {groups.map(({ c, items }, i) => (
            <li
              key={c}
              className="grid gap-x-8 gap-y-3 border-t px-5 py-5 first:border-t-0 sm:px-6 md:grid-cols-[13rem_minmax(0,1fr)_auto] md:items-center"
              style={{ background: `color-mix(in oklab, var(--stratum-deep) ${Math.round((i / last) * 100)}%, var(--card))` }}
            >
              <div>
                <span className="font-mono text-[11px] tracking-[0.14em] text-brand" dir="ltr">
                  L{i + 1}
                </span>
                <h3 className="text-lg leading-snug font-semibold">{t(`categories.${c}`)}</h3>
              </div>
              <ul dir="ltr" className="flex flex-wrap items-center gap-x-1 gap-y-2 rtl:justify-end">
                {items.map((s, j) => (
                  <li key={s._id} className="inline-flex items-center gap-1.5 text-base text-heading sm:text-lg">
                    <SkillIcon name={s.icon} className="size-4 text-muted-foreground" />
                    <span className="font-light">{s.name}</span>
                    {j < items.length - 1 && (
                      <span aria-hidden className="ms-1.5 text-muted-foreground/50">
                        /
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <span className="text-xs text-muted-foreground md:text-end ltr:font-mono ltr:tracking-wide">
                {t(`depth.${c}`)}
              </span>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}

/* ── Experience: spans on a shared year axis ────────────────────────────── */

const yearOf = (v: string) => {
  const y = parseInt(v.slice(0, 4), 10);
  return Number.isFinite(y) ? y : undefined;
};

export async function ExperienceSection({ items }: { items: Experience[] }) {
  const locale = await getLocale();
  const t = await getTranslations("experience");
  const now = new Date();
  const nowYear = now.getFullYear();

  const spans = items.map((e) => {
    const start = yearOf(e.start) ?? nowYear;
    const end = e.current ? nowYear + (now.getMonth() + 1) / 12 : (yearOf(e.end) ?? start) + 1;
    return { e, start, end };
  });
  const min = Math.min(...spans.map((s) => s.start));
  const max = Math.max(nowYear + 1, ...spans.map((s) => Math.ceil(s.end)));
  const pct = (v: number) => `${((v - min) / (max - min)) * 100}%`;
  const years = Array.from({ length: max - min }, (_, i) => min + i);

  return (
    <Section id="experience" eyebrow={t("eyebrow")} title={t("title")} description={t("lead")}>
      <div aria-hidden className="mb-2 hidden gap-8 md:grid md:grid-cols-[15rem_minmax(0,1fr)]">
        <span />
        <div className="relative h-5 font-mono text-[11px] text-muted-foreground">
          {years.map((y) => (
            <span key={y} className="absolute" style={{ insetInlineStart: pct(y) }}>
              {y}
            </span>
          ))}
        </div>
      </div>

      <ol className="border-b">
        {spans.map(({ e, start, end }, i) => {
          const highlights = trList(e.highlights, locale);
          return (
            <Reveal
              as="li"
              key={e._id}
              delay={i * 0.05}
              className="grid gap-x-8 gap-y-3 border-t py-6 md:grid-cols-[15rem_minmax(0,1fr)]"
            >
              <div>
                <h3 className="text-lg leading-snug font-semibold">
                  {e.companyUrl ? (
                    <a href={e.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
                      {e.company}
                    </a>
                  ) : (
                    e.company
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {tr(e.role, locale)} · {t(`types.${e.type}`)}
                </p>
                <p className="mt-1 font-mono text-xs text-muted-foreground" dir="ltr">
                  {e.start} — {e.current ? t("present") : e.end}
                </p>
              </div>
              <div className="min-w-0">
                <div className="relative mt-2 h-2.5">
                  {years.map((y) => (
                    <span
                      key={y}
                      aria-hidden
                      className="absolute inset-y-0 w-px bg-border"
                      style={{ insetInlineStart: pct(y) }}
                    />
                  ))}
                  <span
                    className={cn(
                      "absolute inset-y-0 rounded-[2px]",
                      e.type === "work" ? "bg-brand" : "bg-brand/45",
                    )}
                    style={{ insetInlineStart: pct(start), width: `calc(${pct(end)} - ${pct(start)})` }}
                  >
                    {e.current && (
                      <span
                        aria-hidden
                        className={cn(
                          "absolute -end-2 -top-[3px] h-4 w-2 [clip-path:polygon(0_0,100%_50%,0_100%)] rtl:-scale-x-100",
                          e.type === "work" ? "bg-brand" : "bg-brand/45",
                        )}
                      />
                    )}
                  </span>
                </div>
                {highlights.length > 0 && (
                  <ul className="mt-5 max-w-[70ch] list-disc space-y-2 ps-5 text-[15px] leading-relaxed marker:text-brand">
                    {highlights.map((h, j) => (
                      <li key={j}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          );
        })}
      </ol>
    </Section>
  );
}

/* ── Projects: one featured build, then an index ────────────────────────── */

function Schematic() {
  return (
    <div aria-hidden className="grid h-full grid-cols-[22%_1fr] bg-[#171312]">
      <div className="grid content-start gap-2 border-e border-white/[0.07] p-3">
        <i className="h-1.5 w-3/4 rounded-full bg-brand" />
        {[0, 1, 2, 3].map((k) => (
          <i key={k} className="h-1.5 rounded-full bg-white/10" />
        ))}
      </div>
      <div className="grid grid-rows-[auto_1fr] gap-3 p-3">
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((k) => (
            <i key={k} className="h-9 rounded border border-white/[0.08] bg-white/[0.03]" />
          ))}
        </div>
        <div className="flex items-end gap-[5%] rounded border border-white/[0.08] px-3 pt-3">
          {[40, 62, 48, 75, 90, 58].map((h, k) => (
            <i key={k} className={cn("flex-1 rounded-t-sm", k === 4 ? "bg-brand" : "bg-peach/35")} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function host(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export async function ProjectsSection({ projects }: { projects: Project[] }) {
  const locale = await getLocale();
  const t = await getTranslations("projects");
  const lead = projects.find((p) => p.featured) ?? projects[0];
  const rest = projects
    .filter((p) => p._id !== lead._id)
    .sort((a, b) => (b.year || 0) - (a.year || 0))
    .slice(0, 6);
  const leadTitle = tr(lead.title, locale);
  const leadHost = host(lead.liveUrl);

  return (
    <Section
      id="projects"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("lead")}
      action={
        <Link href="/projects" className={quietLink}>
          {t("viewAll")}
          <ArrowRight className={cn("size-4", arrow)} />
        </Link>
      }
    >
      <Reveal>
        <article className="group relative grid items-center gap-8 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] md:gap-12">
          <div className="bg-metal rounded-2xl px-4 pt-4 sm:px-5 sm:pt-5">
            <div className="relative aspect-16/10 overflow-hidden rounded-t-lg border border-b-0 border-white/[0.08]">
              {lead.cover ? (
                <SmartImage
                  src={lead.cover}
                  alt={leadTitle}
                  fill
                  priority
                  sizes="(min-width: 768px) 560px, 100vw"
                  className="object-cover object-top transition duration-700 group-hover:scale-[1.02]"
                />
              ) : (
                <Schematic />
              )}
            </div>
          </div>
          <div>
            <p className="text-sm text-brand ltr:font-mono ltr:text-[11px] ltr:tracking-[0.16em] ltr:uppercase">
              {t("featured")} · {t(`categories.${lead.category}`)} · {lead.year}
            </p>
            <h3 className="mt-3 text-2xl leading-snug font-bold sm:text-3xl">
              <ProjectDialog project={lead}>
                <button
                  type="button"
                  className="cursor-pointer text-start transition-colors after:absolute after:inset-0 after:rounded-2xl group-hover:text-brand focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring"
                >
                  {leadTitle}
                </button>
              </ProjectDialog>
            </h3>
            <p className="mt-3 max-w-[46ch] leading-relaxed text-pretty">{tr(lead.summary, locale)}</p>
            {lead.tech.length > 0 && (
              <p dir="ltr" className="mt-4 font-mono text-xs text-heading rtl:text-right">
                {lead.tech.join(" · ")}
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <span className="inline-flex items-center gap-1.5 text-heading">
                {t("details")}
                <ArrowRight className={cn("size-4", arrow)} />
              </span>
              {leadHost && (
                <a
                  href={lead.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  dir="ltr"
                  className="relative z-10 inline-flex items-center gap-1 font-mono text-xs text-muted-foreground transition-colors hover:text-brand"
                >
                  {leadHost}
                  <ArrowUpRight className="size-3.5" />
                </a>
              )}
            </div>
          </div>
        </article>
      </Reveal>

      {rest.length > 0 && (
        <Reveal delay={0.05}>
          <ol className="mt-14 border-t border-foreground/20">
            {rest.map((p) => (
              <li
                key={p._id}
                className="group relative grid grid-cols-[3.25rem_minmax(0,1fr)_1.25rem] items-center gap-x-4 border-b px-1 py-4 transition-colors hover:bg-sheen md:grid-cols-[4rem_minmax(0,1fr)_9rem_12rem_1.25rem] md:gap-x-6"
              >
                <span className="font-mono text-sm text-muted-foreground tabular-nums">{p.year}</span>
                <div className="min-w-0">
                  <h3 className="text-lg leading-snug font-semibold">
                    <ProjectDialog project={p}>
                      <button
                        type="button"
                        className="cursor-pointer text-start transition-colors after:absolute after:inset-0 group-hover:text-brand focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring"
                      >
                        {tr(p.title, locale)}
                      </button>
                    </ProjectDialog>
                  </h3>
                  <p className="truncate text-sm text-muted-foreground">{tr(p.summary, locale)}</p>
                </div>
                <span className="hidden text-sm text-muted-foreground md:block">{t(`categories.${p.category}`)}</span>
                <span dir="ltr" className="hidden truncate font-mono text-xs text-muted-foreground md:block rtl:text-right">
                  {p.tech.slice(0, 3).join(" · ")}
                </span>
                <ArrowUpRight className="size-5 text-muted-foreground/60 transition group-hover:-translate-y-0.5 group-hover:text-brand ltr:group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
              </li>
            ))}
          </ol>
        </Reveal>
      )}
    </Section>
  );
}

/* ── Services: each with the layers of the stack it touches ─────────────── */

type Layer = "ui" | "api" | "data";
const LAYERS: Layer[] = ["ui", "api", "data"];
/** Derived from the service icon chosen in the dashboard; unknown icons show no meter. */
const SERVICE_LAYERS: Record<string, Layer[]> = {
  layers: ["ui", "api", "data"],
  server: ["api", "data"],
  database: ["api", "data"],
  "layout-dashboard": ["ui", "api"],
  gauge: ["ui"],
  globe: ["ui"],
  code: ["ui", "api"],
};

export async function ServicesSection({ services }: { services: Service[] }) {
  const locale = await getLocale();
  const t = await getTranslations("services");
  return (
    <Section id="services" eyebrow={t("eyebrow")} title={t("title")} description={t("lead")}>
      <div className="grid border-t sm:grid-cols-2">
        {services.map((s, i) => {
          const on = SERVICE_LAYERS[s.icon];
          return (
            <Reveal
              as="article"
              key={s._id}
              delay={(i % 2) * 0.06}
              className={cn(
                "grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-3 border-b py-7",
                i % 2 === 0 ? "sm:pe-8" : "sm:border-s sm:ps-8",
              )}
            >
              <h3 className="flex items-center gap-3 text-lg leading-snug font-semibold sm:text-xl">
                <ServiceIcon name={s.icon} className="size-5 shrink-0 text-brand" />
                {tr(s.title, locale)}
              </h3>
              {on ? (
                <div
                  role="img"
                  aria-label={`${t("layers")}: ${on.map((l) => l.toUpperCase()).join(", ")}`}
                  className="row-span-2 flex flex-col items-end gap-1"
                  dir="ltr"
                >
                  {LAYERS.map((l) => {
                    const lit = on.includes(l);
                    return (
                      <span
                        key={l}
                        className={cn(
                          "flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase",
                          lit ? "text-heading" : "text-muted-foreground/50",
                        )}
                      >
                        {l}
                        <span className={cn("h-1.5 w-7 rounded-[1px]", lit ? "bg-brand" : "bg-border")} />
                      </span>
                    );
                  })}
                </div>
              ) : (
                <span />
              )}
              <p className="max-w-[46ch] text-[15px] leading-relaxed text-pretty">{tr(s.description, locale)}</p>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

/* ── Contact ────────────────────────────────────────────────────────────── */

export async function ContactSection({ settings: s }: { settings: Settings }) {
  const t = await getTranslations("contact");
  return (
    <section id="contact" aria-labelledby="contact-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-24">
      <div className="grid gap-12 border-t border-foreground/20 pt-14 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16">
        <Reveal>
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h2
            id="contact-title"
            className="mt-4 text-4xl leading-[1.15] font-bold text-balance sm:text-5xl ltr:tracking-tight rtl:leading-[1.35]"
          >
            {t("title")}
          </h2>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">{t("lead")}</p>
          {s.email && (
            <a
              href={`mailto:${s.email}`}
              dir="ltr"
              className="mt-8 inline-block border-b-2 border-brand pb-1 text-xl text-heading transition-colors hover:text-brand sm:text-2xl"
            >
              {s.email}
            </a>
          )}
          {s.phone && (
            <p className="mt-4">
              <a
                href={s.whatsapp || `tel:${s.phone.replace(/\s/g, "")}`}
                target={s.whatsapp ? "_blank" : undefined}
                rel="noopener noreferrer"
                dir="ltr"
                className="font-mono text-sm text-muted-foreground transition-colors hover:text-brand"
              >
                {s.phone}
              </a>
            </p>
          )}
          <Socials settings={s} className="mt-8" />
        </Reveal>
        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
