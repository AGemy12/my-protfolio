import { getLocale, getTranslations } from "next-intl/server";
import { LogoMark } from "@/components/logo";
import { tr, type Settings } from "@/lib/types";
import { Socials } from "./socials";

export async function Footer({ settings }: { settings: Settings }) {
  const locale = await getLocale();
  const t = await getTranslations("footer");
  const name = tr(settings.name, locale);
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 py-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <LogoMark className="size-8 text-heading" />
            <div>
              <p className="font-semibold text-heading">{name}</p>
              <p className="text-sm text-muted-foreground">{tr(settings.role, locale)}</p>
            </div>
          </div>
          <Socials settings={settings} />
        </div>
        <div className="flex flex-col justify-between gap-2 border-t py-5 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {name}. {t("rights")}
          </p>
          <p className="ltr:font-mono">
            <span dir="ltr" className="font-mono text-emerald-500">
              200 OK
            </span>{" "}
            · {t("built")}
          </p>
        </div>
      </div>
    </footer>
  );
}
