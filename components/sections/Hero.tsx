import Image from "next/image";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import { container } from "@/components/ui/Section";
import type { Profile } from "@/lib/content/types";

type Fact = { value: string; label: string };

export default function Hero({ profile }: { profile: Profile }) {
  const t = useTranslations("hero");
  const facts = t.raw("facts") as Fact[];

  return (
    <div className="pb-[clamp(48px,7vw,80px)] pt-[clamp(40px,7vw,88px)]">
      <div className={container}>
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] md:gap-[clamp(40px,6vw,80px)]">
          <div className="min-w-0">
            <div className="flex animate-fade-in flex-wrap items-center gap-x-3.5 gap-y-2.5">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface py-1.5 pe-3.5 ps-3 text-[14.5px]">
                <i className="h-[7px] w-[7px] rounded-full bg-success shadow-[0_0_0_4px_color-mix(in_srgb,var(--success)_18%,transparent)]" />
                {t("available")}
              </span>
              <span className="text-[14.5px] text-muted">
                {t("role")} · {t("location")}
              </span>
            </div>

            <h1 className="mt-6 max-w-[13.5em] animate-fade-in text-[clamp(2.4rem,5.6vw,4.2rem)] [animation-delay:80ms]">
              {t("titleStart")}{" "}
              <em className="italic text-accent rtl:not-italic">{t("titleEnd")}</em>
            </h1>

            <p className="mt-6 max-w-[33em] animate-fade-in text-[clamp(1.05rem,1.6vw,1.17rem)] text-muted [animation-delay:160ms]">
              {t("intro")}
            </p>

            <div className="mt-9 flex animate-fade-in flex-wrap gap-3 [animation-delay:240ms]">
              <Button href="#work" icon="arrow">
                {t("viewWork")}
              </Button>
              <Button href={profile.cv} download variant="secondary" icon="download">
                {t("downloadCv")}
              </Button>
            </div>
          </div>

          <div className="relative order-first aspect-square w-full max-w-[300px] animate-fade-in overflow-hidden rounded-3xl bg-[linear-gradient(180deg,var(--panel),color-mix(in_srgb,var(--panel)_78%,var(--accent)_14%))] [animation-delay:160ms] md:order-none md:aspect-[4/5] md:max-w-none">
            <Image
              src={profile.photo}
              alt={t("portraitAlt")}
              fill
              priority
              sizes="(max-width: 768px) 300px, 400px"
              className="object-contain object-bottom pt-[8%]"
            />
          </div>
        </div>

        <dl className="mt-[clamp(44px,7vw,80px)] grid animate-fade-in border-t border-line [animation-delay:320ms] sm:grid-cols-3">
          {facts.map((fact, index) => (
            <div
              key={index}
              className={`flex flex-col-reverse py-[18px] sm:pb-0 sm:pt-6 ${
                index > 0
                  ? "border-t border-line sm:border-s sm:border-t-0 sm:ps-6"
                  : "sm:pe-6"
              }`}
            >
              <dt className="text-[14.5px] text-muted">{fact.label}</dt>
              <dd className="font-head text-[2.1rem] leading-[1.2] tracking-[var(--head-tracking)] tabular-nums">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
