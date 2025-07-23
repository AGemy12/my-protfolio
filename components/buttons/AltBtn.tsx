import Link from "next/link";
import React from "react";

interface AltBtnProps {
  title: string;
  isBtn?: boolean;
  linkPath?: string;
  handleClickEvent?: () => void;
}

export default function AltBtn({
  title,
  isBtn = true,
  linkPath,
  handleClickEvent,
}: AltBtnProps) {
  return (
    <>
      {isBtn ? (
        <button
          className="flex items-center justify-center py-[10px] px-[20px] bg-primary-10 text-text text-sm font-bold capitalize duration-300 hover:text-primary hover:bg-primary-20 border-[2px] border-primary-20 rounded-sm h-[40px]"
          onClick={handleClickEvent}
        >
          {title}
        </button>
      ) : (
        <Link
          className="flex items-center justify-center py-[10px] px-[20px] bg-primary-10 text-text text-sm font-bold capitalize duration-300 hover:text-primary hover:bg-primary-20 border-[2px] border-primary-20 rounded-sm h-[40px]"
          href={linkPath ? linkPath : "#"}
          target="_blank"
        >
          {title}
        </Link>
      )}
    </>
  );
}
