import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ProfileView } from "@/components/profile-view";
import { isAdmin } from "@/lib/admin-auth";
import { getProfile } from "@/lib/content";

export const metadata: Metadata = {
  title: "Desk preview",
  robots: { index: false, follow: false },
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PreviewPage({ params }: PageProps) {
  if (!(await isAdmin())) redirect("/admin");
  const { slug } = await params;
  const profile = getProfile(slug);
  if (!profile) notFound();

  return (
    <>
      <p className="border-b border-border bg-secondary px-5 py-3 text-center text-sm">
        <Link href="/admin" className="underline decoration-primary/40 underline-offset-4">
          Back to the desk
        </Link>
      </p>
      <ProfileView profile={profile} mode="preview" />
    </>
  );
}
