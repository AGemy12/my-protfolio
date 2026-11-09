import { cn } from "@/lib/utils";

/**
 * "Stack A" mark: an A sliced into three layers — database, API and, on top
 * in the brand colour, the interface. The lower layers use `currentColor`, so
 * set the colour with a text-* class. Inside a `group`, the top layer lifts
 * slightly on hover.
 */
export function LogoMark({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn("size-9 shrink-0 overflow-visible", className)}
      {...props}
    >
      <polygon
        points="32,8 39,22 25,22"
        className="text-brand transition-transform duration-300 ease-out group-hover:-translate-y-0.5 motion-reduce:transition-none"
      />
      <polygon points="23,26.5 41,26.5 47.2,39 16.8,39" />
      <polygon points="14.6,43.5 49.4,43.5 55.6,56 40.5,56 32,47.5 23.5,56 8.4,56" />
    </svg>
  );
}
