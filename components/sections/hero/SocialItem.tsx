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
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 rounded-lg border-2 border-primary-20 bg-primary-10 hover:bg-primary hover:border-primary hover:shadow-light-shadow transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {Icon && (
            <Icon className="text-text text-lg md:text-xl transition-colors duration-300" />
          )}
        </Link>
      </li>
    </Tooltip>
  );
}
