"use client";

import { useMemo, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Eye, EyeOff, Pencil, Plus, Search, Star, Trash } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { deleteItem, reorderItems, toggleItem } from "@/lib/actions/content";
import { resources, type ResourceKey } from "@/lib/resources";
import { SkillIcon } from "@/components/icons";
import { useConfirmDelete } from "@/components/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { EmptyState, Hint, PageHeader } from "./ui";
import { useActionToast } from "./resource-form";

type Item = Record<string, unknown> & { _id: string };

export function ResourceList({ resource, items: initial, title }: { resource: ResourceKey; items: Item[]; title: string }) {
  const t = useTranslations("admin.common");
  const locale = useLocale();
  const router = useRouter();
  const notify = useActionToast();
  const confirmDelete = useConfirmDelete();
  const config = resources[resource];
  const [items, setItems] = useState(initial);
  const [query, setQuery] = useState("");
  const [, startTransition] = useTransition();

  // keep local state in sync after router.refresh()
  const [source, setSource] = useState(initial);
  if (source !== initial) {
    setSource(initial);
    setItems(initial);
  }

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? items.filter(
          (i) =>
            config.title(i, locale).toLowerCase().includes(q) || config.subtitle(i, locale).toLowerCase().includes(q),
        )
      : items;
  }, [items, query, config, locale]);

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    startTransition(async () => {
      const result = await reorderItems(
        resource,
        next.map((i) => i._id),
      );
      if (result.ok) toast.success(t("orderSaved"));
      else notify(result);
    });
  };

  const toggle = (item: Item, field: "published" | "featured") => {
    const value = !item[field];
    setItems((list) => list.map((i) => (i._id === item._id ? { ...i, [field]: value } : i)));
    startTransition(async () => {
      const result = await toggleItem(resource, item._id, field, value);
      if (!result.ok) {
        notify(result);
        router.refresh();
      }
    });
  };

  const remove = async (item: Item) => {
    if (!(await confirmDelete())) return;
    setItems((list) => list.filter((i) => i._id !== item._id));
    startTransition(async () => {
      notify(await deleteItem(resource, item._id));
      router.refresh();
    });
  };

  return (
    <>
      <PageHeader
        title={title}
        description={`${items.length} ${t("items")}`}
        actions={
          <Button asChild>
            <Link href={`/admin/${resource}/new`}>
              <Plus />
              {t("new")}
            </Link>
          </Button>
        }
      />

      {items.length > 6 && (
        <div className="relative mb-4 max-w-sm">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("search")} className="ps-9" />
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState>{t("empty")}</EmptyState>
      ) : (
        <Card className="gap-0 divide-y overflow-hidden py-0">
          {shown.map((item) => {
            const index = items.indexOf(item);
            const thumb = config.thumb?.(item);
            const icon = config.icon?.(item);
            const featured = Boolean(item.featured);
            const published = Boolean(item.published);
            return (
              <div
                key={item._id}
                className={cn("flex items-center gap-3 p-3 transition-colors hover:bg-muted/40 sm:gap-4 sm:p-4", !published && "opacity-60")}
              >
                {!query && (
                  <div className="flex flex-col">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      aria-label={t("moveUp")}
                      disabled={index === 0}
                      onClick={() => move(index, -1)}
                    >
                      <ChevronUp />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      aria-label={t("moveDown")}
                      disabled={index === items.length - 1}
                      onClick={() => move(index, 1)}
                    >
                      <ChevronDown />
                    </Button>
                  </div>
                )}
                {config.thumb && (
                  <div className="hidden h-12 w-18 shrink-0 overflow-hidden rounded-md border bg-muted sm:block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {thumb && <img src={thumb} alt="" className="size-full object-cover object-top" />}
                  </div>
                )}
                {config.icon && (
                  <span className="grid size-10 shrink-0 place-items-center rounded-md border">
                    <SkillIcon name={icon ?? ""} className="size-5" />
                  </span>
                )}
                <Link href={`/admin/${resource}/${item._id}`} className="min-w-0 flex-1">
                  <p className="truncate font-medium">{config.title(item, locale) || "—"}</p>
                  <p className="truncate text-xs text-muted-foreground">{config.subtitle(item, locale)}</p>
                </Link>
                <div className="hidden items-center gap-1.5 md:flex">
                  {featured && <Badge variant="brand">{t("featured")}</Badge>}
                  {!published && <Badge variant="secondary">{t("hidden")}</Badge>}
                </div>
                <div className="flex items-center">
                  {config.featurable && (
                    <Hint label={t("featured")}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={t("featured")}
                        aria-pressed={featured}
                        onClick={() => toggle(item, "featured")}
                        className={cn(featured && "text-amber-500 hover:text-amber-500")}
                      >
                        <Star className={cn(featured && "fill-current")} />
                      </Button>
                    </Hint>
                  )}
                  <Hint label={published ? t("published") : t("hidden")}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={t("published")}
                      aria-pressed={published}
                      onClick={() => toggle(item, "published")}
                    >
                      {published ? <Eye /> : <EyeOff />}
                    </Button>
                  </Hint>
                  <Hint label={t("edit")}>
                    <Button asChild variant="ghost" size="icon">
                      <Link href={`/admin/${resource}/${item._id}`} aria-label={t("edit")}>
                        <Pencil />
                      </Link>
                    </Button>
                  </Hint>
                  <Hint label={t("delete")}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={t("delete")}
                      onClick={() => remove(item)}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash />
                    </Button>
                  </Hint>
                </div>
              </div>
            );
          })}
        </Card>
      )}
    </>
  );
}
