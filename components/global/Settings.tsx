"use client";
import { useEffect, useRef } from "react";

import { AiOutlineClose } from "react-icons/ai";
import CollectionOfBtns from "./CollectionOfBtns";
import {
  IoDesktopOutline,
  IoMoonOutline,
  IoSunnyOutline,
} from "react-icons/io5";

import { useTheme } from "@/contexts/ThemeContext";

interface SettingsProps {
  openSettings: boolean;
  onClose: () => void;
}

export default function Settings({ openSettings, onClose }: SettingsProps) {
  const { theme, toggleTheme } = useTheme();
  const settingsRef = useRef<HTMLDivElement>(null);

  const toggleModeBtns = [
    {
      id: 1,
      title: "light",
      Icon: IoSunnyOutline,
      handleClickEvent: () => {
        toggleTheme("light");
        onClose();
      },
      isActive: theme === "light",
    },
    {
      id: 2,
      title: "system",
      Icon: IoDesktopOutline,
      handleClickEvent: () => {
        toggleTheme("system");
        onClose();
      },
      isActive: theme === "system",
    },
    {
      id: 3,
      title: "dark",
      Icon: IoMoonOutline,
      handleClickEvent: () => {
        toggleTheme("dark");
        onClose();
      },
      isActive: theme === "dark",
    },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (openSettings) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openSettings, onClose]);

  return (
    <div
      className={`fixed top-0 right-0 w-full h-screen bg-black/70 z-999 transition-opacity duration-300 ${
        openSettings
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`fixed top-0 right-0 h-screen w-[350px] bg-main-bg shadow-xl z-[50] transition-transform duration-300 ${
          openSettings ? "translate-x-0" : "translate-x-full"
        }`}
        ref={settingsRef}
      >
        {" "}
        <div className="p-4 flex justify-between items-center border-b-[1px] border-b-border">
          <b className="text-text">Settings</b>
          <button onClick={onClose}>
            <AiOutlineClose className="text-primary" />
          </button>
        </div>
        <div className="p-4 flex flex-col gap-8">
          <CollectionOfBtns collectionTitle="mode" btns={toggleModeBtns} />
        </div>
      </div>
    </div>
  );
}
