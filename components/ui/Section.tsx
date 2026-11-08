type SectionProps = {
  id: string;
  label: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
};

/**
 * Shared section layout: a small sticky label on the left and the
 * content on the right, so every section keeps the same rhythm.
 */
export default function Section({
  id,
  label,
  title,
  intro,
  children,
}: SectionProps) {
  return (
    <section id={id} className="border-t border-line py-[72px] md:py-24">
      <div className="mx-auto grid max-w-[1120px] gap-4 px-[18px] sm:px-6 md:grid-cols-[220px_minmax(0,1fr)] md:gap-12">
        <div className="md:pt-2.5">
          <span className="block text-[13px] font-medium uppercase tracking-[0.08em] text-faint md:sticky md:top-[100px]">
            {label}
          </span>
        </div>
        <div className="min-w-0">
          <h2 className="max-w-[20em] text-[clamp(1.95rem,3.4vw,2.7rem)]">
            {title}
          </h2>
          {intro && <p className="mt-3.5 max-w-[36em] text-muted">{intro}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
