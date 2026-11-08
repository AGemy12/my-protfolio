"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckIcon, CopyIcon } from "@/components/ui/Icons";

export default function CopyButton({ text }: { text: string }) {
  const t = useTranslations("contact");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={t("copyLabel", { value: text })}
      className="inline-flex flex-none items-center gap-1.5 rounded-lg px-2 py-1 text-[13px] text-muted transition-colors duration-200 hover:bg-panel hover:text-fg"
    >
      {copied ? <CheckIcon className="text-success" /> : <CopyIcon />}
      <span role="status">{copied ? t("copied") : t("copy")}</span>
    </button>
  );
}
