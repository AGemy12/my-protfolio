export const container = "mx-auto w-full max-w-[1160px] px-5 sm:px-8";

export const eyebrow =
  "text-[12.5px] font-medium uppercase tracking-[0.1em] text-accent rtl:text-[14px] rtl:normal-case rtl:tracking-normal";

type SectionHeadingProps = {
  label: string;
  title: string;
  intro?: string;
  className?: string;
};

export function SectionHeading({ label, title, intro, className = "" }: SectionHeadingProps) {
  return (
    <div className={`grid max-w-[36em] gap-2.5 ${className}`}>
      <span className={eyebrow}>{label}</span>
      <h2 className="text-[clamp(1.85rem,3.4vw,2.6rem)]">{title}</h2>
      {intro && <p className="text-muted">{intro}</p>}
    </div>
  );
}

type SectionProps = SectionHeadingProps & {
  id: string;
  /** Tinted band, used on alternating sections. */
  band?: boolean;
  /** Optional link or control shown beside the heading. */
  action?: React.ReactNode;
  children: React.ReactNode;
};

/** Shared section layout: heading block on top, content below. */
export default function Section({ id, band, action, children, ...heading }: SectionProps) {
  return (
    <section
      id={id}
      className={`border-t border-line py-[clamp(64px,9vw,108px)] ${band ? "bg-surface" : ""}`}
    >
      <div className={container}>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5 md:mb-14">
          <SectionHeading {...heading} />
          {action}
        </div>
        {children}
      </div>
    </section>
  );
}
