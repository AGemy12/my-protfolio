"use client";

import SimpleBtn from "@/components/buttons/SimpleBtn";
import { motion } from "motion/react";
import Image from "next/image";
import { FiExternalLink, FiGithub } from "react-icons/fi";

interface ProjectsItemProps {
  title: string;
  description: string;
  image: string;
  link?: string;
  githubLink?: string;
  techList: { id: number; title: string }[];
}

export default function ProjectsItem({
  title,
  description,
  image,
  link,
  githubLink,
  techList,
}: ProjectsItemProps) {
  const hasActions = Boolean(link || githubLink);

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "-100px" }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-main-bg/60 backdrop-blur-sm
                 shadow-[0_10px_35px_-25px_rgba(0,0,0,0.65)]
                 hover:border-primary/35 hover:shadow-[0_18px_55px_-30px_rgba(0,0,0,0.8)]
                 transition-all duration-500"
    >
      {/* subtle glow */}
      <div
        className="pointer-events-none absolute -inset-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(closest-side, rgba(34,197,94,0.15), transparent 60%)",
        }}
      />

      {/* Media */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={image}
          alt={title}
          width={1200}
          height={675}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          priority={false}
        />

        {/* overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

        {/* top actions */}
        {hasActions && (
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
            {link && (
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => window.open(link, "_blank")}
                className="h-10 w-10 rounded-xl bg-primary/70 border border-primary/80 backdrop-blur-md
                           hover:bg-primary hover:border-primary transition flex items-center justify-center"
                aria-label={`Open ${title} live demo`}
                title="Live Demo"
              >
                <FiExternalLink className="text-white" />
              </motion.button>
            )}
            {githubLink && (
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => window.open(githubLink, "_blank")}
                className="h-10 w-10 rounded-xl bg-primary/70 border border-primary/80 backdrop-blur-md
                           hover:bg-primary hover:border-primary transition flex items-center justify-center"
                aria-label={`Open ${title} on GitHub`}
                title="GitHub"
              >
                <FiGithub className="text-white" />
              </motion.button>
            )}
          </div>
        )}

        {/* bottom label */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight drop-shadow">
            {title}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {techList.slice(0, 4).map((t) => (
              <span
                key={t.id}
                className="text-[11px] md:text-xs px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-white/90 backdrop-blur"
              >
                {t.title}
              </span>
            ))}
            {techList.length > 4 && (
              <span className="text-[11px] md:text-xs px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-white/80 backdrop-blur">
                +{techList.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-sm md:text-base text-muted leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* Mobile actions */}
        <div className="mt-5 flex items-center gap-3 md:hidden">
          {link && (
            <SimpleBtn
              title="live demo"
              hasIcon
              Icon={FiExternalLink}
              handleClickEvent={() => window.open(link, "_blank")}
            />
          )}
          {githubLink && (
            <SimpleBtn
              title="github"
              hasIcon
              Icon={FiGithub}
              handleClickEvent={() => window.open(githubLink, "_blank")}
              customStyle="bg-transparent hover:bg-primary-10"
            />
          )}
        </div>
      </div>
    </motion.article>
  );
}
