"use client";

import React from "react";
import { contactsLinks, links } from "@/utility/static-data/FixedLists";
import SocialItem from "../sections/hero/SocialItem";
import Link from "next/link";
import MainBtn from "../buttons/MainBtn";
import { motion } from "motion/react";

export default function Footer() {
  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = "/assets/media/cv/cv.pdf";
    a.download = "cv.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      {/* Soft Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-64 w-[620px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-24 right-10 h-60 w-60 rounded-full bg-primary-20/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_55%)]" />
      </div>

      {/* Top Gradient Border */}
      <div className="relative h-[1px] w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="relative bg-white/5 dark:bg-primary-10/40 backdrop-blur-xl">
        <div className="container mx-auto w-11/12 md:w-full px-4 md:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 py-14 md:py-16">
            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, margin: "-80px" }}
              className="flex flex-col items-center md:items-start"
            >
              <div className="relative">
                <div className="pointer-events-none absolute -inset-3 rounded-2xl bg-primary/10 blur-2xl opacity-60" />
                <h3 className="relative text-xl md:text-2xl font-extrabold tracking-wide text-text">
                  Ahmad Marzouk
                </h3>
              </div>

              <p className="mt-2 text-sm md:text-base text-muted text-center md:text-left">
                Fullstack JavaScript Developer
              </p>

              <p className="mt-4 text-xs md:text-sm text-muted/90 leading-relaxed text-center md:text-left max-w-xs">
                Crafting fast, modern, and responsive web interfaces with React,
                Vue, Next.js & Nuxt.js.
              </p>

              {/* Decorative line */}
              <div className="mt-6 h-[2px] w-16 rounded-full bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.55,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true, margin: "-80px" }}
              className="flex flex-col items-center md:items-start"
            >
              <h4 className="text-sm md:text-base font-extrabold text-text uppercase tracking-[0.22em] mb-5">
                Quick Links
              </h4>

              <ul className="flex flex-col gap-3">
                {links.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.path || "/"}
                      className="group inline-flex items-center gap-2 text-sm md:text-[15px] text-muted font-semibold capitalize
                      transition-all duration-300 hover:text-primary focus:outline-none"
                    >
                      <span className="relative">
                        {item.title}
                        {/* elegant underline */}
                        <span
                          className="absolute -bottom-1 left-0 h-[2px] w-0 rounded-full
                          bg-gradient-to-r from-primary/30 via-primary to-primary/30
                          transition-all duration-300 group-hover:w-full"
                        />
                      </span>

                      {/* subtle arrow */}
                      <span className="opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-primary">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Social */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.55,
                delay: 0.16,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true, margin: "-80px" }}
              className="flex flex-col items-center md:items-start"
            >
              <h4 className="text-sm md:text-base font-extrabold text-text uppercase tracking-[0.22em] mb-5">
                Connect
              </h4>

              {/* Wrap icons in a premium container */}
              <div
                className="relative flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5
                px-4 py-3 backdrop-blur-md shadow-[0_0_0_1px_rgba(59,130,246,0.10)]"
              >
                <div className="pointer-events-none absolute -inset-2 rounded-3xl bg-primary/10 blur-2xl opacity-40" />

                {contactsLinks.map((link) => (
                  <div key={link.id} className="relative">
                    {/* glow on hover */}
                    <span className="pointer-events-none absolute -inset-2 rounded-full bg-primary/20 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <SocialItem
                      path={link.link}
                      title={link.title}
                      Icon={link.icon}
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Resume */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.55,
                delay: 0.24,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true, margin: "-80px" }}
              className="flex flex-col items-center md:items-start"
            >
              <h4 className="text-sm md:text-base font-extrabold text-text uppercase tracking-[0.22em] mb-5">
                Resume
              </h4>

              <p className="text-xs md:text-sm text-muted/90 mb-5 text-center md:text-left leading-relaxed">
                Download my CV to learn more about my experience and skills.
              </p>

              {/* Button container for premium feel */}
              <div className="w-full max-w-[220px]">
                <MainBtn
                  title="Download CV"
                  handleClickEvent={handleDownload}
                />
              </div>

              {/* small hint */}
              <p className="mt-3 text-[11px] text-muted/70 text-center md:text-left">
                PDF • Updated {currentYear}
              </p>
            </motion.div>
          </div>

          {/* Bottom */}
          <div className="relative">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/25 to-transparent" />

            <div className="py-7 flex flex-col md:flex-row items-center justify-between gap-3">
              <p className="text-xs md:text-sm text-muted text-center md:text-left">
                © {currentYear} Ahmad Marzouk. All rights reserved.
              </p>

              <p className="text-xs md:text-sm text-muted text-center md:text-right">
                Built with{" "}
                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-20">
                  Next.js
                </span>{" "}
                &{" "}
                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-20">
                  React
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
