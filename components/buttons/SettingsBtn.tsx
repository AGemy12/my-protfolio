import React from "react";
import Tooltip from "../helpers/ToolTip";
import { IoMdSettings } from "react-icons/io";

interface SettingsBtnProps {
  onClick: () => void;
}

export default function SettingsBtn({ onClick }: SettingsBtnProps) {
  return (
    <div className="fixed top-4 right-4 z-10">
      <Tooltip content="Settings">
        <button
          className="w-9 h-9 bg-white dark:bg-primary-10 dark:hover:bg-primary-20 border-[1px] border-primary-20  rounded-md flex items-center justify-center"
          onClick={onClick}
        >
          <IoMdSettings className="text-xl text-text" />
        </button>
      </Tooltip>
    </div>
  );
}
