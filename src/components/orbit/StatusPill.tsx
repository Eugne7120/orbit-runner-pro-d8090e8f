export function StatusPill({
  status = "operational",
  label,
}: {
  status?: "operational" | "degraded" | "elevated";
  label?: string;
}) {
  const color =
    status === "operational"
      ? "bg-signal shadow-signal"
      : status === "elevated"
        ? "bg-amber-300 shadow-amber-300/50"
        : "bg-rose-400 shadow-rose-400/50";
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
      <span className={`relative flex h-1.5 w-1.5`}>
        <span className={`absolute inset-0 rounded-full ${color} opacity-50 animate-orbit-ping`} />
        <span className={`relative h-1.5 w-1.5 rounded-full ${color} shadow-[0_0_8px]`} />
      </span>
      {label ?? status}
    </span>
  );
}
