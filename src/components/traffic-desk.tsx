import { getTrafficReport, type TrafficReport } from "@/lib/traffic";
import { getLocale } from "@/lib/i18n";
import { messages } from "@/lib/messages";
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

function Window({
  title,
  views,
  clicks,
  copy,
}: {
  title: string;
  views: number;
  clicks: number;
  copy: { pageView: string; pageViews: string; click: string; clicks: string };
}) {
  return (
    <div className="border border-border px-4 py-4">
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{title}</p>
      <p className="mt-3 font-display text-4xl tracking-tight">{views}</p>
      <p className="text-sm text-muted-foreground">{views === 1 ? copy.pageView : copy.pageViews}</p>
      <p className="mt-3 font-display text-2xl">{clicks}</p>
      <p className="text-sm text-muted-foreground">{clicks === 1 ? copy.click : copy.clicks}</p>
    </div>
  );
}

function note(report: TrafficReport) {
  if (report.unavailable) {
    return "Turso is configured, and the desk could not read traffic just now. Public pages keep working.";
  }
  if (report.storage === "turso") {
    return "Stored in Turso: page_views and click_events. No cookies. The beacon ignores the editorial desk.";
  }
  return "Turso is unset, so this preview keeps traffic in data/traffic.json on the server. If that file cannot be written, the beacon is dropped and the public page still loads. Connect Turso and run npm run db:migrate to store traffic in page_views and click_events.";
}

export async function TrafficDesk() {
  const report = await getTrafficReport();
  const copy = messages[await getLocale()];
  return (
    <section aria-labelledby="traffic-heading" className="mt-12">
      <h2 id="traffic-heading" className="font-display text-3xl">
        {copy.traffic}
      </h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">{note(report)}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Window title={copy.today} views={report.today.views} clicks={report.today.clicks} copy={copy} />
        <Window title={copy.week} views={report.week.views} clicks={report.week.clicks} copy={copy} />
        <Window title={copy.month} views={report.month.views} clicks={report.month.clicks} copy={copy} />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Last 7 days: {report.devices.mobile} mobile, {report.devices.desktop} desktop. Times use Africa/Dar es Salaam.
      </p>
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
          <p className="mt-3 text-sm text-muted-foreground">
            Referrer host, plus utm_source, utm_medium, and utm_campaign when the landing address carries them.
          </p>
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
                  <span className="text-muted-foreground"> on {click.path}</span>
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
