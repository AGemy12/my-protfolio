import { ElementType } from "react";

interface SimpleBtnProps {
  title: string;
  type?: "button" | "submit" | "reset";
  customStyle?: string;
  hasIcon?: boolean;
  Icon?: ElementType;
  handleClickEvent?: () => void;
}

export default function SimpleBtn({
  title,
  type = "button",
  hasIcon,
  Icon,
  customStyle,
  handleClickEvent,
}: SimpleBtnProps) {
  return (
    <button
      type={type}
      className={`flex items-center justify-center gap-2 rounded-md border-[1px] border-primary bg-primary-50 min-w-[120px] py-1 duration-300 hover:bg-primary ${customStyle} `}
      onClick={handleClickEvent}
    >
      <span className="text-text capitalize text-sm font-bold"> {title} </span>
      {hasIcon && Icon && <Icon className="text-xl text-text" />}
    </button>
  );
}
