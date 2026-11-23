import { getLocale, getTranslations } from "next-intl/server";
import { Mail, MapPin, Phone } from "lucide-react";
import { ServiceIcon } from "@/components/icons";
import {
  siteText,
  tr,
  trList,
  type Experience,
  type Project,
  type Service,
  type Settings,
  type SiteTexts,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";
import { Eyebrow, Section, SectionLink } from "./section";
import { ShowcaseCard } from "./project-showcase";
import { ContactForm } from "./contact-form";
import { Socials } from "./socials";
import { getContactForm } from "@/lib/data";
import { hasMailer } from "@/lib/mailer";
import { CONTACT_CHANNELS, waDigits, type ContactChannel } from "@/lib/contact-form";


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
    <Section
      id="about"
      eyebrow={siteText(s.texts, "aboutEyebrow", locale, t("eyebrow"))}
      title={siteText(s.texts, "aboutTitle", locale, t("title"))}
    >
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

export async function ExperienceSection({ items, texts }: { items: Experience[]; texts: SiteTexts }) {
  const locale = await getLocale();
  const t = await getTranslations("experience");

  return (
    <Section
      id="experience"
      eyebrow={siteText(texts, "experienceEyebrow", locale, t("eyebrow"))}
      title={siteText(texts, "experienceTitle", locale, t("title"))}
    >
      <ol className="border-b">
        {items.map((e, i) => {
          const highlights = trList(e.highlights, locale);
          return (
            <Reveal
              as="li"
              key={e._id}
              delay={i * 0.05}
              className="grid gap-x-10 gap-y-4 border-t py-7 first:border-t-0 first:pt-0 md:grid-cols-[16rem_minmax(0,1fr)]"
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

/* ── Projects: a quiet gallery — the featured build wide, then pairs ──────── */

export async function ProjectsSection({ projects, texts }: { projects: Project[]; texts: SiteTexts }) {
  const locale = await getLocale();
  const t = await getTranslations("projects");
  const lead = projects.find((p) => p.featured) ?? projects[0];
  const rest = projects
    .filter((p) => p._id !== lead._id)
    .sort((a, b) => (b.year || 0) - (a.year || 0))
    .slice(0, 4);

  return (
    <Section
      id="projects"
      eyebrow={siteText(texts, "projectsEyebrow", locale, t("eyebrow"))}
      title={siteText(texts, "projectsTitle", locale, t("title"))}
      action={<SectionLink href="/projects">{t("viewAll")}</SectionLink>}
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:gap-x-10 lg:gap-y-16">
        <Reveal className="sm:col-span-2">
          <ShowcaseCard
            project={lead}
            locale={locale}
            lead
            priority
            labels={{
              category: t(`categories.${lead.category}`),
              featured: lead.featured ? t("featured") : undefined,
            }}
          />
        </Reveal>
        {rest.map((p, i) => (
          <Reveal key={p._id} delay={(i % 2) * 0.08}>
            <ShowcaseCard project={p} locale={locale} labels={{ category: t(`categories.${p.category}`) }} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ── Services ───────────────────────────────────────────────────────────── */

export async function ServicesSection({ services, texts }: { services: Service[]; texts: SiteTexts }) {
  const locale = await getLocale();
  const t = await getTranslations("services");
  return (
    <Section
      id="services"
      eyebrow={siteText(texts, "servicesEyebrow", locale, t("eyebrow"))}
      title={siteText(texts, "servicesTitle", locale, t("title"))}
    >
      <div className="grid sm:grid-cols-2">
        {services.map((s, i) => (
          <Reveal
            as="article"
            key={s._id}
            delay={(i % 2) * 0.06}
            className={cn(
              "flex gap-4 border-b py-7",
              i % 2 === 0 ? "sm:pe-8" : "sm:border-s sm:ps-8",
              // The header's hairline already opens the list, so the first row sits right under it.
              i === 0 && "pt-0",
              i === 1 && "sm:pt-0",
            )}
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
  const [locale, t, form] = await Promise.all([getLocale(), getTranslations("contact"), getContactForm()]);
  const targets = { whatsapp: waDigits(s.whatsapp) || waDigits(s.phone), email: s.email };
  // Only the ways to send that have somewhere to go; sending from the site always works as a fallback.
  const ready: Record<ContactChannel, boolean> = {
    whatsapp: Boolean(targets.whatsapp),
    gmail: hasMailer(),
    email: Boolean(targets.email),
    site: true,
  };
  const on = CONTACT_CHANNELS.filter((c) => form.channels[c] && ready[c]);
  const channels: ContactChannel[] = on.length ? on : ["site"];
  return (
    <section id="contact" aria-labelledby="contact-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-24">
      <div className="grid gap-12 border-t border-foreground/20 pt-14 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16">
        <Reveal>
          <Eyebrow>{siteText(s.texts, "contactEyebrow", locale, t("eyebrow"))}</Eyebrow>
          <h2
            id="contact-title"
            className="mt-4 text-4xl leading-[1.15] font-bold text-balance sm:text-5xl ltr:tracking-tight rtl:leading-[1.35]"
          >
            {siteText(s.texts, "contactTitle", locale, t("title"))}
          </h2>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            {siteText(s.texts, "contactLead", locale, t("lead"))}
          </p>
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
          <ContactForm
            config={{ ...form, fields: form.fields.filter((f) => f.enabled) }}
            channels={channels}
            targets={targets}
          />
        </Reveal>
      </div>
    </section>
  );
}
