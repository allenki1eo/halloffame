import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24">
      <p className="text-xs uppercase tracking-[0.2em] text-primary">404</p>
      <h1 className="mt-4 font-display text-5xl tracking-tight sm:text-6xl">This page is not on the record.</h1>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground">
        It may still be on the editors’ desk, or the address may have changed.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/">Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/categories">Browse categories</Link>
        </Button>
      </div>
    </div>
  );
}
