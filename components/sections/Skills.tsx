import Section from "@/components/ui/Section";
import { skills } from "@/data/portfolio";

export default function Skills() {
  return (
    <Section id="skills" label="Skills" title="Tools I use every day.">
      <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4">
        {skills.map((group) => (
          <div key={group.group}>
            <h3 className="border-b border-line pb-3 font-sans text-[15px] font-medium tracking-normal">
              {group.group}
            </h3>
            <ul className="mt-3.5 grid gap-2 text-[15.5px] text-muted">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
