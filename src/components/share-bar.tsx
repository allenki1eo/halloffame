"use client";

import { useState } from "react";
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
};

export function ShareBar({ name, oneLiner, path }: ShareBarProps) {
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
      setNotice("Use one of the options below.");
      return;
    }
    try {
      await navigator.share({ title: name, text: shareText(), url });
      setOpen(false);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setNotice("The device share sheet did not open. Use one of the options below.");
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(pageUrl());
      setNotice("Link copied.");
    } catch {
      setNotice("Copy the address from the browser bar.");
    }
  }

  function openShare(href: string) {
    window.open(href, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="no-print">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="lg">Pass this page on</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-3xl font-normal">Pass this page on</DialogTitle>
            <DialogDescription>
              Share {name} with someone who should read the work. The link opens this tribute.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Button type="button" variant="secondary" onClick={shareFromDevice}>
              Share from this device
            </Button>
            <Button type="button" variant="outline" onClick={copyLink}>
              Copy link
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => openShare(`https://wa.me/?text=${encodeURIComponent(`${shareText()} ${pageUrl()}`)}`)}
            >
              WhatsApp
            </Button>
            <Button
              type="button"
              variant="outline"
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
              onClick={() => {
                window.location.href = `mailto:?subject=${encodeURIComponent(name)}&body=${encodeURIComponent(`${shareText()}\n\n${pageUrl()}`)}`;
              }}
            >
              Email
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
