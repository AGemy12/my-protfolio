import { useTranslations } from "next-intl";
import Section from "@/components/ui/Section";
import { AppIcon, DashboardIcon, DatabaseIcon, GlobeIcon } from "@/components/ui/Icons";

type Service = { title: string; description: string };

const icons = [AppIcon, DatabaseIcon, DashboardIcon, GlobeIcon];

export default function Services() {
  const t = useTranslations("services");
  const items = t.raw("items") as Service[];

  return (
    <Section id="services" band label={t("eyebrow")} title={t("title")} intro={t("intro")}>
      <div className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((service, index) => {
          const Icon = icons[index % icons.length];
          return (
            <div key={index}className="grid content-start gap-3 border-t border-line pb-8 pt-7">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-1 text-[1.4rem]">{service.title}</h3>
              <p className="max-w-[28em] text-[15.5px] text-muted">{service.description}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
