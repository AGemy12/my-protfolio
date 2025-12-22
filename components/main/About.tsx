"use client";
import React from "react";
import { motion } from "motion/react";
import SectionTitle from "../global/SectionTitle";
import {
  FiCode,
  FiPenTool,
  FiMonitor,
  FiCheck,
  FiMapPin,
  FiCalendar,
  FiAward,
} from "react-icons/fi";

const aboutCards = [
  {
    title: "Frontend Web Developer",
    date: "2021 – Present",
    icon: <FiCode size={32} />,
    description:
      "I specialize in building responsive, accessible, and high-performance user interfaces using React.js, Next.js, and TypeScript. I translate complex UI/UX designs into functional, scalable components.",
    highlight: true,
  },
  {
    title: "Modern UI/UX Implementation",
    date: "2020 – Present",
    icon: <FiPenTool size={32} />,
    description:
      "From Figma designs to production-ready code, I focus on delivering pixel-perfect layouts using Tailwind CSS and modern animation libraries like Framer Motion.",
  },
  {
    title: "Performance & Optimization",
    date: "2022 – 2024",
    icon: <FiMonitor size={32} />,
    description:
      "I optimize frontend applications for speed and SEO, leveraging SSR, lazy loading, and best practices to deliver fast and engaging user experiences.",
  },
];

const highlights = [
  "Responsive & Mobile-First Design",
  "Modern JavaScript (ES6+) & TypeScript",
  "Component-Based Architecture",
  "Performance Optimization & SEO",
];

export default function About() {
  return (
    <section
      id="about"
      className="container mx-auto w-11/12 py-16 md:py-24 lg:py-32"
    >
      <SectionTitle title="About Me" />

      {/* Introduction Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center max-w-4xl mx-auto mb-12 md:mb-16"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text mb-4">
          Who I Am
        </h2>
        <p className="text-base md:text-lg lg:text-xl leading-relaxed text-muted mb-6">
          I am a{" "}
          <span className="text-text font-semibold">
            Frontend Web Developer
          </span>{" "}
          with a passion for creating visually stunning and user-friendly
          interfaces. I have a strong foundation in modern web technologies and
          a keen eye for design.
        </p>

        {/* Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 max-w-2xl mx-auto">
          {highlights.map((highlight, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-sm md:text-base text-muted"
            >
              <FiCheck className="text-primary flex-shrink-0" size={18} />
              <span>{highlight}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Personal Info Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mx-auto mb-16 md:mb-20"
      >
        {[
          {
            label: "Name",
            value: "Ahmed Marzouk",
            icon: <FiAward size={20} />,
          },
          { label: "Age", value: "27", icon: <FiCalendar size={20} /> },
          {
            label: "Job Title",
            value: "Frontend Web Developer",
            icon: <FiCode size={20} />,
          },
          {
            label: "Graduation Year",
            value: "2022",
            icon: <FiAward size={20} />,
          },
          {
            label: "University",
            value: "Faculty of Computer Engineering",
            icon: <FiAward size={20} />,
          },
          {
            label: "Location",
            value: "Cairo, Egypt 🇪🇬",
            icon: <FiMapPin size={20} />,
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-primary-10 p-6 rounded-xl shadow-sm border-2 border-primary-20 hover:border-primary/40 hover:shadow-light-shadow transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-primary">{item.icon}</span>
              <p className="text-xs md:text-sm text-muted uppercase tracking-wider font-semibold">
                {item.label}
              </p>
            </div>
            <p className="text-base md:text-lg text-text font-bold">
              {item.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Mission Statement */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center max-w-4xl mx-auto mb-16 md:mb-20"
      >
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-text mb-4 md:mb-6">
          Crafting Seamless{" "}
          <span className="text-primary">Digital Experiences</span>
        </h2>
        <p className="text-base md:text-lg lg:text-xl text-muted leading-relaxed max-w-3xl mx-auto">
          A passionate frontend developer & designer, known for transforming
          ideas into delightful user experiences. I combine technical expertise
          with creative problem-solving to build applications that users love.
        </p>
      </motion.div>

      {/* Expertise Cards */}
      <div>
        <h3 className="text-2xl md:text-3xl font-bold text-text mb-8 md:mb-12 text-center">
          What I Do
        </h3>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {aboutCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`relative p-8 rounded-2xl shadow-lg text-text transition-all duration-500 ${
                card.highlight
                  ? "bg-gradient-to-br from-primary-50 to-primary/20 border-2 border-primary/30 shadow-light-shadow"
                  : "bg-main-bg border-2 border-primary-20 hover:border-primary/40 hover:shadow-light-shadow"
              }`}
            >
              <div
                className={`mb-6 p-4 rounded-xl w-fit ${
                  card.highlight
                    ? "bg-primary/20 text-primary"
                    : "bg-primary-10 text-primary"
                }`}
              >
                {card.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2">
                {card.title}
              </h3>
              <p className="text-sm font-semibold text-muted mb-4">
                {card.date}
              </p>
              <p className="leading-relaxed text-sm md:text-base text-muted">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
