import { useTranslations } from "next-intl";
import { container, SectionHeading } from "@/components/ui/Section";
import CopyButton from "@/components/ui/CopyButton";
import ContactForm from "@/components/sections/ContactForm";
import { ExternalIcon } from "@/components/ui/Icons";
import type { Profile } from "@/lib/content/types";

const linkClass =
  "inline-flex items-center gap-1.5 font-medium text-fg transition-colors duration-200 hover:text-accent";

export default function Contact({ profile }: { profile: Profile }) {
  const t = useTranslations("contact");

  const channels = [
    { label: t("email"), value: profile.email, copy: true },
    { label: t("phone"), value: profile.phone, copy: true, href: profile.whatsapp },
    { label: "LinkedIn", value: profile.linkedinName, href: profile.linkedin },
    { label: "GitHub", value: profile.githubUser, href: profile.github },
  ];

  return (
    <section id="contact" className="border-t border-line py-[clamp(64px,9vw,108px)]">
      <div className={container}>
        <div className="grid gap-[clamp(36px,6vw,72px)] rounded-[26px] border border-line bg-surface p-[clamp(22px,5vw,56px)] md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="min-w-0">
            <SectionHeading label={t("eyebrow")} title={t("title")} intro={t("intro")} />
            <div className="mt-8 border-t border-line">
              {channels.map((channel) => (
                <div
                  key={channel.label}
                  className="flex items-center justify-between gap-3.5 border-b border-line py-4"
                >
                  <div className="min-w-0">
                    <small className="block text-[13.5px] text-faint">{channel.label}</small>
                    {channel.href ? (
                      <a
                        href={channel.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        dir="ltr"
                        className={linkClass}
                      >
                        {channel.value}
                        <ExternalIcon className="h-3.5 w-3.5 text-faint" />
                      </a>
                    ) : (
                      <span dir="ltr" className="block break-words">
                        {channel.value}
                      </span>
                    )}
                  </div>
                  {channel.copy && <CopyButton text={channel.value} />}
                </div>
              ))}
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
