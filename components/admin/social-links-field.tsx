"use client";

import { useTranslations } from "next-intl";
import { ChevronDown, ChevronUp, Plus, Trash } from "lucide-react";
import { SocialIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SOCIAL_KEYS, SOCIAL_PLATFORMS, type SocialLink, type SocialPlatform } from "@/lib/socials";
import { Hint } from "./ui";

/** Platforms whose links usually need their own name (a blog, a shop…). */
const NAMED: SocialPlatform[] = ["website", "other"];

/** The ordered list of social links: pick a platform, paste the link, reorder or remove. */
export function SocialLinksField({ value, onChange }: { value: SocialLink[]; onChange: (v: SocialLink[]) => void }) {
  const t = useTranslations("admin");

  const patch = (index: number, change: Partial<SocialLink>) =>
    onChange(value.map((l, i) => (i === index ? { ...l, ...change } : l)));
  const move = (index: number, dir: -1 | 1) => {
    const next = [...value];
    [next[index], next[index + dir]] = [next[index + dir], next[index]];
    onChange(next);
  };
  // suggests the first platform not in the list yet
  const add = () => {
    const used = new Set(value.map((l) => l.platform));
    const platform = SOCIAL_KEYS.find((p) => !used.has(p) && !NAMED.includes(p)) ?? "website";
    onChange([...value, { platform, url: "", label: "" }]);
  };

  return (
    <div className="space-y-3 sm:col-span-2">
      {value.length === 0 && <p className="text-sm text-muted-foreground">{t("socials.empty")}</p>}
      <ul className="space-y-3">
        {value.map((link, i) => (
          <li key={i} className="flex flex-wrap items-start gap-2 rounded-lg border p-2.5 sm:flex-nowrap">
            <div className="flex flex-col">
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={t("common.moveUp")}
                disabled={i === 0}
                onClick={() => move(i, -1)}
              >
                <ChevronUp />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={t("common.moveDown")}
                disabled={i === value.length - 1}
                onClick={() => move(i, 1)}
              >
                <ChevronDown />
              </Button>
            </div>
            <Select value={link.platform} onValueChange={(v) => patch(i, { platform: v as SocialPlatform })}>
              <SelectTrigger className="w-44 shrink-0" aria-label={t("socials.platform")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {SOCIAL_KEYS.map((p) => (
                  <SelectItem key={p} value={p}>
                    <SocialIcon platform={p} className="size-4" />
                    {NAMED.includes(p) ? t(`socials.platforms.${p}` as never) : SOCIAL_PLATFORMS[p].name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="grid min-w-0 flex-1 basis-56 gap-2">
              <Input
                type="url"
                dir="ltr"
                required
                aria-label={t("socials.url")}
                placeholder={SOCIAL_PLATFORMS[link.platform].example}
                value={link.url}
                onChange={(e) => patch(i, { url: e.target.value })}
              />
              {(NAMED.includes(link.platform) || link.label) && (
                <Input
                  dir="auto"
                  maxLength={40}
                  aria-label={t("socials.label")}
                  placeholder={t("socials.labelHint")}
                  value={link.label}
                  onChange={(e) => patch(i, { label: e.target.value })}
                />
              )}
            </div>
            <Hint label={t("common.remove")}>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={t("common.remove")}
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash />
              </Button>
            </Hint>
          </li>
        ))}
      </ul>
      <Button type="button" variant="outline" onClick={add} disabled={value.length >= 20}>
        <Plus />
        {t("socials.add")}
      </Button>
    </div>
  );
}
