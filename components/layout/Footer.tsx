import { useTranslations } from "next-intl";
import { container } from "@/components/ui/Section";
import type { Profile } from "@/lib/content/types";

const link = "transition-colors duration-200 hover:text-fg";

export default function Footer({ profile }: { profile: Profile }) {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line py-9 text-[14.5px] text-muted">
      <div className={`${container} flex flex-wrap items-center justify-between gap-4`}>
        <span>{t("rights", { year })}</span>
        <nav aria-label={t("label")} className="flex flex-wrap gap-[22px]">
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className={link}>
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={link}>
            LinkedIn
          </a>
          <a href="#top" className={link}>
            {t("top")}
          </a>
        </nav>
      </div>
    </footer>
  );
}
