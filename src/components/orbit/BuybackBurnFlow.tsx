import { useEffect, useState } from "react";

/**
 * Buyback & burn cycle: Revenue → Treasury → Market Buyback → Burn Address → Reduced Supply.
 * Laid out as a horizontal chain on desktop, stacking vertically on small screens
 * (the SVG viewBox scales down naturally; no layout logic needed beyond the
 * existing responsive full-width container).
 */

const STEPS = [
  { id: "revenue", label: "Revenue", sub: "from every request" },
  { id: "treasury", label: "Treasury", sub: "collects & allocates" },
  { id: "buyback", label: "Market Buyback", sub: "buys $0RBIT" },
  { id: "burn", label: "Burn Address", sub: "tokens sent, unrecoverable" },
  { id: "supply", label: "Reduced Supply", sub: "value accrues to holders" },
];

export function BuybackBurnFlow() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % STEPS.length), 1400);
    return () => clearInterval(t);
  }, []);

  const N = STEPS.length;
  const W = 1000;
  const cx = (i: number) => 90 + (i / (N - 1)) * (W - 180);
  const cy = 70;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} 160`} className="h-auto w-full" role="img" aria-label="Buyback and burn cycle">
        <defs>
          <linearGradient id="bb-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.78 0.14 232 / 0.08)" />
            <stop offset="50%" stopColor="oklch(0.78 0.14 232 / 0.5)" />
            <stop offset="100%" stopColor="oklch(0.78 0.14 232 / 0.08)" />
          </linearGradient>
        </defs>

        <line x1={cx(0)} y1={cy} x2={cx(N - 1)} y2={cy} stroke="url(#bb-line)" strokeWidth="1" />

        {/* Traveling signal that runs the whole chain, looping */}
        <circle r="3.4" fill="oklch(0.9 0.15 232)">
          <animateMotion
            dur={`${STEPS.length * 1.4}s`}
            repeatCount="indefinite"
            path={`M${cx(0)},${cy} L${cx(N - 1)},${cy}`}
          />
        </circle>

        {STEPS.map((s, i) => {
          const isActive = i === active;
          return (
            <g key={s.id}>
              <circle
                cx={cx(i)}
                cy={cy}
                r={isActive ? 30 : 22}
                fill="oklch(0.78 0.14 232 / 0.12)"
                opacity={isActive ? 0.9 : 0.4}
                style={{ transition: "all 700ms var(--ease-out-soft)" }}
              />
              <circle
                cx={cx(i)}
                cy={cy}
                r="16"
                fill="oklch(0.14 0.008 250)"
                stroke={isActive ? "oklch(0.9 0.16 232)" : "oklch(0.55 0.11 232)"}
                strokeWidth="1.2"
              />
              <text
                x={cx(i)}
                y={cy + 4}
                textAnchor="middle"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
                fill={isActive ? "oklch(0.95 0.06 232)" : "oklch(0.62 0.012 250)"}
              >
                {String(i + 1).padStart(2, "0")}
              </text>
              <text
                x={cx(i)}
                y={cy + 46}
                textAnchor="middle"
                fontSize="12.5"
                fontFamily="Inter Tight, sans-serif"
                fontWeight="500"
                fill="oklch(0.95 0.004 250)"
              >
                {s.label}
              </text>
              <text
                x={cx(i)}
                y={cy + 64}
                textAnchor="middle"
                fontSize="9"
                fontFamily="JetBrains Mono, monospace"
                fill="oklch(0.55 0.012 250)"
              >
                {s.sub}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
