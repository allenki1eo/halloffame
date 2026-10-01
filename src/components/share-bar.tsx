"use client";

import { useState } from "react";
import type { Messages } from "@/lib/messages";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ShareBarProps = {
  name: string;
  oneLiner: string;
  path: string;
  copy: Messages;
};

export function ShareBar({ name, oneLiner, path, copy }: ShareBarProps) {
  const [notice, setNotice] = useState("");
  const [open, setOpen] = useState(false);

  function pageUrl() {
    return `${window.location.origin}${path}`;
  }

  function shareText() {
    return `${name} — ${oneLiner}`;
  }

  async function shareFromDevice() {
    const url = pageUrl();
    if (!navigator.share) {
      setNotice(copy.shareDeviceMissing);
      return;
    }
    try {
      await navigator.share({ title: name, text: shareText(), url });
      setOpen(false);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setNotice(copy.shareSheetFailed);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(pageUrl());
      setNotice(copy.shareCopied);
    } catch {
      setNotice(copy.shareCopyFailed);
    }
  }

  function openShare(href: string) {
    window.open(href, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="no-print">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="lg">{copy.passOn}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-3xl font-normal">{copy.passOn}</DialogTitle>
            <DialogDescription>{copy.shareIntro.replace("{name}", name)}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Button type="button" variant="secondary" data-track="share" data-track-target="device" onClick={shareFromDevice}>
              {copy.shareDevice}
            </Button>
            <Button type="button" variant="outline" data-track="share" data-track-target="copy" onClick={copyLink}>
              {copy.shareCopy}
            </Button>
            <Button
              type="button"
              variant="outline"
              data-track="share"
              data-track-target="whatsapp"
              onClick={() => openShare(`https://wa.me/?text=${encodeURIComponent(`${shareText()} ${pageUrl()}`)}`)}
            >
              {copy.shareWhatsapp}
            </Button>
            <Button
              type="button"
              variant="outline"
              data-track="share"
              data-track-target="x"
              onClick={() =>
                openShare(
                  `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText())}&url=${encodeURIComponent(pageUrl())}`,
                )
              }
            >
              X
            </Button>
            <Button
              type="button"
              variant="outline"
              data-track="share"
              data-track-target="email"
              onClick={() => {
                window.location.href = `mailto:?subject=${encodeURIComponent(name)}&body=${encodeURIComponent(`${shareText()}\n\n${pageUrl()}`)}`;
              }}
            >
              {copy.shareEmail}
            </Button>
          </div>
          <p aria-live="polite" className="min-h-6 text-sm text-muted-foreground">
            {notice}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
