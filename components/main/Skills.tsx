"use client";
import { motion } from "framer-motion";
import SectionTitle from "../global/SectionTitle";
import { mySkillsList } from "@/utility/static-data/FixedLists";
import SkillsItem from "../sections/skills/SkillsItem";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function SkillsSection() {
  return (
    <div className="container mx-auto md:w-full w-11/12" id="skills">
      <SectionTitle title="my skills" />

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
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
    </div>
  );
}
