"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
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
      aria-label={`Copy ${text}`}
      className="flex-none rounded-full border border-line px-3.5 py-1.5 text-[13.5px] text-muted transition-colors duration-200 hover:border-fg hover:text-fg"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
