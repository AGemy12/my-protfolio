import Section from "@/components/ui/Section";
import { services } from "@/data/portfolio";

export default function Services() {
  return (
    <Section id="services" label="Services" title="What I can build for you.">
      <div className="mt-10 grid sm:grid-cols-2 sm:gap-x-12">
        {services.map((service) => (
          <div key={service.title} className="border-t border-line pb-[30px] pt-[26px]">
            <h3 className="text-[1.5rem]">{service.title}</h3>
            <p className="mt-2 max-w-[28em] text-[15.5px] text-muted">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
