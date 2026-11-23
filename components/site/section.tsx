import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

/** Small label above section titles: a short ember rule and the label. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("inline-flex items-center gap-2.5 text-sm font-medium text-brand", className)}>
      <span aria-hidden className="h-0.5 w-5 bg-brand" />
      {children}
    </p>
  );
}

/**
 * Quiet "View all" link for section headers: a hairline underline that the
 * brand orange draws over from the reading start, and an arrow that nudges forward.
 */
export function SectionLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "group/link relative inline-flex shrink-0 items-center gap-2 pb-1 font-medium text-heading transition-colors duration-300 hover:text-brand focus-visible:text-brand",
        "before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-foreground/25",
        "after:absolute after:start-0 after:bottom-0 after:h-px after:w-0 after:bg-brand after:transition-[width] after:duration-500 after:ease-[cubic-bezier(0.16,1,0.3,1)] hover:after:w-full focus-visible:after:w-full",
      )}
    >
      {children}
      <ArrowRight
        aria-hidden
        className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:translate-x-1 rtl:-scale-x-100 rtl:group-hover/link:-translate-x-1"
      />
    </Link>
  );
}

/**
 * Section shell. The header is one balanced line — eyebrow and title at the
 * start, the optional action at the end on the same bottom edge — closed by a
 * hairline, so the header and the content share both edges of the container.
 */
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
      className={cn("mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-24", className)}
    >
      <Reveal className="mb-10 border-b pb-7 md:mb-12">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <div className="min-w-0">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2
              id={`${id}-title`}
              className="mt-3 text-3xl leading-[1.2] font-bold text-balance sm:text-4xl lg:text-[2.6rem] ltr:tracking-tight rtl:leading-[1.4]"
            >
              {title}
            </h2>
            {description && (
              <p className="mt-3 max-w-md text-base leading-relaxed text-pretty text-muted-foreground">{description}</p>
            )}
          </div>
          {action}
        </div>
      </Reveal>
      {children}
    </section>
  );
}
