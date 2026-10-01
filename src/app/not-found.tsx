import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <p className="text-xs uppercase tracking-[0.18em] text-pine">404</p>
      <h1 className="mt-3 font-display text-5xl tracking-tight">This page is not on the record.</h1>
      <p className="mt-4 max-w-xl text-lg text-muted">
        It may still be on the editors’ desk, or the address may have changed.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="inline-flex min-h-11 items-center rounded-full bg-pine px-5 text-paper">
          Home
        </Link>
        <Link
          href="/categories"
          className="inline-flex min-h-11 items-center rounded-full border border-line px-5"
        >
          Browse categories
        </Link>
      </div>
    </div>
  );
}
