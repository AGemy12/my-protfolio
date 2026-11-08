import { useTranslations } from "next-intl";
import Section from "@/components/ui/Section";

type Role = {
  period: string;
  title: string;
  org: string;
  points?: string[];
  projects?: string;
};

export default function Experience() {
  const t = useTranslations("experience");
  const roles = t.raw("roles") as Role[];

  return (
    <Section id="experience" band label={t("eyebrow")} title={t("title")}>
      <ol className="border-t border-line">
        {roles.map((role, index) => (
          <li
            key={index}
            className="grid gap-1.5 border-b border-line py-[30px] sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-8"
          >
            <span className="pt-1 text-[14.5px] text-muted tabular-nums">{role.period}</span>
            <div className="min-w-0">
              <h3 className="text-[1.45rem]">{role.title}</h3>
              <p className="mt-0.5 text-[15px] text-muted">{role.org}</p>
              {role.points?.length ? (
                <ul className="mt-3.5 grid max-w-[44em] list-disc gap-1.5 ps-[18px] text-[15.5px] text-muted marker:text-faint">
                  {role.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              ) : null}
              {role.projects && (
                <p className="mt-3.5 text-sm text-faint">
                  <b className="font-medium text-muted">{t("projectsLabel")}</b> {role.projects}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
