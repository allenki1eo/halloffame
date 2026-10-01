"use client";

import { useState } from "react";
import { messages, type Locale } from "@/lib/messages";
import { socialKinds, type SocialKind, type SocialLink } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const selectClass =
  "h-11 w-full rounded-md border border-input bg-background px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

type Row = { key: string; kind: SocialKind; url: string };

function rowsFrom(socials: SocialLink[]): Row[] {
  return socials.map((link) => ({ key: crypto.randomUUID(), kind: link.kind, url: link.url }));
}

export function SocialFields({ locale, socials }: { locale: Locale; socials: SocialLink[] }) {
  const m = messages[locale];
  const [rows, setRows] = useState<Row[]>(() => rowsFrom(socials));

  return (
    <fieldset className="space-y-4">
      <legend className="font-display text-2xl">{m.reachThem}</legend>
      <p className="text-sm text-muted-foreground">{m.socialHint}</p>
      {rows.length === 0 ? <p className="text-sm text-muted-foreground">{m.nothingYet}</p> : null}
      <ul className="space-y-4">
        {rows.map((row, index) => (
          <li key={row.key} className="grid gap-3 sm:grid-cols-[11rem_1fr_auto] sm:items-end">
            <div className="space-y-2">
              <Label htmlFor={`social-kind-${row.key}`}>{m.linkKind}</Label>
              <select
                id={`social-kind-${row.key}`}
                name="socialKind"
                className={selectClass}
                value={row.kind}
                onChange={(event) =>
                  setRows((current) =>
                    current.map((item) =>
                      item.key === row.key ? { ...item, kind: event.target.value as SocialKind } : item,
                    ),
                  )
                }
              >
                {socialKinds.map((kind) => (
                  <option key={kind} value={kind}>
                    {m.social[kind]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`social-url-${row.key}`}>{m.linkUrl}</Label>
              <Input
                id={`social-url-${row.key}`}
                name="socialUrl"
                value={row.url}
                spellCheck={false}
                onChange={(event) =>
                  setRows((current) =>
                    current.map((item) => (item.key === row.key ? { ...item, url: event.target.value } : item)),
                  )
                }
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRows((current) => current.filter((_, item) => item !== index))}
            >
              {m.removeLink}
            </Button>
          </li>
        ))}
      </ul>
      <Button
        type="button"
        variant="secondary"
        onClick={() => setRows((current) => [...current, { key: crypto.randomUUID(), kind: "website", url: "" }])}
      >
        {m.addLink}
      </Button>
    </fieldset>
  );
}
