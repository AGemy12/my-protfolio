import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ServiceIcon } from "@/components/icons";
import { SmartImage } from "@/components/smart-image";
import { tr, trList, type Experience, type Project, type Service, type Settings } from "@/lib/types";
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
          <dl className="divide-y border-y">
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

/* ── Experience ─────────────────────────────────────────────────────────── */

export async function ExperienceSection({ items }: { items: Experience[] }) {
  const locale = await getLocale();
  const t = await getTranslations("experience");

  return (
    <Section id="experience" eyebrow={t("eyebrow")} title={t("title")}>
      <ol className="border-b">
        {items.map((e, i) => {
          const highlights = trList(e.highlights, locale);
          return (
            <Reveal
              as="li"
              key={e._id}
              delay={i * 0.05}
              className="grid gap-x-10 gap-y-4 border-t py-7 md:grid-cols-[16rem_minmax(0,1fr)]"
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
                <p className="mt-2 text-sm text-brand">
                  {e.start} – {e.current ? t("present") : e.end}
                </p>
              </div>
              <div className="min-w-0">
                {highlights.length > 0 && (
                  <ul className="max-w-[70ch] list-disc space-y-2 ps-5 text-[15px] leading-relaxed marker:text-brand">
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
            <p className="text-sm text-brand">
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
              <span className="inline-flex items-center gap-1.5 font-medium text-heading">
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

/* ── Services ───────────────────────────────────────────────────────────── */

export async function ServicesSection({ services }: { services: Service[] }) {
  const locale = await getLocale();
  const t = await getTranslations("services");
  return (
    <Section id="services" eyebrow={t("eyebrow")} title={t("title")}>
      <div className="grid border-t sm:grid-cols-2">
        {services.map((s, i) => (
          <Reveal
            as="article"
            key={s._id}
            delay={(i % 2) * 0.06}
            className={cn("flex gap-4 border-b py-7", i % 2 === 0 ? "sm:pe-8" : "sm:border-s sm:ps-8")}
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
              <ServiceIcon name={s.icon} className="size-5" />
            </span>
            <div className="min-w-0">
              <h3 className="text-lg leading-snug font-semibold sm:text-xl">{tr(s.title, locale)}</h3>
              <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-pretty">{tr(s.description, locale)}</p>
            </div>
          </Reveal>
        ))}
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
