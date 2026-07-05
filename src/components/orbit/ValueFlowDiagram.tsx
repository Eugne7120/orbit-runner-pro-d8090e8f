import { useEffect, useState } from "react";

/**
 * Centerpiece value flow: how a single credit purchase turns into
 * staking rewards. Vertical chain that branches once (buyback / rewards)
 * then re-converges on stakers. Rounded nodes, bezier connectors,
 * continuously traveling signal pulses.
 */

type FlowNode = { id: string; x: number; y: number; w: number; label: string; sub?: string };

const NODES: FlowNode[] = [
  { id: "buy", x: 500, y: 40, w: 260, label: "User Purchases Credits", sub: "USD → CR" },
  { id: "infer", x: 500, y: 150, w: 220, label: "AI Inference", sub: "workers serve the request" },
  { id: "rev", x: 500, y: 260, w: 240, label: "Platform Revenue", sub: "metered per token" },
  { id: "treasury", x: 500, y: 370, w: 220, label: "Treasury", sub: "on-chain, transparent" },
  { id: "burn", x: 300, y: 490, w: 240, label: "50% Buyback & Burn", sub: "reduces supply" },
  { id: "rewards", x: 700, y: 490, w: 240, label: "50% USDC Rewards", sub: "paid to stakers" },
  { id: "stakers", x: 500, y: 610, w: 220, label: "Stakers", sub: "earn & compound" },
];

function node(id: string) {
  return NODES.find((n) => n.id === id)!;
}

function vPath(a: FlowNode, b: FlowNode) {
  const my = (a.y + b.y) / 2;
  return `M${a.x},${a.y} C${a.x},${my} ${b.x},${my} ${b.x},${b.y}`;
}

const EDGES: [string, string][] = [
  ["buy", "infer"],
  ["infer", "rev"],
  ["rev", "treasury"],
  ["treasury", "burn"],
  ["treasury", "rewards"],
  ["burn", "stakers"],
  ["rewards", "stakers"],
];

export function ValueFlowDiagram() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 3600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <svg viewBox="0 0 1000 680" className="mx-auto h-auto w-full min-w-[560px] max-w-2xl sm:min-w-0" role="img" aria-label="Value flow diagram">
        <defs>
          <linearGradient id="vf-edge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(1 0 0 / 0.03)" />
            <stop offset="50%" stopColor="oklch(0.78 0.14 232 / 0.4)" />
            <stop offset="100%" stopColor="oklch(1 0 0 / 0.03)" />
          </linearGradient>
          <radialGradient id="vf-glow">
            <stop offset="0%" stopColor="oklch(0.78 0.14 232)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="oklch(0.78 0.14 232)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Edges */}
        <g fill="none" strokeWidth="1.1">
          {EDGES.map(([a, b]) => (
            <path key={`${a}-${b}`} d={vPath(node(a), node(b))} stroke="url(#vf-edge)" />
          ))}
        </g>

        {/* Traveling signals along the chain, staggered */}
        {EDGES.map(([a, b], i) => {
          const d = vPath(node(a), node(b));
          const dur = 2.2;
          const begin = i * 0.45;
          return (
            <circle key={`sig-${a}-${b}-${tick}`} r="3.2" fill="oklch(0.9 0.15 232)">
              <animateMotion dur={`${dur}s`} begin={`${begin}s`} path={d} fill="freeze" />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.12;0.82;1"
                dur={`${dur}s`}
                begin={`${begin}s`}
                fill="freeze"
              />
            </circle>
          );
        })}

        {/* Nodes */}
        {NODES.map((n) => {
          const isTreasury = n.id === "treasury";
          const isStakers = n.id === "stakers";
          return (
            <g key={n.id}>
              <ellipse
                cx={n.x}
                cy={n.y}
                rx={n.w / 2 + 14}
                ry="30"
                fill="url(#vf-glow)"
                opacity={isTreasury || isStakers ? 0.55 : 0.25}
                className={isTreasury ? "animate-orbit-breathe" : undefined}
              />
              <rect
                x={n.x - n.w / 2}
                y={n.y - 24}
                width={n.w}
                height="48"
                rx="24"
                ry="24"
                fill="oklch(0.18 0.011 250 / 0.9)"
                stroke={isTreasury || isStakers ? "oklch(0.85 0.15 232)" : "oklch(0.78 0.14 232 / 0.45)"}
                strokeWidth={isTreasury || isStakers ? 1.4 : 1}
              />
              <text
                x={n.x}
                y={n.y - 2}
                textAnchor="middle"
                fontSize="14"
                fontFamily="Inter Tight, sans-serif"
                fontWeight="500"
                fill="oklch(0.97 0.004 250)"
              >
                {n.label}
              </text>
              {n.sub && (
                <text
                  x={n.x}
                  y={n.y + 16}
                  textAnchor="middle"
                  fontSize="9.5"
                  fontFamily="JetBrains Mono, monospace"
                  letterSpacing="0.06em"
                  fill="oklch(0.62 0.012 250)"
                >
                  {n.sub}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
