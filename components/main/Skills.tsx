"use client";
import { motion } from "motion/react";
import SectionTitle from "../global/SectionTitle";
import { mySkillsList } from "@/utility/static-data/FixedLists";
import SkillsItem from "../sections/skills/SkillsItem";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function SkillsSection() {
  return (
    <section
      className="container mx-auto md:w-full w-11/12 py-16 md:py-24 lg:py-32"
      id="skills"
    >
      <SectionTitle title="my skills" />

      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {mySkillsList.map((skill) => (
          <SkillsItem
            key={skill.id}
            title={skill.title}
            imgSrc={skill.imgSrc}
            define={skill.define}
          />
        ))}
      </motion.div>
    </section>
  );
}
