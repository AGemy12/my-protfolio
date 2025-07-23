"use client";
import { useRef } from "react";
import { motion } from "motion/react";
import Image from "next/image";
export default function MyPhoto() {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const { left, top } = card.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
      className=""
    >
      <div className="relative">
        <div
          className="p-1 w-11/12 mx-auto md:w-full rounded-lg"
          ref={cardRef}
          onMouseMove={handleMouseMove}
          style={{
            background: `
              radial-gradient(
                600px circle at var(--x, 50%) var(--y, 50%),
                var(--color-primary),
                transparent 60%
              )
            `,
          }}
        >
          <div className="bg-main-bg">
            <Image
              src="/assets/media/my-photo.png"
              alt="Hero Image"
              width={400}
              height={400}
              className="w-full"
            />
          </div>
        </div>
        <div className="absolute top-2/6 left-0">
          <Image
            src="/assets/media/hero/pattern-1.svg"
            alt="Hero Image"
            width={500}
            height={500}
            className="w-full animation-frames-one"
          />
        </div>
        <div className="absolute top-[18%] right-[15%] hero-thumbs-animation">
          <Image
            src="/assets/media/hero/pattern-2.svg"
            alt="Hero Image"
            width={500}
            height={500}
            className="w-full hero-rotate"
          />
        </div>
        <div className="absolute bottom-[4%] left-[9%] hero-thumbs-animation">
          <Image
            src="/assets/media/hero/pattern-3.svg"
            alt="Hero Image"
            width={500}
            height={500}
            className="w-full hero-rotate"
          />
        </div>
        <div className="absolute bottom-[37%] right-[4%] hero-weggle">
          <Image
            src="/assets/media/hero/pattern-4.svg"
            alt="Hero Image"
            width={500}
            height={500}
            className="w-full hero-rotate"
          />
        </div>
      </div>
    </motion.div>
  );
}
