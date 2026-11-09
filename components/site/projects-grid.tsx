"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Project } from "@/lib/types";
import { ProjectCard } from "./project-card";

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const t = useTranslations("projects");
  const locale = useLocale();
  const [filter, setFilter] = useState<string>("all");

  const categories = useMemo(() => [...new Set(projects.map((p) => p.category))], [projects]);
  const shown = filter === "all" ? projects : projects.filter((p) => p.category === filter);

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
        {["all", ...categories].map((c) => (
          <ToggleGroupItem
            key={c}
            value={c}
            className="h-9 rounded-full bg-card px-4 text-muted-foreground hover:border-brand hover:bg-card hover:text-foreground data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            {c === "all" ? t("all") : t(`categories.${c}`)}
            <span className="font-mono text-xs opacity-60">
              {c === "all" ? projects.length : projects.filter((p) => p.category === c).length}
            </span>
          </ToggleGroupItem>
        ))}
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
                  deepLink
                  labels={{ category: t(`categories.${p.category}`), private: t("private"), details: t("details") }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </>
  );
}
