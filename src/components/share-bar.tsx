"use client";

import { useState } from "react";

type ShareBarProps = {
  name: string;
  oneLiner: string;
  path: string;
};

const buttonClass =
  "inline-flex min-h-11 cursor-pointer items-center rounded-full border border-line bg-paper-raised px-4 text-sm hover:border-pine";

export function ShareBar({ name, oneLiner, path }: ShareBarProps) {
  const [notice, setNotice] = useState("");

  function pageUrl() {
    return `${window.location.origin}${path}`;
  }

  function openShare(href: string) {
    window.open(href, "_blank", "noopener,noreferrer");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(pageUrl());
      setNotice("Link copied.");
    } catch {
      setNotice("Copy the address from the browser bar.");
    }
  }

  function shareText() {
    return `${name} — ${oneLiner}`;
  }

  return (
    <div className="no-print">
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={copyLink} className={buttonClass}>
          Copy link
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => openShare(`https://wa.me/?text=${encodeURIComponent(`${shareText()} ${pageUrl()}`)}`)}
        >
          WhatsApp
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() =>
            openShare(
              `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText())}&url=${encodeURIComponent(pageUrl())}`,
            )
          }
        >
          X
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            window.location.href = `mailto:?subject=${encodeURIComponent(name)}&body=${encodeURIComponent(`${shareText()}\n\n${pageUrl()}`)}`;
          }}
        >
          Email
        </button>
      </div>
      <p aria-live="polite" className="mt-3 min-h-6 text-sm text-muted">
        {notice}
      </p>
    </div>
  );
}
