"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24">
      <h1 className="font-display text-5xl tracking-tight">This page paused.</h1>
      <p className="mt-4 text-lg text-muted-foreground">Something interrupted the record. You can try the page again.</p>
      <Button type="button" onClick={reset} className="mt-8">
        Try again
      </Button>
    </div>
  );
}
