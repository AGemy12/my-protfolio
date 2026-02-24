"use client";

import React, { useMemo } from "react";
import SectionTitle from "../global/SectionTitle";
import { mySkillsList } from "@/utility/static-data/FixedLists";
import SkillsItem from "../sections/skills/SkillsItem";

type Skill = {
  id: number | string;
  title: string;
  imgSrc: string;
  define: string;
};

function splitToTwoRows(list: Skill[]) {
  const row1: Skill[] = [];
  const row2: Skill[] = [];
  list.forEach((item, idx) =>
    idx % 2 === 0 ? row1.push(item) : row2.push(item),
  );
  return { row1, row2 };
}

function MarqueeRow({
  items,
  direction = "left",
  duration = 26,
}: {
  items: Skill[];
  direction?: "left" | "right";
  duration?: number;
}) {
  const loopItems = useMemo(() => [...items, ...items], [items]);

  return (
    <div className="relative overflow-hidden">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-main-bg to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-main-bg to-transparent z-10" />

      <div
        className={[
          "flex w-max gap-4 md:gap-6 py-3",
          "will-change-transform",
          "hover:[animation-play-state:paused]",
          direction === "left"
            ? "animate-marquee-left"
            : "animate-marquee-right",
        ].join(" ")}
        style={{ ["--duration" as string]: `${duration}s` }}
      >
        {loopItems.map((skill, idx) => (
          <div key={`${skill.id}-${idx}`} className="shrink-0">
            <SkillsItem title={skill.title} imgSrc={skill.imgSrc} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const { row1, row2 } = useMemo(
    () => splitToTwoRows(mySkillsList as Skill[]),
    [],
  );

  return (
    <section
      className="relative container mx-auto md:w-full w-11/12 py-16 md:py-24 lg:py-32"
      id="skills"
    >
      <SectionTitle title="my skills" />

      <div className="mt-10 space-y-4 md:space-y-6">
        {/* Row 1: Right -> Left */}
        <MarqueeRow items={row1} direction="left" duration={26} />

        {/* Row 2: Left -> Right */}
        <MarqueeRow items={row2} direction="right" duration={30} />
      </div>
    </section>
  );
}
