import React from "react";

interface SectionTitleProps {
  title: string;
}

export default function SectionTitle({ title }: SectionTitleProps) {
  return (
    <div className="relative z-[1] mb-28 lg:mb-52">
      <h3 className="text-4xl sm:text-7xl  2xl:text-9xl text-primary font-bold uppercase tracking-widest">
        {title}
      </h3>
      <div className="relative ">
        <h1 className="absolute top-1/2 left-1/2 -translate-1/2 opacity-10 text-[55px] sm:text-[100px] md:text-[150px] lg:text-[200px] xl:text-[250px] 2xl:text-[220px] font-bold uppercase  2xl:leading-[250px] z-[-1] whitespace-nowrap text-5xl md:text-6xl lg:text-9xl text-transparent [-webkit-text-stroke:2px_var(--color-text)] dark:[-webkit-text-stroke:2px_var(--color-primary)] ">
          {title}
        </h1>
        <h1 className="absolute top-1/2 left-1/2 -translate-1/2 text-primary dark:text-primary-20 opacity-10 text-[55px] sm:text-[100px] md:text-[150px] lg:text-[200px] xl:text-[250px] 2xl:text-[220px] font-bold uppercase 2xl:leading-[250px] z-[-1] whitespace-nowrap  text-5xl md:text-6xl lg:text-9xl  animate-waveFill">
          {title}
        </h1>
      </div>
    </div>
  );
}
