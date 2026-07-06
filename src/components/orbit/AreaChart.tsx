import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Live area chart. Values evolve continuously via a smoothed random walk.
 * SVG only — no chart lib. Renders at ~2fps for calm motion.
 */
export function AreaChart({
  seed = 42,
  base = 60,
  variance = 22,
  color = "signal",
  height = 140,
  label,
  unit = "",
  format = (n: number) => `${Math.round(n)}${unit}`,
}: {
  seed?: number;
  base?: number;
  variance?: number;
  color?: "signal" | "muted" | "warm";
  height?: number;
  label?: string;
  unit?: string;
  format?: (n: number) => string;
}) {
  const N = 64;
  const walkRef = useRef(base);
  const [pts, setPts] = useState<number[]>(() => {
    // deterministic init from seed
    let s = seed;
    const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    let v = base;
    const arr: number[] = [];
    for (let i = 0; i < N; i++) {
      v += (rnd() - 0.5) * variance * 0.35;
      v = Math.max(base - variance, Math.min(base + variance, v));
      arr.push(v);
    }
    walkRef.current = v;
    return arr;
  });

  useEffect(() => {
    const t = setInterval(() => {
      setPts((p) => {
        let v = walkRef.current;
        v += (Math.random() - 0.5) * variance * 0.4;
        // mean revert
        v += (base - v) * 0.08;
        v = Math.max(base - variance * 1.2, Math.min(base + variance * 1.2, v));
        walkRef.current = v;
        return [...p.slice(1), v];
      });
    }, 500);
    return () => clearInterval(t);
  }, [base, variance]);

  const stroke =
    color === "signal"
      ? "oklch(0.78 0.14 232)"
      : color === "warm"
        ? "oklch(0.78 0.12 60)"
        : "oklch(0.7 0.008 250)";

  const { d, area, last } = useMemo(() => {
    const min = Math.min(...pts);
    const max = Math.max(...pts);
    const span = Math.max(max - min, 0.001);
    const H = height - 12;
    const W = 100;
    const path = pts
      .map((y, i) => {
        const x = (i / (N - 1)) * W;
        const yy = H - ((y - min) / span) * (H - 8) + 4;
        return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${yy.toFixed(2)}`;
      })
      .join(" ");
    const areaD = `${path} L${W},${H} L0,${H} Z`;
    const lastY = H - ((pts[pts.length - 1] - min) / span) * (H - 8) + 4;
    return { d: path, area: areaD, last: { x: W, y: lastY } };
  }, [pts, height]);

  const current = pts[pts.length - 1];

  return (
    <div className="w-full">
      {label && (
        <div className="mb-2 flex items-baseline justify-between">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </div>
          <div className="font-mono text-[13px] tabular-nums text-foreground">
            {format(current)}
          </div>
        </div>
      )}
      <svg
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        className="h-auto w-full"
        style={{ height }}
      >
        <defs>
          <linearGradient id={`area-${color}-${seed}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.28" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* baseline grid */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={0}
            x2={100}
            y1={height * f}
            y2={height * f}
            stroke="oklch(1 0 0 / 0.05)"
            strokeWidth="0.4"
          />
        ))}
        <path d={area} fill={`url(#area-${color}-${seed})`} />
        <path d={d} fill="none" stroke={stroke} strokeWidth="1.1" strokeLinejoin="round" />
        <circle cx={last.x} cy={last.y} r="1.6" fill={stroke}>
          <animate attributeName="r" values="1.6;3;1.6" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.4;1" dur="1.6s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}
