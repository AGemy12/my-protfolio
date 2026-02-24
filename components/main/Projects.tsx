import { projects } from "@/utility/static-data/FixedLists";
import SectionTitle from "../global/SectionTitle";
import ProjectsItem from "../sections/projects/ProjectsItem";

export default function Projects() {
  return (
    <section
      className="container mx-auto md:w-full w-11/12 py-16 md:py-24 lg:py-32 overflow-x-hidden"
      id="projects"
    >
      <SectionTitle title="My Projects" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mt-12 md:mt-16">
        {projects.map((project) => (
          <ProjectsItem
            key={project.id}
            {...project}
            techList={project.techList}
          />
        ))}
      </div>
    </section>
  );
}
