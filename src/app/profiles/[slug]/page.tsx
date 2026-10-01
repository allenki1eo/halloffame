import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfileView } from "@/components/profile-view";
import { getCategory } from "@/lib/categories";
import { getPublishedProfile } from "@/lib/content";
import { absoluteUrl, mediaUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getPublishedProfile(slug);
  if (!profile) {
    return { title: "Not on the record", robots: { index: false, follow: false } };
  }
  const category = getCategory(profile.category);
  const description = `${profile.oneLiner} ${profile.role} in ${profile.place}.`;
  return {
    title: profile.name,
    description,
    alternates: { canonical: `/profiles/${profile.slug}` },
    openGraph: {
      title: `${profile.name} — Shukran TZ`,
      description: profile.oneLiner,
      type: "article",
      url: `/profiles/${profile.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: profile.name,
      description: profile.oneLiner,
    },
    keywords: [profile.name, category?.name ?? "", "Tanzania", "Shukran TZ"],
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const profile = await getPublishedProfile(slug);
  if (!profile) notFound();
  const category = getCategory(profile.category);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: profile.name,
    description: profile.oneLiner,
    image: mediaUrl(profile.photo),
    inLanguage: "en-TZ",
    articleSection: category?.name,
    mainEntityOfPage: absoluteUrl(`/profiles/${profile.slug}`),
    publisher: {
      "@type": "Organization",
      name: "Shukran TZ",
      url: absoluteUrl("/"),
    },
    about: {
      "@type": "Person",
      name: profile.name,
      description: `${profile.role} in ${profile.place}. ${profile.oneLiner}`,
      homeLocation: {
        "@type": "Place",
        name: `${profile.place}, Tanzania`,
      },
      jobTitle: profile.role,
      image: mediaUrl(profile.photo),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ProfileView profile={profile} />
    </>
  );
}
