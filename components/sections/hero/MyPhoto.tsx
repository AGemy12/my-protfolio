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
      transition={{ duration: 1, ease: [0.25, 0.8, 0.25, 1] }}
      className="relative"
    >
      <div className="relative">
        <div
          className="p-1 w-full rounded-2xl transition-all duration-500"
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
          <div className="bg-main-bg rounded-xl overflow-hidden">
            <Image
              src="/assets/media/my-photo.png"
              alt="Ahmad Marzouk - Frontend Developer"
              width={600}
              height={600}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>

        {/* Decorative Patterns */}
        <div className="absolute top-1/4 left-0 w-32 md:w-40 opacity-60 pointer-events-none">
          <Image
            src="/assets/media/hero/pattern-1.svg"
            alt=""
            width={160}
            height={160}
            sizes="160px"
            className="w-full animation-frames-one"
            aria-hidden="true"
          />
        </div>
        <div className="absolute top-[18%] right-[15%] w-24 md:w-32 hero-thumbs-animation opacity-60 pointer-events-none">
          <Image
            src="/assets/media/hero/pattern-2.svg"
            alt=""
            width={128}
            height={128}
            sizes="128px"
            className="w-full hero-rotate"
            aria-hidden="true"
          />
        </div>
        <div className="absolute bottom-[4%] left-[9%] w-24 md:w-32 hero-thumbs-animation opacity-60 pointer-events-none">
          <Image
            src="/assets/media/hero/pattern-3.svg"
            alt=""
            width={128}
            height={128}
            sizes="128px"
            className="w-full hero-rotate"
            aria-hidden="true"
          />
        </div>
        <div className="absolute bottom-[37%] right-[4%] w-20 md:w-28 hero-weggle opacity-60 pointer-events-none">
          <Image
            src="/assets/media/hero/pattern-4.svg"
            alt=""
            width={112}
            height={112}
            sizes="112px"
            className="w-full hero-rotate"
            aria-hidden="true"
          />
        </div>
      </div>
    </motion.div>
  );
}
