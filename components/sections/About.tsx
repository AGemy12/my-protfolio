import { useTranslations } from "next-intl";
import Section from "@/components/ui/Section";

type Detail = { term: string; value: string };
type Group = { name: string; items: string[] };

export default function About() {
  const t = useTranslations("about");
  const details = t.raw("details") as Detail[];
  const groups = t.raw("groups") as Group[];

  return (
    <Section id="about" label={t("eyebrow")} title={t("title")}>
      <div className="grid gap-[clamp(40px,6vw,88px)] md:grid-cols-2">
        <div className="min-w-0">
          <div className="grid max-w-[36em] gap-4 text-muted">
            <p className="text-[1.08em] text-fg">{t("lead")}</p>
            <p>{t("body")}</p>
          </div>
          <dl className="mt-9 border-t border-line">
            {details.map((detail, index) => (
              <div
                key={index}
                className="grid gap-1 border-b border-line py-3.5 text-[15.5px] sm:grid-cols-[130px_minmax(0,1fr)] sm:gap-4"
              >
                <dt className="text-faint">{detail.term}</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="min-w-0">
          <h3 className="mb-3 font-sans text-[13px] font-medium uppercase tracking-[0.08em] text-faint rtl:text-[14px] rtl:normal-case rtl:tracking-normal">
            {t("toolkit")}
          </h3>
          {groups.map((group, index) => (
            <div
              key={index}
              className="grid items-baseline gap-2.5 border-t border-line py-4 sm:grid-cols-[130px_minmax(0,1fr)] sm:gap-4"
            >
              <span className="text-[15px] font-medium">{group.name}</span>
              <ul className="flex flex-wrap gap-1.5">
                {group.items.map((item, i) => (
                  <li key={i}className="rounded-md bg-panel px-2.5 py-0.5 text-[13px] text-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
