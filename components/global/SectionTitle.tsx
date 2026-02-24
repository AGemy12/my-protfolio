import React from "react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}

export default function SectionTitle({
  title,
  subtitle,
  align = "center",
}: SectionTitleProps) {
  const isCenter = align === "center";

  return (
    <div
      className={`relative mb-16 lg:mb-24 ${isCenter ? "text-center" : "text-left"}`}
    >
      {/* Soft glow behind title */}
      <div
        className={`pointer-events-none absolute -top-10 ${isCenter ? "left-1/2 -translate-x-1/2" : "left-0"} 
        h-24 w-72 rounded-full bg-primary/20 blur-3xl`}
      />

      {/* Big background word */}
      <h1
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 -top-6 sm:-top-10 select-none 
        ${isCenter ? "text-center" : "text-left"}
        text-[56px] sm:text-[110px] md:text-[150px] lg:text-[190px] xl:text-[230px]
        font-extrabold uppercase tracking-[0.25em]
        text-transparent opacity-10
        [-webkit-text-stroke:1px_rgba(148,163,184,0.35)]`}
      >
        {title}
      </h1>

      {/* Main title */}
      <div
        className={`relative inline-flex flex-col ${isCenter ? "items-center" : "items-start"}`}
      >
        <h3
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-[0.18em]
          bg-gradient-to-r from-primary via-primary/70 to-primary-20 bg-clip-text text-transparent"
        >
          {title}
        </h3>

        {/* underline */}
        <div className="mt-4 h-[3px] w-16 rounded-full bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

        {/* subtitle */}
        {subtitle && (
          <p className="mt-4 max-w-xl text-sm sm:text-base text-muted-foreground/80 tracking-wide">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
