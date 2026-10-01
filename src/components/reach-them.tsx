import type { Locale, Messages } from "@/lib/messages";
import { socialHref } from "@/lib/socials";
import type { SocialLink } from "@/lib/types";

export function ReachThem({
  links,
  messages,
}: {
  links: SocialLink[];
  messages: Messages;
  locale?: Locale;
}) {
  if (links.length === 0) return null;

  return (
    <section aria-labelledby="reach-heading" className="mx-auto max-w-6xl px-5 pb-4">
      <h2 id="reach-heading" className="text-xs uppercase tracking-[0.2em] text-primary">
        {messages.reachThem}
      </h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {links.map((link) => (
          <li key={`${link.kind}-${link.url}`}>
            <a
              href={socialHref(link)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-md border border-border px-4 text-sm hover:bg-secondary"
            >
              {messages.social[link.kind]}
              <span className="sr-only">. {messages.opensNewTab}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
