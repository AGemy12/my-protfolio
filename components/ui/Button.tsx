import { ArrowIcon, DownloadIcon } from "@/components/ui/Icons";

type ButtonProps = {
  href?: string;
  variant?: "primary" | "secondary";
  size?: "md" | "sm";
  icon?: "arrow" | "download";
  download?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

const base =
  "group inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border font-medium transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60";

const variants = {
  primary: "border-transparent bg-fg text-bg hover:bg-accent hover:text-on-accent",
  secondary: "border-line bg-surface text-fg hover:border-fg",
};

const sizes = {
  md: "px-[22px] py-3 text-[15px]",
  sm: "px-[18px] py-[9px] text-[14px]",
};

export default function Button({
  href,
  variant = "primary",
  size = "md",
  icon,
  download,
  type = "button",
  disabled,
  className = "",
  children,
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  const content = (
    <>
      {icon === "download" && <DownloadIcon />}
      <span>{children}</span>
      {icon === "arrow" && (
        <ArrowIcon className="transition-[translate] duration-300 ease-calm group-hover:translate-x-[3px] rtl:group-hover:-translate-x-[3px]" />
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} download={download || undefined} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} disabled={disabled} className={classes}>
      {content}
    </button>
  );
}
