import { getLocale } from "next-intl/server";
import { tr, type Project } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * makkook.ai's partner strip, applied to shipped projects: an endless, linear
 * horizontal loop with faded edges that pauses on hover. Items rest dimmed and
 * come to full strength under the pointer. The list is rendered twice and the
 * track slides by half its width, so the loop has no seam.
 */
export async function ProjectMarquee({
  projects,
  label,
  className,
}: {
  projects: Project[];
  label: string;
  className?: string;
}) {
  const locale = await getLocale();
  const names = projects.map((p) => ({ id: p._id, name: tr(p.title, locale), year: p.year }));
  if (names.length < 3) return null;
  // makkook runs ~15 logos in 30s; keep a similar speed for any count.
  const duration = `${Math.max(20, names.length * 3.5)}s`;

  const items = (copy: 0 | 1) =>
    names.map((n) => (
      <li
        key={`${copy}-${n.id}`}
        aria-hidden={copy === 1 || undefined}
        dir="auto"
        className="group/item flex shrink-0 items-baseline gap-2.5 pr-16 opacity-55 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
      >
        <span
          className="text-xl font-semibold whitespace-nowrap text-heading transition-colors group-hover/item:text-brand sm:text-2xl"
        >
          {n.name}
        </span>
        {n.year ? <span className="font-mono text-[11px] text-muted-foreground">{n.year}</span> : null}
      </li>
    ));

  return (
    <section aria-label={label} className={cn("w-full", className)}>
      <p className="mb-5 text-xs text-muted-foreground ltr:font-mono ltr:tracking-[0.18em] ltr:uppercase">{label}</p>
      {/* LTR so the loop geometry is the same in both locales; each name keeps its own direction.
          Spacing is padding on each item (not `gap`) so both halves are exactly equal and the loop has no jump. */}
      <div dir="ltr" className="marquee-mask relative overflow-hidden py-1">
        <ul
          className="marquee-track flex w-max items-center"
          style={{ "--marquee-duration": duration } as React.CSSProperties}
        >
          {items(0)}
          {items(1)}
        </ul>
      </div>
    </section>
  );
}
