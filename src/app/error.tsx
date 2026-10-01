"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <h1 className="font-display text-5xl tracking-tight">This page paused.</h1>
      <p className="mt-4 text-lg text-muted">Something interrupted the record. You can try the page again.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex min-h-11 cursor-pointer items-center rounded-full bg-pine px-5 text-paper"
      >
        Try again
      </button>
    </div>
  );
}
