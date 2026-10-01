import { medalTiers, mediaKinds, type Medal, type MediaKind } from "@/lib/types";

export const medalLabel: Record<Medal, string> = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
  platinum: "Platinum",
  diamond: "Diamond",
};

export function isMedal(value: string): value is Medal {
  return (medalTiers as readonly string[]).includes(value);
}

export function isMediaKind(value: string): value is MediaKind {
  return (mediaKinds as readonly string[]).includes(value);
}
