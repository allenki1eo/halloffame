import type { Messages } from "@/lib/messages";
import type { TrafficReport } from "@/lib/traffic";
import { Separator } from "@/components/ui/separator";

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Dar_es_Salaam",
  }).format(new Date(iso));
}

function Bars({
  rows,
  label,
  value,
  empty,
}: {
  rows: { name: string; count: number }[];
  label: string;
  value: (count: number) => string;
  empty: string;
}) {
  const max = rows.reduce((highest, row) => Math.max(highest, row.count), 0);
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">{empty}</p>;
  }
  return (
    <ol className="space-y-3">
      {rows.map((row) => (
        <li key={row.name}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate">{row.name}</span>
            <span className="shrink-0 text-muted-foreground">{value(row.count)}</span>
          </div>
          <div className="mt-1 h-1.5 bg-secondary" aria-hidden="true">
            <div className="h-full bg-primary" style={{ width: `${max === 0 ? 0 : Math.max(6, (row.count / max) * 100)}%` }} />
          </div>
          <span className="sr-only">
            {row.count} {label}
          </span>
        </li>
      ))}
    </ol>
  );
}

function note(report: TrafficReport, copy: Messages) {
  if (report.unavailable) return copy.trafficNoteUnavailable;
  if (report.storage === "turso") return copy.trafficNoteTurso;
  return copy.trafficNoteFile;
}

export function TrafficDesk({ report, copy }: { report: TrafficReport; copy: Messages }) {
  const devices = copy.devicesLine
    .replace("{mobile}", String(report.devices.mobile))
    .replace("{desktop}", String(report.devices.desktop));

  return (
    <section aria-labelledby="traffic-heading" className="mt-14">
      <h2 id="traffic-heading" className="font-display text-4xl tracking-tight">
        {copy.traffic}
      </h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">{note(report, copy)}</p>
      <p className="mt-3 text-sm text-muted-foreground">{devices}</p>
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          <h3 className="font-display text-2xl">{copy.topPages}</h3>
          <Separator className="my-3" />
          <Bars
            rows={report.topPages.map((row) => ({ name: row.path, count: row.views }))}
            label={copy.pageViews}
            empty={copy.nothingYet}
            value={(count) => `${count}`}
          />
        </div>
        <div>
          <h3 className="font-display text-2xl">{copy.whereFrom}</h3>
          <Separator className="my-3" />
          <Bars
            rows={report.topReferrers.map((row) => ({ name: row.host, count: row.views }))}
            label={copy.pageViews}
            empty={copy.nothingYet}
            value={(count) => `${count}`}
          />
        </div>
      </div>
      <div className="mt-10">
        <h3 className="font-display text-2xl">{copy.clicks}</h3>
        <Separator className="my-3" />
        <Bars
          rows={report.topClicks.map((row) => ({ name: row.label, count: row.clicks }))}
          label={copy.clicks}
          empty={copy.nothingYet}
          value={(count) => `${count}`}
        />
        {report.recentClicks.length > 0 ? (
          <ol className="mt-6 divide-y divide-border border-y border-border">
            {report.recentClicks.map((click) => (
              <li key={`${click.createdAt}-${click.event}-${click.path}-${click.target}`} className="py-3 text-sm">
                <p className="text-muted-foreground">{formatWhen(click.createdAt)}</p>
                <p className="mt-1">
                  {click.label}
                  <span className="text-muted-foreground">
                    {" "}
                    {copy.recentOn} {click.path}
                  </span>
                  {click.target ? <span className="text-muted-foreground"> · {click.target}</span> : null}
                </p>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </section>
  );
}
