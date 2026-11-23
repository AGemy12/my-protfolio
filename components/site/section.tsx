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
      <Reveal className="mb-10 grid items-end gap-x-12 gap-y-4 md:mb-12 md:grid-cols-2">
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2
            id={`${id}-title`}
            className="mt-3 text-3xl leading-[1.2] font-bold text-balance sm:text-4xl lg:text-[2.6rem] ltr:tracking-tight rtl:leading-[1.4]"
          >
            {title}
          </h2>
        </div>
        {(description || action) && (
          <div className="flex flex-col items-start gap-5">
            {description && (
              <p className="max-w-md text-base leading-relaxed text-pretty text-muted-foreground">{description}</p>
            )}
            {action}
          </div>
        )}
      </Reveal>
      {children}
    </section>
  );
}
