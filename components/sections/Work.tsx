import Image from "next/image";
import Section from "@/components/ui/Section";
import { privateWork, projects } from "@/data/portfolio";

export default function Work() {
  return (
    <Section id="work" label="Selected work" title="A few projects I've delivered.">
      <div className="mt-11 grid gap-11 md:grid-cols-2 md:gap-x-10 md:gap-y-14">
        {projects.map((project) => (
          <a
            key={project.title}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group grid gap-4"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] border border-line bg-panel">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover object-top transition-transform duration-[1100ms] ease-calm group-hover:scale-[1.025]"
              />
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-[1.55rem]">{project.title}</h3>
              <span className="whitespace-nowrap text-sm text-muted transition-colors duration-200 group-hover:text-accent">
                Visit ↗
              </span>
            </div>
            <p className="-mt-1.5 text-[15.5px] text-muted">{project.description}</p>
            <span className="text-[13.5px] text-faint">{project.stack.join(" · ")}</span>
          </a>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-panel px-6 py-[22px] text-[15px] text-muted">
        <span>
          <b className="font-medium text-fg">Private work:</b> {privateWork}
        </span>
        <span>Walkthrough available on request</span>
      </div>
    </Section>
  );
}
