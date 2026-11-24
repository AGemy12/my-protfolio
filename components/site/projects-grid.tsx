"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { tr, type Category, type Project } from "@/lib/types";
import { ProjectCard } from "./project-card";
import { projectPath } from "./project-dialog";

export function ProjectsGrid({ projects, categories: all }: { projects: Project[]; categories: Category[] }) {
  const t = useTranslations("projects");
  const locale = useLocale();
  const [filter, setFilter] = useState<string>("all");

  // One filter per visible category that has projects, in the dashboard's order.
  const categories = useMemo(
    () => all.filter((c) => c.published && projects.some((p) => p.category === c.slug)),
    [all, projects],
  );
  const shown = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  // Links shared before projects had their own pages look like /projects#slug:
  // move them to /projects/slug, which opens that project's dialog here.
  useEffect(() => {
    const slug = decodeURIComponent(window.location.hash.slice(1));
    if (slug && projects.some((p) => p.slug === slug)) {
      window.history.replaceState(null, "", `/${locale}${projectPath(slug)}`);
    }
  }, [projects, locale]);

  return (
    <>
      <ToggleGroup
        type="single"
        variant="outline"
        spacing={2}
        value={filter}
        onValueChange={(v) => v && setFilter(v)}
        aria-label={t("all")}
        className="mb-10 flex-wrap"
      >
        {[{ value: "all", label: t("all") }, ...categories.map((c) => ({ value: c.slug, label: tr(c.name, locale) }))].map(
          (c) => (
            <ToggleGroupItem
              key={c.value}
              value={c.value}
              className="h-9 rounded-full bg-card px-4 text-muted-foreground hover:border-brand hover:bg-card hover:text-foreground data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {c.label}
              <span className="font-mono text-xs opacity-60">
                {c.value === "all" ? projects.length : projects.filter((p) => p.category === c.value).length}
              </span>
            </ToggleGroupItem>
          ),
        )}
      </ToggleGroup>

      {shown.length === 0 ? (
        <p className="text-muted-foreground">{t("empty")}</p>
      ) : (
        <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {shown.map((p, i) => (
              <motion.div
                key={p._id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
                className="h-full"
              >
                <ProjectCard
                  project={p}
                  locale={locale}
                  priority={i < 3}
                  labels={{ category: tr(p.categoryName, locale), private: t("private"), details: t("details") }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </>
  );
}
