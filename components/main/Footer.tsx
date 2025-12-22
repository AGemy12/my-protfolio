"use client";
import { contactsLinks, links } from "@/utility/static-data/FixedLists";
import SocialItem from "../sections/hero/SocialItem";
import Link from "next/link";
import MainBtn from "../buttons/MainBtn";
import { motion } from "motion/react";

export default function Footer() {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/assets/media/cv/cv.pdf";
    link.download = "cv.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-primary/20 bg-primary-10/50 dark:bg-primary-10">
      <div className="container mx-auto w-11/12 md:w-full px-4 md:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 py-12 md:py-16">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-start"
          >
            <h3 className="text-xl md:text-2xl font-bold text-text mb-2">
              Ahmad Marzouk
            </h3>
            <p className="text-sm md:text-base text-muted mb-4 text-center md:text-left">
              Frontend Web Developer
            </p>
            <p className="text-xs md:text-sm text-muted leading-relaxed text-center md:text-left max-w-xs">
              Crafting fast, modern, and responsive web interfaces with React,
              Vue, Next.js & Nuxt.js.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-start"
          >
            <h4 className="text-base md:text-lg font-bold text-text mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2">
              {links.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.path && link.path}
                    className="text-sm md:text-base text-muted hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1 capitalize font-bold"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-start"
          >
            <h4 className="text-base md:text-lg font-bold text-text mb-4 uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex items-center gap-3">
              {contactsLinks.map((link) => (
                <SocialItem
                  key={link.id}
                  path={link.link}
                  title={link.title}
                  Icon={link.icon}
                />
              ))}
            </div>
          </motion.div>

          {/* CV Download */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-start"
          >
            <h4 className="text-base md:text-lg font-bold text-text mb-4 uppercase tracking-wider">
              Resume
            </h4>
            <p className="text-xs md:text-sm text-muted mb-4 text-center md:text-left">
              Download my CV to learn more about my experience and skills.
            </p>
            <MainBtn title="Download CV" handleClickEvent={handleDownload} />
          </motion.div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-primary/20 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs md:text-sm text-muted text-center md:text-left">
              © {currentYear} Ahmad Marzouk. All rights reserved.
            </p>
            <p className="text-xs md:text-sm text-muted text-center md:text-right">
              Built with{" "}
              <span className="text-primary font-semibold">Next.js</span> &{" "}
              <span className="text-primary font-semibold">React</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
