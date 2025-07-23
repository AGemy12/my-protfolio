import { projects } from "@/utility/static-data/FixedLists";
import SectionTitle from "../global/SectionTitle";
import ProjectsItem from "../sections/projects/ProjectsItem";

export default function Projects() {
  return (
    <div className="container mx-auto md:w-full w-11/12 py-12" id="projects">
      <SectionTitle title="My Projects" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {projects.map((project) => (
          <ProjectsItem
            key={project.id}
            {...project}
            techList={project.techList}
          />
        ))}
      </div>
    </div>
  );
}
