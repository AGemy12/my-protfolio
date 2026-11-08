import Section from "@/components/ui/Section";
import { aboutDetails } from "@/data/portfolio";

export default function About() {
  return (
    <Section
      id="about"
      label="About"
      title="I care about the details that make software feel simple."
    >
      <div className="mt-7 grid max-w-[38em] gap-[18px] text-muted">
        <p className="text-fg">
          I work across the whole product: the database, the API behind it,
          and the interface people use every day. Owning each layer keeps the
          product consistent and easier to change.
        </p>
        <p>
          Most of my work is with companies and founders who need someone to
          turn their requirements into a finished, dependable product. I write
          clean, reusable code, and I pay close attention to performance and
          search visibility.
        </p>
      </div>

      <dl className="mt-10 grid gap-4 border-t border-line pt-7 sm:grid-cols-3 sm:gap-6">
        {aboutDetails.map((detail) => (
          <div key={detail.term}>
            <dt className="text-[13.5px] text-faint">{detail.term}</dt>
            <dd className="mt-1 text-[15.5px]">{detail.value}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
