"use client";
import React from "react";
import { motion } from "framer-motion";
import SectionTitle from "../global/SectionTitle";
import { FiCode, FiPenTool, FiMonitor } from "react-icons/fi";
import FooterHead from "../sections/footer/FooterHead";

const aboutCards = [
  {
    title: "Frontend Web Developer",
    date: "2021 – Present",
    icon: <FiCode size={30} />,
    description:
      "I specialize in building responsive, accessible, and high-performance user interfaces using React.js, Next.js, and TypeScript. I translate complex UI/UX designs into functional, scalable components.",
    highlight: true,
  },
  {
    title: "Modern UI/UX Implementation",
    date: "2020 – Present",
    icon: <FiPenTool size={30} />,
    description:
      "From Figma designs to production-ready code, I focus on delivering pixel-perfect layouts using Tailwind CSS and modern animation libraries like Framer Motion.",
  },
  {
    title: "Performance & Optimization",
    date: "2022 – 2024",
    icon: <FiMonitor size={30} />,
    description:
      "I optimize frontend applications for speed and SEO, leveraging SSR, lazy loading, and best practices to deliver fast and engaging user experiences.",
  },
];

export default function About() {
  return (
    <section id="about" className="container mx-auto w-11/12 py-24">
      <SectionTitle title="About Me" />

      <div className="text-center max-w-3xl mx-auto mb-12">
        <FooterHead
          title="my self introduction"
          customStyle="text-xl md:!text-3xl "
        />
        <p className="mt-4  text-center text-sm md:text-lg  leading-8 text-text">
          I am a Frontend Web Developer with a passion for creating visually
          stunning and user-friendly interfaces. I have a strong foundation in
        </p>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mx-auto mt-12 mb-20">
        {[
          { label: "Name", value: "Ahmed Marzouk" },
          { label: "Age", value: "27" },
          { label: "Job Title", value: "Frontend Web Developer" },
          { label: "Graduation Year", value: "2022" },
          { label: "University", value: "Faculty of Computer Engineering" },
          { label: "Location", value: "Cairo, Egypt 🇪🇬" },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="bg-primary-10 p-5 rounded-lg shadow-sm border-[2px] border-primary-20"
          >
            <p className="text-sm text-muted uppercase tracking-wide mb-1">
              {item.label}
            </p>
            <p className="text-sm text-text font-semibold">{item.value}</p>
          </motion.div>
        ))}
      </div>
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-4xl font-bold text-text">
          Crafting Seamless Digital Experiences
        </h2>
        <p className="text-text-muted mt-4 text-sm md:text-lg text-text">
          A passionate frontend developer & designer, known for transforming
          ideas into delightful user experiences.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {aboutCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            viewport={{ once: true }}
            className={`relative p-6 rounded-xl  shadow-light-shadow text-text ${
              card.highlight
                ? "bg-primary-50  border-[1px] border-primary-50 "
                : "bg-main-bg "
            }`}
          >
            <div className="mb-4">{card.icon}</div>
            <h3 className="text-xl font-semibold">{card.title}</h3>
            <p className="text-sm font-medium opacity-80 mt-1">{card.date}</p>
            <p className="mt-4 leading-relaxed text-sm">{card.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
