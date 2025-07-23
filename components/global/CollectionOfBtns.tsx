"use client";

import { ElementType } from "react";

interface BtnTypes {
  id: number;
  title: string;
  handleClickEvent: () => void;
  Icon?: ElementType;
  isActive?: boolean;
}

interface CollectionOfBtnsProps {
  collectionTitle: string;
  btns: BtnTypes[];
}

export default function CollectionOfBtns({
  collectionTitle,
  btns,
}: CollectionOfBtnsProps) {
  const firstBtnId = btns[0]?.id;
  const lastBtnId = btns[btns.length - 1]?.id;

  return (
    <div className="">
      <span className="text-xs font-bold uppercase text-text block mb-2">
        {collectionTitle}
      </span>
      <div className="flex items-center w-full">
        {btns.map((btn) => (
          <button
            key={btn.id}
            onClick={btn.handleClickEvent}
            className={` text-sm text-text font-bold p-3 min-w-[100px]  capitalize border-[1px] border-border flex items-center justify-center gap-2 duration-300 hover:bg-light-hover 
              ${btn.id === firstBtnId ? "rounded-l-md" : ""} ${
              btn.id === lastBtnId ? "rounded-r-md" : ""
            }
            ${
              btn.id !== firstBtnId && btn.id !== lastBtnId && btn.isActive
                ? "border-x-[1px]"
                : ""
            }
              ${
                btn.id !== firstBtnId && btn.id !== lastBtnId
                  ? "rounded-none border-x-0"
                  : ""
              }
              ${btns.length < 2 ? "rounded-md" : ""}
              ${
                btn.isActive
                  ? "!text-primary border-primary  bg-primary-10 hover:bg-primary-20"
                  : "text-muted hover:bg-light-bg-hover"
              }
            `}
          >
            {btn.Icon ? <btn.Icon className="text-xl" /> : null}
            {btn.title}
          </button>
        ))}
      </div>
    </div>
  );
}
