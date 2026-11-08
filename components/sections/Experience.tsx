import Section from "@/components/ui/Section";
import { experience } from "@/data/portfolio";

export default function Experience() {
  return (
    <Section id="experience" label="Experience" title="Where I've worked.">
      <div className="mt-10 border-b border-line">
        {experience.map((role) => (
          <div
            key={role.title}
            className="grid gap-1.5 border-t border-line py-[30px] sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-8"
          >
            <span className="pt-1 text-[14.5px] text-muted tabular-nums">
              {role.period}
            </span>
            <div>
              <h3 className="text-[1.45rem]">{role.title}</h3>
              <p className="mt-0.5 text-[15px] text-muted">{role.org}</p>
              {role.points && (
                <ul className="mt-3.5 grid list-disc gap-1.5 pl-[18px] text-[15.5px] text-muted marker:text-faint">
                  {role.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}
              {role.projects && (
                <p className="mt-3.5 text-sm text-faint">
                  Projects: <span className="text-fg">{role.projects}</span>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
