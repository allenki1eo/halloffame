import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { DeskEditor } from "@/components/desk-editor";
import { isAdmin } from "@/lib/admin-auth";
import { getProfile } from "@/lib/content";
import { databaseFailure, deskErrorMessage } from "@/lib/desk-error";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit page",
  robots: { index: false, follow: false },
};

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function EditPersonPage({ params, searchParams }: PageProps) {
  if (!(await isAdmin())) redirect("/admin");
  const { slug } = await params;
  const query = await searchParams;
  let profile = null;
  let databaseMessage = "";
  try {
    profile = await getProfile(slug);
  } catch (error) {
    if (!databaseFailure(error)) throw error;
    databaseMessage = deskErrorMessage(error);
  }
  if (databaseMessage) return <DeskEditor error={query.error || databaseMessage} />;
  if (!profile) notFound();
  return <DeskEditor profile={profile} error={query.error} saved={query.saved} />;
}
