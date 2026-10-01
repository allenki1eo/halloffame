import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DeskEditor } from "@/components/desk-editor";
import { isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New page",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewPersonPage({ searchParams }: PageProps) {
  if (!(await isAdmin())) redirect("/admin");
  const query = await searchParams;
  return <DeskEditor error={query.error} />;
}
