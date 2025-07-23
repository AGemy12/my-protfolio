import React from "react";
import SocialItem from "./SocialItem";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { IoLogoVercel } from "react-icons/io5";
import { IoLogoWhatsapp } from "react-icons/io";

export default function SocialLinks() {
  return (
    <ul className="flex items-center gap-4">
      <SocialItem
        title="Github"
        path="https://github.com/AGemy12"
        Icon={FaGithub}
      />
      <SocialItem
        title="Vercel"
        path="https://vercel.com/agemy12s-projects"
        Icon={IoLogoVercel}
      />
      <SocialItem
        title="Vercel"
        path="https://www.linkedin.com/in/ahmad-marzouk-9430b1233/"
        Icon={FaLinkedinIn}
      />
      <SocialItem
        title="Whatsapp"
        path="https://web.whatsapp.com/send?phone=01149560988&text="
        Icon={IoLogoWhatsapp}
      />
    </ul>
  );
}
