"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ArrowLeft, Trash } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { deleteItem, saveItem, type ActionResult } from "@/lib/actions/content";
import { resources, type Field, type ResourceKey } from "@/lib/resources";
import type { L, LList } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { useConfirmDelete } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldLabel, PageHeader } from "./ui";
import {
  FileField,
  GalleryField,
  IconPicker,
  LocalizedField,
  LocalizedListField,
  SwitchField,
  TagsField,
} from "./fields";

type Data = Record<string, unknown>;

const OPTION_NAMESPACES: Record<string, string> = {
  categories: "projects.categories",
  skillCategories: "skills.categories",
  experienceTypes: "experience.types",
};

export function useActionToast() {
  const t = useTranslations("admin");
  return (result: ActionResult, success = t("common.saved")) => {
    if (result.ok) toast.success(success);
    else
      toast.error(t(`errors.${result.error}` as never) || result.error, {
        description: "issues" in result ? result.issues?.slice(0, 4).join("\n") : undefined,
      });
    return result.ok;
  };
}

export function ResourceForm({
  resource,
  initial,
  title,
}: {
  resource: ResourceKey;
  initial: (Data & { _id?: string }) | null;
  title: string;
}) {
  const t = useTranslations("admin");
  const tRoot = useTranslations();
  const router = useRouter();
  const notify = useActionToast();
  const confirmDelete = useConfirmDelete();
  const config = resources[resource];
  const [data, setData] = useState<Data>(() => ({ ...config.empty, ...(initial ?? {}) }));
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [saving, startSave] = useTransition();
  const [deleting, startDelete] = useTransition();
  const id = initial?._id ?? null;

  const set = (name: string, value: unknown) =>
    setData((prev) => {
      const next = { ...prev, [name]: value };
      // keep the slug in sync with the English title until it is edited by hand
      const slugField = config.fields.find((f) => f.type === "slug") as Extract<Field, { type: "slug" }> | undefined;
      if (slugField && name === slugField.from && !slugTouched) {
        next[slugField.name] = slugify((value as L).en || "");
      }
      return next;
    });

  const label = (name: string) => t(`fields.${name}` as never);

  const render = (field: Field) => {
    const value = data[field.name];
    switch (field.type) {
      case "ltext":
        return (
          <LocalizedField
            key={field.name}
            label={label(field.name)}
            value={value as L}
            required={field.required}
            onChange={(v) => set(field.name, v)}
          />
        );
      case "ltextarea":
        return (
          <LocalizedField
            key={field.name}
            label={label(field.name)}
            value={value as L}
            multiline
            rows={field.rows}
            onChange={(v) => set(field.name, v)}
          />
        );
      case "llist":
        return (
          <LocalizedListField
            key={field.name}
            label={label(field.name)}
            value={value as LList}
            onChange={(v) => set(field.name, v)}
          />
        );
      case "image":
        return (
          <FileField
            key={field.name}
            label={label(field.name)}
            value={(value as string) ?? ""}
            onChange={(v) => set(field.name, v)}
          />
        );
      case "images":
        return (
          <GalleryField
            key={field.name}
            label={label(field.name)}
            value={(value as string[]) ?? []}
            onChange={(v) => set(field.name, v)}
          />
        );
      case "tags":
        return (
          <TagsField
            key={field.name}
            label={label(field.name)}
            value={(value as string[]) ?? []}
            onChange={(v) => set(field.name, v)}
          />
        );
      case "switch":
        return (
          <SwitchField
            key={field.name}
            label={label(field.name)}
            checked={Boolean(value)}
            onChange={(v) => set(field.name, v)}
          />
        );
      case "skillIcon":
      case "serviceIcon":
        return (
          <IconPicker
            key={field.name}
            kind={field.type === "skillIcon" ? "skill" : "service"}
            label={label(field.name)}
            value={(value as string) ?? ""}
            onChange={(v) => set(field.name, v)}
          />
        );
      case "select":
        return (
          <div key={field.name} className={field.half ? undefined : "sm:col-span-2"}>
            <FieldLabel htmlFor={field.name}>{label(field.name)}</FieldLabel>
            <Select value={(value as string) || undefined} onValueChange={(v) => set(field.name, v)}>
              <SelectTrigger id={field.name} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((o) => (
                  <SelectItem key={o} value={o}>
                    {tRoot(`${OPTION_NAMESPACES[field.optionsKey]}.${o}` as never)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case "slug":
        return (
          <div key={field.name} className="sm:col-span-2">
            <FieldLabel htmlFor={field.name} hint={`/projects#${(value as string) || "…"}`}>
              {label(field.name)}
            </FieldLabel>
            <Input
              id={field.name}
              dir="ltr"
              required
              value={(value as string) ?? ""}
              onChange={(e) => {
                setSlugTouched(true);
                set(field.name, slugify(e.target.value.replace(/\s/g, "-")) + (e.target.value.endsWith("-") ? "-" : ""));
              }}
              className="font-mono"
            />
          </div>
        );
      default:
        return (
          <div key={field.name} className={field.half ? undefined : "sm:col-span-2"}>
            <FieldLabel htmlFor={field.name}>
              {label(field.name)}
              {"required" in field && field.required && <span className="text-destructive"> *</span>}
            </FieldLabel>
            <Input
              id={field.name}
              type={field.type === "number" ? "number" : field.type === "url" ? "url" : "text"}
              dir={field.type === "text" ? "auto" : "ltr"}
              required={"required" in field ? field.required : undefined}
              value={(value as string | number | undefined) ?? ""}
              onChange={(e) =>
                set(
                  field.name,
                  field.type === "number"
                    ? e.target.value === ""
                      ? undefined
                      : Number(e.target.value)
                    : e.target.value,
                )
              }
            />
          </div>
        );
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startSave(async () => {
      const { _id, createdAt, updatedAt, ...payload } = data as Data & { createdAt?: unknown; updatedAt?: unknown };
      void _id;
      void createdAt;
      void updatedAt;
      const result = await saveItem(resource, id, payload);
      if (notify(result) && result.ok) {
        if (!id) router.replace(`/admin/${resource}/${result.id}`);
        router.refresh();
      }
    });
  };

  const onDelete = async () => {
    if (!id || !(await confirmDelete())) return;
    startDelete(async () => {
      if (notify(await deleteItem(resource, id))) router.replace(`/admin/${resource}`);
    });
  };

  const saveLabel = saving ? t("common.saving") : t("common.save");

  return (
    <form onSubmit={onSubmit}>
      <PageHeader
        title={title}
        actions={
          <>
            <Button asChild variant="ghost">
              <Link href={`/admin/${resource}`}>
                <ArrowLeft className="rtl:-scale-x-100" />
                {t("common.back")}
              </Link>
            </Button>
            {id && (
              <LoadingButton
                type="button"
                variant="ghost-destructive"
                loading={deleting}
                icon={<Trash />}
                onClick={onDelete}
              >
                {t("common.delete")}
              </LoadingButton>
            )}
            <LoadingButton type="submit" loading={saving}>
              {saveLabel}
            </LoadingButton>
          </>
        }
      />
      <Card>
        <CardContent className="grid gap-5 sm:grid-cols-2">{config.fields.map(render)}</CardContent>
      </Card>
      <div className="sticky bottom-4 mt-6 flex justify-end">
        <LoadingButton type="submit" loading={saving} className="shadow-xl">
          {saveLabel}
        </LoadingButton>
      </div>
    </form>
  );
}
