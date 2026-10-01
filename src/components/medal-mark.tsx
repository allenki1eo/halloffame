import { cn } from "cn";
import { medalLabel } from "@/lib/medals";
import type { Medal } from "@/lib/types";

const medalChip: Record<Medal, string> = {
  bronze:
    "border border-[#8c5a3c]/40 bg-[#f3e6d8] text-[#6b3e24]",
  silver:
    "border border-[#8a8680]/50 bg-[#eceae6] text-[#3f3d3a]",
  gold:
    "border border-[#7a5b28]/40 bg-[#f6edd6] text-[#7a5b28]",
  platinum:
    "border border-[#1c5c44]/25 bg-[#e7eeea] text-[#1c5c44]",
  diamond:
    "border border-primary bg-primary text-primary-foreground",
};

export function MedalMark({
  medal,
  kind,
  tone = "paper",
}: {
  medal: Medal;
  kind: "honor" | "work";
  tone?: "paper" | "overlay";
}) {
  const label = medalLabel[medal];
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-4xl px-3 text-xs uppercase tracking-[0.16em]",
        medalChip[medal],
        tone === "overlay" && "shadow-sm",
      )}
    >
      <span className="sr-only">{kind === "honor" ? "Honor medal" : "Work medal"}: </span>
      {kind === "honor" ? `Honor · ${label}` : label}
    </span>
  );
}
