import { getLocale, getTranslations } from "next-intl/server";
import { tr, type Settings } from "@/lib/types";
import { Socials } from "./socials";

export async function Footer({ settings }: { settings: Settings }) {
  const locale = await getLocale();
  const t = await getTranslations("footer");
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 sm:flex-row sm:px-6">
        <div className="text-center text-sm text-muted-foreground sm:text-start">
          <p>
            © {new Date().getFullYear()} {tr(settings.name, locale)}. {t("rights")}
          </p>
          <p className="mt-1 font-mono text-xs">{t("built")}</p>
        </div>
        <Socials settings={settings} />
      </div>
    </footer>
  );
}
