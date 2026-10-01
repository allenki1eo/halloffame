import { categorySlugs, type CategorySlug } from "@/lib/types";

export interface Category {
  slug: CategorySlug;
  name: string;
  blurb: string;
  accent: "pine" | "clay" | "plum" | "gold";
}

export const categories: Category[] = [
  {
    slug: "tech",
    name: "Tech & innovation",
    blurb:
      "Tools and workshops shaped for Tanzanian conditions: power that drops, distances that matter, and language people already speak.",
    accent: "pine",
  },
  {
    slug: "science",
    name: "Science & health",
    blurb:
      "Care and evidence practiced close to the people who use them — in wards, at the lakeshore, and in the notes a colleague can actually read.",
    accent: "clay",
  },
  {
    slug: "arts",
    name: "Arts & culture",
    blurb:
      "Cloth, poems, and hours of listening. Culture kept as a record of work, made by people a town can name.",
    accent: "plum",
  },
  {
    slug: "community",
    name: "Community & service",
    blurb:
      "Apprenticeships, school gardens, and other structures that let a neighbourhood keep its own skill and feed its own day.",
    accent: "gold",
  },
];

export function isCategorySlug(value: string): value is CategorySlug {
  return categorySlugs.some((slug) => slug === value);
}

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug) ?? null;
}
