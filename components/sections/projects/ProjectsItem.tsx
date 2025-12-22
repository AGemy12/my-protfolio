"use client";
import SimpleBtn from "@/components/buttons/SimpleBtn";
import { motion } from "motion/react";
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
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }}
      viewport={{ once: true, margin: "-100px" }}
      className="group relative overflow-hidden rounded-2xl border-2 border-primary-20 bg-main-bg hover:border-primary/40 hover:shadow-light-shadow transition-all duration-500 ease-out"
    >
      {/* Image Container with Overlay */}
      <div className="relative overflow-hidden aspect-video bg-gradient-to-br from-primary/5 to-primary/10">
        <Image
          src={image}
          alt={title}
          width={800}
          height={600}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
          priority={false}
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />

        {/* Hover Action Buttons */}
        <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out transform translate-y-4 group-hover:translate-y-0">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open(link, "_blank")}
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            aria-label={`View ${title} live demo`}
          >
            <FiExternalLink className="w-5 h-5" />
            Live Demo
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open(githubLink, "_blank")}
            className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold border-2 border-white/30 hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
            aria-label={`View ${title} on GitHub`}
          >
            <FiGithub className="w-5 h-5" />
            Code
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <h3 className="text-xl md:text-2xl font-bold text-text group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm md:text-base text-muted leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {techList.map((tech) => (
            <motion.span
              key={tech.id}
              whileHover={{ scale: 1.05 }}
              className="px-3 py-1.5 bg-primary-10 text-primary text-xs md:text-sm font-semibold rounded-full border border-primary/20 hover:bg-primary-20 hover:border-primary/40 transition-all duration-300"
            >
              {tech.title}
            </motion.span>
          ))}
        </div>

        {/* Action Buttons (Visible on mobile, hidden on hover for desktop) */}
        <div className="flex items-center gap-4 pt-2 md:hidden group-hover:hidden">
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
    </motion.article>
  );
}
