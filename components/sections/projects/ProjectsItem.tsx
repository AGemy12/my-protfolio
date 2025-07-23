"use client";
import SimpleBtn from "@/components/buttons/SimpleBtn";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiExternalLink, FiGithub } from "react-icons/fi";

interface ProjectsItemProps {
  title: string;
  description: string;
  image: string;
  link: string;
  githubLink: string;
  techList: {
    id: number;
    title: string;
  }[];
}

export default function ProjectsItem({
  title,
  description,
  image,
  link,
  githubLink,
  techList,
}: ProjectsItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-2xl border-[2px] border-primary-20 bg-main-bg  hover:shadow-light-shadow transition-shadow duration-300"
    >
      <Image
        src={image}
        alt={title}
        width={1000}
        height={1000}
        className="w-full  object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="p-5 space-y-4">
        <h5 className="text-base md:text-xl font-semibold text-text">
          {title}
        </h5>
        <p className="text-sm text-muted line-clamp-3">{description}</p>
        <div className="flex items-center gap-2">
          {techList.map((tech) => (
            <div
              key={tech.id}
              className="p-1 bg-muted text-white rounded-sm text-xs font-bold"
            >
              {tech.title}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <SimpleBtn
            title="live demo"
            hasIcon
            Icon={FiExternalLink}
            handleClickEvent={() => window.open(link, "_blank")}
          />
          <SimpleBtn
            title="github"
            hasIcon
            Icon={FiGithub}
            handleClickEvent={() => window.open(githubLink, "_blank")}
            customStyle="bg-transparent hover:bg-primary-10"
          />
        </div>
      </div>
    </motion.div>
  );
}
