"use client";
import { motion } from "motion/react";
import MainBtn from "@/components/buttons/MainBtn";
import AltBtn from "@/components/buttons/AltBtn";
import SocialLinks from "./SocialLinks";

export default function HeroDetails() {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/assets/media/cv/cv.pdf";
    link.download = "cv.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col gap-4 md:gap-8 justify-center w-11/12 mx-auto md:w-full"
    >
      <div className="">
        <span className="text-muted text-sm md:text-base font-bold capitalize">
          frontend web developer
        </span>
        <h1 className="text-text text-3xl md:text-5xl font-bold leading-tight mb-4">
          Hello, I’m
        </h1>
        <h2 className="text-primary text-3xl md:text-5xl font-bold leading-tight uppercase">
          ahmad marzouk
        </h2>
      </div>

      <p className=" text-muted text-sm md:text-base leading-8 text-justify max-w-11/12">
        I specialize in building seamless and responsive web interfaces,
        combining clean code with creative design to deliver outstanding user
        experiences.
      </p>
      <div className="flex items-center gap-4">
        <MainBtn title="download my cv" handleClickEvent={handleDownload} />
        <AltBtn
          title="contact me"
          isBtn={false}
          linkPath="https://web.whatsapp.com/send?phone=01149560988&text="
        />
      </div>
      <SocialLinks />
    </motion.div>
  );
}
