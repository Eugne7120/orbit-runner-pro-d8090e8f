import { useEffect, useState } from "react";

/**
 * Abstract world dot-map showing worker regions.
 * Not a real globe a stylized lat/lng grid with worker points.
 */

const REGIONS = [
  { id: "us-west", name: "us-west-2", x: 130, y: 155, workers: 42, city: "Portland" },
  { id: "us-east", name: "us-east-1", x: 250, y: 165, workers: 58, city: "Ashburn" },
  { id: "sa-east", name: "sa-east-1", x: 300, y: 300, workers: 12, city: "São Paulo" },
  { id: "eu-west", name: "eu-west-1", x: 470, y: 130, workers: 34, city: "Dublin" },
  { id: "eu-central", name: "eu-central-1", x: 510, y: 140, workers: 28, city: "Frankfurt" },
  { id: "af-south", name: "af-south-1", x: 555, y: 300, workers: 6, city: "Cape Town" },
  { id: "me-central", name: "me-central-1", x: 610, y: 210, workers: 8, city: "Dubai" },
  { id: "ap-south", name: "ap-south-1", x: 680, y: 220, workers: 14, city: "Mumbai" },
  { id: "ap-southeast", name: "ap-southeast-1", x: 770, y: 260, workers: 18, city: "Singapore" },
  { id: "ap-northeast", name: "ap-northeast-1", x: 850, y: 175, workers: 22, city: "Tokyo" },
  { id: "ap-southeast-2", name: "ap-southeast-2", x: 870, y: 335, workers: 10, city: "Sydney" },
];

// Sparse continental dot mask (hand-tuned coordinates).
const LAND_DOTS: [number, number][] = [];
for (let x = 60; x < 940; x += 14) {
  for (let y = 80; y < 380; y += 14) {
    // Rough noise mask for land shapes
    const nx = x / 940;
    const ny = y / 380;
    const n = Math.sin(nx * 22 + ny * 9) * Math.cos(ny * 15 - nx * 6);
    if (n > 0.15 && n < 0.9) LAND_DOTS.push([x, y]);
  }
}

export function RegionMap() {
  const [active, setActive] = useState<string | null>(null);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    // rotate an "active traffic surge" through regions
    const t = setInterval(() => {
      setActive(REGIONS[Math.floor(Math.random() * REGIONS.length)].id);
      setPulse((p) => p + 1);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative">
      <svg viewBox="0 0 1000 420" className="h-auto w-full" role="img" aria-label="Worker regions">
        <defs>
          <radialGradient id="region-glow">
            <stop offset="0%" stopColor="oklch(0.78 0.14 232)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="oklch(0.78 0.14 232)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* land dots */}
        {LAND_DOTS.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1" fill="oklch(1 0 0 / 0.09)" />
        ))}

        {/* connective arcs between adjacent regions */}
        <g stroke="oklch(0.78 0.14 232 / 0.18)" strokeWidth="0.6" fill="none">
          {REGIONS.map((a, i) =>
            REGIONS.slice(i + 1).map((b) => {
              const d = Math.hypot(a.x - b.x, a.y - b.y);
              if (d > 260) return null;
              const mx = (a.x + b.x) / 2;
              const my = (a.y + b.y) / 2 - d * 0.12;
              return (
                <path key={`${a.id}-${b.id}`} d={`M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`} />
              );
            }),
          )}
        </g>

        {/* regions */}
        {REGIONS.map((r) => {
          const isActive = active === r.id;
          return (
            <g key={r.id}>
              <circle
                cx={r.x}
                cy={r.y}
                r={isActive ? 18 : 10}
                fill="url(#region-glow)"
                opacity={isActive ? 0.9 : 0.4}
                style={{ transition: "all 900ms var(--ease-out-soft)" }}
              />
              <circle cx={r.x} cy={r.y} r="2.4" fill="oklch(0.9 0.14 232)" />
              {isActive && (
                <circle
                  key={pulse}
                  cx={r.x}
                  cy={r.y}
                  r="3"
                  fill="none"
                  stroke="oklch(0.85 0.14 232)"
                  strokeWidth="1"
                  className="animate-orbit-ping"
                />
              )}
              <text
                x={r.x}
                y={r.y - 12}
                textAnchor="middle"
                fontSize="7"
                fontFamily="JetBrains Mono, monospace"
                letterSpacing="0.12em"
                fill={isActive ? "oklch(0.9 0.06 232)" : "oklch(0.55 0.012 250)"}
                style={{ transition: "fill 700ms" }}
              >
                {r.name.toUpperCase()}
              </text>
              <text
                x={r.x}
                y={r.y + 18}
                textAnchor="middle"
                fontSize="6.5"
                fontFamily="JetBrains Mono, monospace"
                fill="oklch(0.42 0.008 250)"
              >
                {r.workers} workers
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
