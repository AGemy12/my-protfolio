import { SkillIcon } from "@/components/icons";
import type { Skill } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * makkook.ai's partner strip, applied to the tech stack: an endless, linear
 * horizontal loop with faded edges that pauses on hover. Logos rest dimmed and
 * come to full strength (in the ember colour) under the pointer. The list is
 * rendered twice and the track slides by half its width, so the loop has no seam.
 */
export function SkillMarquee({
  skills,
  label,
  className,
}: {
  skills: Skill[];
  label: string;
  className?: string;
}) {
  if (skills.length < 3) return null;
  // makkook runs ~15 logos in 30s; keep a similar speed for any count.
  const duration = `${Math.max(20, skills.length * 2)}s`;

  const items = (copy: 0 | 1) =>
    skills.map((s) => (
      <li
        key={`${copy}-${s._id}`}
        aria-hidden={copy === 1 || undefined}
        className="group/item flex shrink-0 items-center gap-3 pr-14 text-muted-foreground opacity-70 transition duration-300 hover:text-heading hover:opacity-100"
      >
        <SkillIcon
          name={s.icon}
          className="size-8 transition-colors group-hover/item:text-brand sm:size-9"
        />
        <span className="text-lg font-medium whitespace-nowrap">{s.name}</span>
      </li>
    ));

  return (
    // id="skills" keeps old /#skills links landing on the stack.
    <section id="skills" aria-label={label} className={cn("w-full scroll-mt-28", className)}>
      <div dir="ltr" className="marquee-mask relative overflow-hidden py-2">
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
