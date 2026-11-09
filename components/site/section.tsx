import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

/**
 * Small label above section titles. Letter-spacing / uppercase / mono only
 * apply to LTR text — tracking breaks Arabic letter joining.
 */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-soft py-1 ps-2.5 pe-3.5 text-xs font-medium text-brand",
        "ltr:font-mono ltr:tracking-[0.16em] ltr:uppercase rtl:text-sm",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-brand ring-3 ring-brand/20" />
      {children}
    </p>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  action,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28", className)}
    >
      <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-14">
        <div className="max-w-2xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2
            id={`${id}-title`}
            className="mt-5 text-3xl leading-[1.15] font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] rtl:leading-[1.35] rtl:tracking-normal"
          >
            {title}
          </h2>
          {description && (
            <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
              {description}
            </p>
          )}
        </div>
        {action}
      </Reveal>
      {children}
    </section>
  );
}
