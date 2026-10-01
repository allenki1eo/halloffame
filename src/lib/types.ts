export const categorySlugs = ["tech", "science", "arts", "community"] as const;

export type CategorySlug = (typeof categorySlugs)[number];

export type ProfileStatus = "published" | "draft";

export const medalTiers = ["bronze", "silver", "gold", "platinum", "diamond"] as const;

export type Medal = (typeof medalTiers)[number];

export const mediaKinds = ["image", "video", "link"] as const;

export type MediaKind = (typeof mediaKinds)[number];

export interface WorkMedia {
  id: string;
  kind: MediaKind;
  url: string;
  title: string;
  caption: string;
  alt: string;
}

export interface WorkItem {
  id: string;
  title: string;
  years: string;
  summary: string;
  outcome: string;
  medal: Medal;
  media: WorkMedia[];
}

export interface Profile {
  slug: string;
  name: string;
  category: CategorySlug;
  place: string;
  role: string;
  oneLiner: string;
  photo: string;
  photoAlt: string;
  status: ProfileStatus;
  honorMedal: Medal;
  work: WorkItem[];
  journey: string[];
  whyItMatters: string[];
  updatedAt?: string;
}

export interface TipInput {
  personName: string;
  category: string;
  place: string;
  workSummary: string;
  why: string;
  suggesterName: string;
  contact: string;
}

export interface Tip {
  id: string;
  createdAt: string;
  personName: string;
  category: CategorySlug;
  place: string;
  workSummary: string;
  why: string;
  suggesterName: string;
  contact: string;
  storage: "file" | "memory";
}
