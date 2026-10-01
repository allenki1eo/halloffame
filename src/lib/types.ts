export const categorySlugs = ["tech", "science", "arts", "community"] as const;

export type CategorySlug = (typeof categorySlugs)[number];

export type ProfileStatus = "published" | "draft";

export interface WorkItem {
  title: string;
  years: string;
  summary: string;
  outcome: string;
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
  work: WorkItem[];
  journey: string[];
  whyItMatters: string[];
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
