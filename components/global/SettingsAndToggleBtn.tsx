"use client";
import React, { useState } from "react";
import SettingsBtn from "../buttons/SettingsBtn";
import Settings from "./Settings";

export default function SettingsAndToggleBtn() {
  const [openSettings, setOpenSettings] = useState(false);

  return (
    <>
      <SettingsBtn onClick={() => setOpenSettings(true)} />
      <Settings
        openSettings={openSettings}
        onClose={() => setOpenSettings(false)}
      />
    </>
  );
}
