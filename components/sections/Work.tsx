import Image from "next/image";
import { useTranslations } from "next-intl";
import Section from "@/components/ui/Section";
import { ExternalIcon } from "@/components/ui/Icons";
import type { Profile, Project, ProjectText } from "@/lib/content/types";

export default function Work({ profile, projects }: { profile: Profile; projects: Project[] }) {
  const t = useTranslations("work");
  // Read raw: project text is free text, and the list of projects is edited
  // from the dashboard, so its keys aren't known to the message types.
  const texts = (t.raw as (key: string) => unknown)("projects") as Record<string, ProjectText>;

  return (
    <Section
      id="work"
      label={t("eyebrow")}
      title={t("title")}
      intro={t("intro")}
      action={
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[15px] font-medium text-accent hover:underline hover:underline-offset-4"
        >
          {t("github")}
          <ExternalIcon />
        </a>
      }
    >
      <div className="grid gap-x-[clamp(20px,3vw,36px)] gap-y-[clamp(36px,5vw,56px)] md:grid-cols-2">
        {projects.map((project) => {
          const { title, description, tags } = texts[project.id] ?? {
            title: "",
            description: "",
            tags: [],
          };
          return (
            <a
              key={project.id}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${title} · ${t("visit")}`}
              className="group grid content-start gap-4"
            >
              <div className="flex aspect-[16/11] items-end overflow-hidden rounded-[18px] bg-panel px-[clamp(14px,3vw,28px)] pt-[clamp(14px,3vw,28px)]">
                <div className="relative h-full w-full overflow-hidden rounded-t-lg shadow-[0_-1px_0_var(--line),0_6px_22px_rgb(0_0_0/0.1)] transition-transform duration-500 ease-calm group-hover:-translate-y-1.5">
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 92vw, 540px"
                    className="object-cover object-top"
                  />
                </div>
              </div>
              <div className="mt-1 flex items-baseline justify-between gap-4">
                <h3 className="text-[1.5rem]">{title}</h3>
                <ExternalIcon className="text-muted transition-colors duration-200 group-hover:text-accent" />
              </div>
              <p className="-mt-2 text-[15.5px] text-muted">{description}</p>
              <ul className="flex flex-wrap gap-1.5">
                {tags.map((tag, index) => (
                  <li key={index}className="rounded-md bg-panel px-2.5 py-0.5 text-[12.5px] text-muted">
                    {tag}
                  </li>
                ))}
              </ul>
            </a>
          );
        })}
      </div>

      <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-[15px] text-muted">
        <span>
          <b className="font-medium text-fg">{t("privateLabel")}</b> {t("private")}
        </span>
        <span className="text-faint">{t("privateNote")}</span>
      </div>
    </Section>
  );
}
