"use client";

import { useState } from "react";

type CopyButtonProps = {
  text: string;
  label?: string;
};

export default function CopyButton({ text, label = "Copy markdown" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="bg-black text-white font-medium py-2 px-4 rounded-xl hover:bg-orange transition-colors"
    >
      {copied ? "Copied" : label}
    </button>
  );
}
