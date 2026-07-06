/**
 * Signature runtime animation.
 * - Nodes breathe softly.
 * - Signal pulses travel continuously across edges.
 * - Workers cycle between idle and busy.
 * - The stream emits token pulses.
 * - Response pulses travel back to the caller.
 */
import { useEffect, useState } from "react";

type Node = { id: string; x: number; y: number; label: string; kind?: "worker" | "core" | "io" };

const NODES: Node[] = [
  { id: "req", x: 80, y: 200, label: "Request", kind: "io" },
  { id: "api", x: 260, y: 200, label: "API", kind: "core" },
  { id: "router", x: 460, y: 200, label: "Router", kind: "core" },
  { id: "w1", x: 680, y: 100, label: "Worker · A", kind: "worker" },
  { id: "w2", x: 680, y: 200, label: "Worker · B", kind: "worker" },
  { id: "w3", x: 680, y: 300, label: "Worker · C", kind: "worker" },
  { id: "stream", x: 900, y: 200, label: "Stream", kind: "core" },
  { id: "res", x: 1080, y: 200, label: "Response", kind: "io" },
];

const EDGES: [string, string][] = [
  ["req", "api"],
  ["api", "router"],
  ["router", "w1"],
  ["router", "w2"],
  ["router", "w3"],
  ["w1", "stream"],
  ["w2", "stream"],
  ["w3", "stream"],
  ["stream", "res"],
];

function nodeById(id: string) {
  return NODES.find((n) => n.id === id)!;
}

function pathBetween(a: Node, b: Node) {
  return `M${a.x},${a.y} C${(a.x + b.x) / 2},${a.y} ${(a.x + b.x) / 2},${b.y} ${b.x},${b.y}`;
}

export function RuntimeFlow() {
  // Which worker is currently "busy" rotates slowly for a lived-in feel
  const [busy, setBusy] = useState<string>("w2");
  useEffect(() => {
    const workers = ["w1", "w2", "w3"];
    const t = setInterval(() => {
      setBusy(workers[Math.floor(Math.random() * workers.length)]);
    }, 3400);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 1160 400"
        className="h-auto w-full"
        role="img"
        aria-label="Runtime request flow"
      >
        <defs>
          <linearGradient id="edge-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(1 0 0 / 0.04)" />
            <stop offset="50%" stopColor="oklch(1 0 0 / 0.22)" />
            <stop offset="100%" stopColor="oklch(1 0 0 / 0.04)" />
          </linearGradient>
          <radialGradient id="node-glow">
            <stop offset="0%" stopColor="oklch(0.78 0.14 232)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="oklch(0.78 0.14 232)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="node-glow-busy">
            <stop offset="0%" stopColor="oklch(0.85 0.15 232)" stopOpacity="1" />
            <stop offset="100%" stopColor="oklch(0.85 0.15 232)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Edges + traveling pulses (forward) */}
        {EDGES.map(([a, b], i) => {
          const na = nodeById(a);
          const nb = nodeById(b);
          const d = pathBetween(na, nb);
          const dur = 2.4 + (i % 3) * 0.3;
          const delay = i * 0.18;
          return (
            <g key={`${a}-${b}-${i}`}>
              <path d={d} stroke="url(#edge-grad)" strokeWidth="1" fill="none" />
              <circle r="2.4" fill="oklch(0.85 0.15 232)">
                <animateMotion
                  dur={`${dur}s`}
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                  path={d}
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.15;0.85;1"
                  dur={`${dur}s`}
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}

        {/* Reverse response pulses (stream → response → api → req), softer */}
        {[
          pathBetween(nodeById("res"), nodeById("stream")),
          pathBetween(nodeById("stream"), nodeById("w2")),
          pathBetween(nodeById("api"), nodeById("req")),
        ].map((d, i) => (
          <circle key={`rev-${i}`} r="1.6" fill="oklch(0.9 0.02 250)" opacity="0.7">
            <animateMotion
              dur={`${3.2 + i * 0.4}s`}
              begin={`${1.2 + i * 0.6}s`}
              repeatCount="indefinite"
              path={d}
              keyPoints="1;0"
              keyTimes="0;1"
            />
            <animate
              attributeName="opacity"
              values="0;0.7;0.7;0"
              keyTimes="0;0.2;0.8;1"
              dur={`${3.2 + i * 0.4}s`}
              begin={`${1.2 + i * 0.6}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* Stream node continuous token emission */}
        {Array.from({ length: 6 }).map((_, i) => {
          const s = nodeById("stream");
          const r = nodeById("res");
          const d = pathBetween(s, r);
          return (
            <circle key={`tok-${i}`} r="1.4" fill="oklch(0.85 0.15 232)" opacity="0.8">
              <animateMotion dur="1.8s" begin={`${i * 0.3}s`} repeatCount="indefinite" path={d} />
              <animate
                attributeName="opacity"
                values="0;0.9;0.9;0"
                keyTimes="0;0.15;0.85;1"
                dur="1.8s"
                begin={`${i * 0.3}s`}
                repeatCount="indefinite"
              />
            </circle>
          );
        })}

        {/* Nodes */}
        {NODES.map((n) => {
          const isBusy = n.kind === "worker" && n.id === busy;
          const glowId = isBusy ? "url(#node-glow-busy)" : "url(#node-glow)";
          return (
            <g key={n.id} className="orbit-node" style={{ transformOrigin: `${n.x}px ${n.y}px` }}>
              <circle
                cx={n.x}
                cy={n.y}
                r={isBusy ? 22 : 18}
                fill={glowId}
                opacity={isBusy ? 0.75 : 0.45}
                style={{
                  transition: "opacity 900ms var(--ease-out-soft), r 900ms var(--ease-out-soft)",
                }}
              />
              <circle
                cx={n.x}
                cy={n.y}
                r="6"
                fill="oklch(0.14 0.008 250)"
                stroke={isBusy ? "oklch(0.9 0.16 232)" : "oklch(0.78 0.14 232)"}
                strokeWidth="1"
              />
              <circle cx={n.x} cy={n.y} r="2" fill="oklch(0.97 0.004 250)" />
              {/* idle breathing ring */}
              <circle
                cx={n.x}
                cy={n.y}
                r="6"
                fill="none"
                stroke="oklch(0.78 0.14 232 / 0.4)"
                strokeWidth="0.8"
                className="animate-orbit-ring"
                style={{ animationDelay: `${(NODES.indexOf(n) % 4) * 0.6}s` }}
              />
              <text
                x={n.x}
                y={n.y + 34}
                textAnchor="middle"
                fill={isBusy ? "oklch(0.85 0.06 232)" : "oklch(0.62 0.012 250)"}
                fontSize="10"
                fontFamily="JetBrains Mono, ui-monospace, monospace"
                letterSpacing="0.06em"
                style={{ transition: "fill 700ms" }}
              >
                {n.label.toUpperCase()}
              </text>
              {isBusy && (
                <text
                  x={n.x}
                  y={n.y - 26}
                  textAnchor="middle"
                  fill="oklch(0.85 0.12 232)"
                  fontSize="8"
                  fontFamily="JetBrains Mono, ui-monospace, monospace"
                  letterSpacing="0.14em"
                >
                  BUSY
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
