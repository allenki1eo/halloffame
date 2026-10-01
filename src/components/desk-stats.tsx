function Tile({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-border bg-card px-4 py-4">
      <p className="text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-4xl leading-none tracking-tight">{value}</p>
    </div>
  );
}

export function DeskStats({
  label,
  tiles,
}: {
  label: string;
  tiles: { label: string; value: number }[];
}) {
  return (
    <section aria-label={label} className="mt-8">
      <h2 className="text-xs uppercase tracking-[0.2em] text-primary">{label}</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.slice(0, 4).map((tile) => (
          <Tile key={tile.label} label={tile.label} value={tile.value} />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {tiles.slice(4).map((tile) => (
          <Tile key={tile.label} label={tile.label} value={tile.value} />
        ))}
      </div>
    </section>
  );
}
