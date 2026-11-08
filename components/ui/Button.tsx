import Link from "next/link";

type ButtonProps = {
  href?: string;
  variant?: "main" | "quiet";
  size?: "md" | "sm";
  arrow?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

const base =
  "group inline-flex items-center gap-2.5 rounded-full border font-medium transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60";

const variants = {
  main: "border-transparent bg-accent text-on-accent hover:bg-[color-mix(in_srgb,var(--accent)_86%,var(--fg))]",
  quiet: "border-line bg-transparent text-fg hover:border-fg",
};

const sizes = {
  md: "px-6 py-[13px] text-[15.5px]",
  sm: "px-[18px] py-[9px] text-[14.5px]",
};

export default function Button({
  href,
  variant = "main",
  size = "md",
  arrow = false,
  type = "button",
  disabled,
  className = "",
  children,
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  const content = (
    <>
      {children}
      {arrow && (
        <span
          aria-hidden="true"
          className="transition-transform duration-300 ease-calm group-hover:translate-x-[3px]"
        >
          →
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} className={classes}>
      {content}
    </button>
  );
}
