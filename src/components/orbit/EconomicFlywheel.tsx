import { useEffect, useState } from "react";

/**
 * The economic flywheel — a closed loop of nine stages arranged in a ring,
 * with a signal continuously orbiting to show how usage compounds into
 * more usage. Flat, geometric — no globe/3D.
 */

const STAGES = [
  "Usage",
  "Revenue",
  "Treasury",
  "Buyback",
  "Higher Token Value",
  "More Stakers",
  "More Workers",
  "Better Network",
];

const CENTER = { x: 500, y: 320 };
const RADIUS = 240;

export function EconomicFlywheel() {
  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActiveIdx((i) => (i + 1) % STAGES.length), 1300);
    return () => clearInterval(t);
  }, []);

  const points = STAGES.map((label, i) => {
    const angle = (i / STAGES.length) * Math.PI * 2 - Math.PI / 2;
    return {
      label,
      x: CENTER.x + Math.cos(angle) * RADIUS,
      y: CENTER.y + Math.sin(angle) * RADIUS,
    };
  });

  const ringPath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
    .concat([`L${points[0].x},${points[0].y}`])
    .join(" ");

  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <svg
        viewBox="0 0 1000 640"
        className="mx-auto h-auto w-full min-w-[640px] max-w-3xl sm:min-w-0"
        role="img"
        aria-label="Economic flywheel"
      >
        <defs>
          <radialGradient id="fw-center-glow">
            <stop offset="0%" stopColor="oklch(0.78 0.14 232)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="oklch(0.78 0.14 232)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="fw-node-glow">
            <stop offset="0%" stopColor="oklch(0.85 0.15 232)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="oklch(0.85 0.15 232)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r={RADIUS * 0.55}
          fill="url(#fw-center-glow)"
          className="animate-orbit-breathe"
        />

        <path d={ringPath} fill="none" stroke="oklch(1 0 0 / 0.1)" strokeWidth="1" />

        {/* Orbiting signal */}
        <circle r="4" fill="oklch(0.9 0.15 232)">
          <animateMotion
            dur={`${STAGES.length * 1.3}s`}
            repeatCount="indefinite"
            path={`${ringPath} Z`}
          />
        </circle>

        <text
          x={CENTER.x}
          y={CENTER.y + 4}
          textAnchor="middle"
          fontSize="12"
          fontFamily="JetBrains Mono, monospace"
          letterSpacing="0.14em"
          fill="oklch(0.62 0.012 250)"
        >
          THE FLYWHEEL
        </text>

        {points.map((p, i) => {
          const isActive = i === activeIdx;
          return (
            <g key={p.label}>
              <circle
                cx={p.x}
                cy={p.y}
                r={isActive ? 34 : 22}
                fill="url(#fw-node-glow)"
                opacity={isActive ? 0.7 : 0.3}
                style={{ transition: "all 700ms var(--ease-out-soft)" }}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r="8"
                fill="oklch(0.14 0.008 250)"
                stroke={isActive ? "oklch(0.9 0.16 232)" : "oklch(0.55 0.11 232)"}
                strokeWidth="1.2"
              />
              <text
                x={p.x}
                y={p.y + (p.y > CENTER.y ? 32 : p.y < CENTER.y ? -22 : 5)}
                textAnchor="middle"
                fontSize="12"
                fontFamily="Inter Tight, sans-serif"
                fontWeight="500"
                fill={isActive ? "oklch(0.95 0.06 232)" : "oklch(0.85 0.02 250)"}
              >
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
