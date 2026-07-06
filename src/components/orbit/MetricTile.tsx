import { useEffect, useRef, useState } from "react";
import { AreaChart } from "./AreaChart";

/**
 * Dashboard cell. Big number that eases toward a moving target,
 * with an inline area chart and a delta indicator.
 */
export function MetricTile({
  label,
  base,
  variance = 0.14,
  unit = "",
  format,
  chart = true,
  chartColor = "signal",
  seed = 1,
  hint,
}: {
  label: string;
  base: number;
  variance?: number;
  unit?: string;
  format?: (n: number) => string;
  chart?: boolean;
  chartColor?: "signal" | "muted" | "warm";
  seed?: number;
  hint?: string;
}) {
  const [v, setV] = useState(base);
  const [dir, setDir] = useState<"up" | "down" | "flat">("flat");
  const prev = useRef(base);

  useEffect(() => {
    const t = setInterval(() => {
      const drift = (Math.random() - 0.5) * base * variance;
      const target = Math.max(0, base + drift);
      setV((cur) => {
        const next = cur + (target - cur) * 0.35;
        const d = next - prev.current;
        setDir(Math.abs(d) < base * 0.01 ? "flat" : d > 0 ? "up" : "down");
        prev.current = next;
        return next;
      });
    }, 900);
    return () => clearInterval(t);
  }, [base, variance]);

  const fmt = format ?? ((n: number) => `${Math.round(n).toLocaleString()}${unit}`);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-surface/40 p-4 transition-all duration-500 hover:border-border-strong hover:bg-surface sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </div>
        <span
          className={`shrink-0 font-mono text-[10.5px] ${
            dir === "up"
              ? "text-emerald-300/80"
              : dir === "down"
                ? "text-rose-300/80"
                : "text-muted-foreground/60"
          }`}
        >
          {dir === "up" ? "▲" : dir === "down" ? "▼" : "–"}
        </span>
      </div>
      <div className="mt-3 font-display text-2xl font-medium tabular-nums tracking-tight sm:text-3xl md:text-4xl">
        {fmt(v)}
      </div>
      {hint && <div className="mt-1 font-mono text-[10.5px] text-muted-foreground/70">{hint}</div>}
      {chart && (
        <div className="mt-3">
          <AreaChart
            seed={seed}
            base={base}
            variance={base * variance * 2}
            color={chartColor}
            height={64}
          />
        </div>
      )}
    </div>
  );
}
