import type { Metadata } from "next";
import { SuggestForm } from "@/components/suggest-form";

export const metadata: Metadata = {
  title: "Suggest someone",
  description:
    "Send editors a private suggestion for the Shukran TZ living tribute. The note stays on the desk.",
  alternates: { canonical: "/suggest" },
};

export default function SuggestPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 md:py-16">
      <p className="text-xs uppercase tracking-[0.18em] text-pine">A private tip</p>
      <h1 className="mt-3 font-display text-5xl leading-none tracking-tight sm:text-6xl">
        Suggest someone
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-muted">
        Tell the editors about a person and the work they have done. The note is for the desk. It
        does not appear on the site, and it is not placed beside other names.
      </p>
      <div className="mt-10">
        <SuggestForm />
      </div>
    </div>
  );
}
