"use client";

import { usePathname } from "next/navigation";
import { setLocale } from "@/lib/locale-actions";
import { messages, type Locale } from "@/lib/messages";

export function LanguageToggle({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const label = messages[locale].language;

  return (
    <div role="group" aria-label={label} className="flex overflow-hidden rounded-md border border-border">
      {(["en", "sw"] as const).map((code) => {
        const current = locale === code;
        return (
          <form key={code} action={setLocale}>
            <input type="hidden" name="locale" value={code} />
            <input type="hidden" name="next" value={pathname} />
            <button
              type="submit"
              aria-pressed={current}
              className={`h-11 min-w-11 px-3 text-sm tracking-wide ${
                current ? "bg-primary text-primary-foreground" : "bg-background text-foreground hover:bg-secondary"
              }`}
            >
              {code === "en" ? "EN" : "SW"}
            </button>
          </form>
        );
      })}
    </div>
  );
}
