export const demoSlugs = [
  "amina-juma",
  "halima-said",
  "neema-shirima",
  "josephat-mushi",
  "zawadi-kimaro",
  "baraka-mwenda",
  "eliud-komba",
  "rehema-lyimo",
] as const;

const demoSlugSet = new Set<string>(demoSlugs);

export function isDemoSlug(slug: string) {
  return demoSlugSet.has(slug);
}

export function isProduction() {
  return process.env.NODE_ENV === "production";
}
