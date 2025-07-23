"use client";
import { contactsLinks, links } from "@/utility/static-data/FixedLists";
import SocialItem from "../sections/hero/SocialItem";
import Link from "next/link";
import FooterHead from "../sections/footer/FooterHead";
import MainBtn from "../buttons/MainBtn";

export default function Footer() {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/assets/media/cv/cv.pdf";
    link.download = "cv.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="border-y-[1px] border-y-primary py-8 bg-primary-10">
      <div className="w-11/12 mx-auto md:w-full container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:gap-4 gap-12">
        <div className="group flex flex-col items-center">
          <FooterHead title="contacts links" />
          <div className="flex items-center gap-4">
            {contactsLinks.map((link) => (
              <SocialItem
                key={link.id}
                path={link.link}
                title={link.title}
                Icon={link.icon}
              />
            ))}
          </div>
        </div>
        <div className="group flex flex-col items-center">
          <FooterHead title="Ahmad Marzouk" />
          <span className="text-primary-50 text-base capitalize font-bold block mb-4">
            frontend <span className="text-text"> web developer</span>
          </span>
          <MainBtn title="download my cv" handleClickEvent={handleDownload} />
        </div>
        <div className="group flex flex-col items-center">
          <FooterHead title="Quick links" />

          <ul className="flex items-center gap-2">
            {links.map((link) => (
              <li key={link.id}>
                <Link
                  href={link.path && link.path}
                  className="text-text text-sm underline capitalize font-bold hover:text-primary duration-300"
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="group flex flex-col items-center">
          <FooterHead title="abstract " />
          <p className="text-muted text-sm capitalize font-bold text-justify">
            Frontend Developer skilled in React, Vue, Next.js & Nuxt.js —
            crafting fast, modern, and responsive web interfaces. Experienced
            with Tailwind CSS, Sass, and building scalable UI components.
          </p>
        </div>
      </div>
    </div>
  );
}
