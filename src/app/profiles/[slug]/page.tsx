import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfileView } from "@/components/profile-view";
import { getPublishedProfile } from "@/lib/content";
import { categoryCopy, getLocale, htmlLang } from "@/lib/i18n";
import { localizeProfile } from "@/lib/localize";
import { messages } from "@/lib/messages";
import { absoluteUrl, mediaUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const source = await getPublishedProfile(slug);
  const copy = messages[await getLocale()];
  if (!source) {
    return { title: copy.notOnRecord, robots: { index: false, follow: false } };
  }
  const profile = localizeProfile(source, await getLocale());
  const category = categoryCopy(profile.category, await getLocale());
  const description = `${profile.oneLiner} ${profile.role}, ${profile.place}.`;
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
    keywords: [profile.name, category.name, "Tanzania", "Shukran TZ"],
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const source = await getPublishedProfile(slug);
  if (!source) notFound();
  const locale = await getLocale();
  const profile = localizeProfile(source, locale);
  const category = categoryCopy(profile.category, locale);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: profile.name,
    description: profile.oneLiner,
    image: mediaUrl(profile.photo),
    inLanguage: htmlLang(locale),
    articleSection: category.name,
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
      <ProfileView profile={source} />
    </>
  );
}
