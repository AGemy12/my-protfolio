import React, { ElementType } from "react";
import Tooltip from "@/components/helpers/ToolTip";
import Link from "next/link";

interface SocialItemProps {
  title: string;
  path: string;
  Icon?: ElementType;
}

export default function SocialItem({ title, path, Icon }: SocialItemProps) {
  return (
    <Tooltip content={title}>
      <li className="marker:hidden">
        <Link
          href={path && path}
          target="_blank"
          className="flex items-center justify-center w-8 h-8 rounded-md border-primary-20 border-[1px] bg-primary-20 duration-300 hover:bg-primary hover:border-primary"
        >
          {Icon && <Icon className="text-text text-xl" />}{" "}
        </Link>
      </li>
    </Tooltip>
  );
}
