/**
 * Atmosphere — the site's living architectural background.
 *
 * Five procedural layers, all rendered in SVG + CSS. No images, no video.
 *
 *   1. Atmosphere     — very soft radial gradients that drift over 40–80s.
 *   2. Blueprint      — a distributed-inference topology that extends far
 *                       beyond the viewport (rounded nodes, thin bezier
 *                       edges, engineering whiteboard feel).
 *   3. Runtime signals — sparse pulses travel along a subset of edges.
 *   4. Structural     — huge soft geometric shapes for spatial depth.
 *   5. Parallax       — each layer scrolls at a slightly different rate.
 *
 * The pathname selects one of six architectural "areas" — the same network,
 * viewed from a different angle. All numbers are deterministic so SSR
 * and hydration produce identical DOM.
 */
import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";

type Area =
  | "home" // distributed inference topology
  | "runtime" // conversation routing
  | "developers" // software architecture
  | "docs" // documentation blueprint
  | "workers" // GPU network
  | "economy" // treasury flow
  | "company"; // global infrastructure map

function areaFromPath(pathname: string): Area {
  if (pathname === "/" || pathname === "") return "home";
  if (pathname.startsWith("/runtime")) return "runtime";
  if (pathname.startsWith("/developers") || pathname.startsWith("/api")) return "developers";
  if (pathname.startsWith("/docs")) return "docs";
  if (pathname.startsWith("/product")) return "workers";
  if (pathname.startsWith("/pricing") || pathname.startsWith("/economy")) return "economy";
  if (pathname.startsWith("/company") || pathname.startsWith("/manifesto")) return "company";
  return "home";
}

/* ------------------------------------------------------------------ */
/*  Topology                                                           */
/* ------------------------------------------------------------------ */

type Node = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  cluster: "edge" | "router" | "worker" | "storage" | "sink";
};

// One canonical topology, laid out on a very wide canvas (2400 × 1400)
// so that whatever the viewport crops, the graph continues beyond it.
const NODES: Node[] = [
  // Edge / ingress column (far left)
  { id: "e1", x: 140, y: 180, w: 130, h: 34, label: "edge · sfo", cluster: "edge" },
  { id: "e2", x: 140, y: 420, w: 130, h: 34, label: "edge · fra", cluster: "edge" },
  { id: "e3", x: 140, y: 660, w: 130, h: 34, label: "edge · nrt", cluster: "edge" },
  { id: "e4", x: 140, y: 900, w: 130, h: 34, label: "edge · gru", cluster: "edge" },
  { id: "e5", x: 140, y: 1140, w: 130, h: 34, label: "edge · syd", cluster: "edge" },

  // Auth / quota gateway
  { id: "g1", x: 440, y: 300, w: 140, h: 34, label: "auth · quota", cluster: "router" },
  { id: "g2", x: 440, y: 780, w: 140, h: 34, label: "policy · ratelimit", cluster: "router" },

  // Routers (core)
  { id: "r1", x: 760, y: 460, w: 150, h: 38, label: "router · a", cluster: "router" },
  { id: "r2", x: 760, y: 720, w: 150, h: 38, label: "router · b", cluster: "router" },

  // Scheduler
  { id: "s1", x: 1060, y: 590, w: 160, h: 38, label: "scheduler", cluster: "router" },

  // Worker mesh (grid) — the heart of the network
  { id: "w1", x: 1360, y: 220, w: 120, h: 30, label: "worker · a", cluster: "worker" },
  { id: "w2", x: 1360, y: 360, w: 120, h: 30, label: "worker · b", cluster: "worker" },
  { id: "w3", x: 1360, y: 500, w: 120, h: 30, label: "worker · c", cluster: "worker" },
  { id: "w4", x: 1360, y: 640, w: 120, h: 30, label: "worker · d", cluster: "worker" },
  { id: "w5", x: 1360, y: 780, w: 120, h: 30, label: "worker · e", cluster: "worker" },
  { id: "w6", x: 1360, y: 920, w: 120, h: 30, label: "worker · f", cluster: "worker" },
  { id: "w7", x: 1360, y: 1060, w: 120, h: 30, label: "worker · g", cluster: "worker" },

  { id: "w8", x: 1600, y: 300, w: 120, h: 30, label: "orbit-1", cluster: "worker" },
  { id: "w9", x: 1600, y: 440, w: 120, h: 30, label: "orbit-1", cluster: "worker" },
  { id: "w10", x: 1600, y: 580, w: 120, h: 30, label: "orbit-mini", cluster: "worker" },
  { id: "w11", x: 1600, y: 720, w: 120, h: 30, label: "embed-1", cluster: "worker" },
  { id: "w12", x: 1600, y: 860, w: 120, h: 30, label: "image-1", cluster: "worker" },
  { id: "w13", x: 1600, y: 1000, w: 120, h: 30, label: "orbit-1", cluster: "worker" },

  // Storage / treasury sinks (far right)
  { id: "st1", x: 1900, y: 380, w: 140, h: 34, label: "kv · cache", cluster: "storage" },
  { id: "st2", x: 1900, y: 620, w: 140, h: 34, label: "ledger", cluster: "storage" },
  { id: "st3", x: 1900, y: 860, w: 140, h: 34, label: "treasury", cluster: "storage" },

  // Response stream (bottom)
  { id: "sk1", x: 1060, y: 1180, w: 160, h: 34, label: "stream · sse", cluster: "sink" },
  { id: "sk2", x: 760, y: 1180, w: 150, h: 34, label: "response", cluster: "sink" },
];

const EDGES: Array<[string, string]> = [
  // edge → gateway
  ["e1", "g1"],
  ["e2", "g1"],
  ["e3", "g1"],
  ["e3", "g2"],
  ["e4", "g2"],
  ["e5", "g2"],
  // gateway → router
  ["g1", "r1"],
  ["g1", "r2"],
  ["g2", "r1"],
  ["g2", "r2"],
  // router → scheduler
  ["r1", "s1"],
  ["r2", "s1"],
  // scheduler → workers (first column)
  ["s1", "w1"],
  ["s1", "w2"],
  ["s1", "w3"],
  ["s1", "w4"],
  ["s1", "w5"],
  ["s1", "w6"],
  ["s1", "w7"],
  // worker column A → column B
  ["w1", "w8"],
  ["w2", "w8"],
  ["w2", "w9"],
  ["w3", "w9"],
  ["w4", "w10"],
  ["w5", "w10"],
  ["w5", "w11"],
  ["w6", "w11"],
  ["w6", "w12"],
  ["w7", "w12"],
  ["w7", "w13"],
  // workers → storage/treasury
  ["w8", "st1"],
  ["w9", "st1"],
  ["w10", "st2"],
  ["w11", "st2"],
  ["w12", "st3"],
  ["w13", "st3"],
  // scheduler → stream → response
  ["s1", "sk1"],
  ["sk1", "sk2"],
  ["sk2", "r2"],
];

function nodeById(id: string): Node {
  return NODES.find((n) => n.id === id)!;
}

// Slightly curved bezier between two node centers so the network feels
// hand-routed rather than mechanical.
function edgePath(a: Node, b: Node): string {
  const ax = a.x,
    ay = a.y;
  const bx = b.x,
    by = b.y;
  const mx = (ax + bx) / 2;
  return `M${ax},${ay} C${mx},${ay} ${mx},${by} ${bx},${by}`;
}

/* ------------------------------------------------------------------ */
/*  Area presentation                                                  */
/* ------------------------------------------------------------------ */

// Each area highlights a different band of clusters. Values are opacity
// multipliers applied to nodes / edges of that cluster.
const AREA_EMPHASIS: Record<Area, Record<Node["cluster"], number>> = {
  home: { edge: 0.9, router: 1.0, worker: 1.0, storage: 0.7, sink: 0.7 },
  runtime: { edge: 1.0, router: 1.0, worker: 0.7, storage: 0.4, sink: 1.0 },
  developers: { edge: 0.7, router: 1.0, worker: 1.0, storage: 0.7, sink: 0.7 },
  docs: { edge: 0.7, router: 0.8, worker: 0.6, storage: 0.8, sink: 0.5 },
  workers: { edge: 0.5, router: 0.7, worker: 1.0, storage: 0.6, sink: 0.6 },
  economy: { edge: 0.5, router: 0.6, worker: 0.6, storage: 1.0, sink: 0.9 },
  company: { edge: 1.0, router: 0.9, worker: 0.8, storage: 0.9, sink: 0.7 },
};

// Which edges get a runtime signal pulse — chosen for visual balance,
// not exhaustively. Shuffled per area so different pages feel different.
const SIGNAL_INDICES: Record<Area, number[]> = {
  home: [0, 6, 10, 14, 21, 27, 32],
  runtime: [0, 3, 7, 11, 15, 30, 33],
  developers: [1, 6, 9, 13, 18, 25, 31],
  docs: [2, 8, 12, 20, 24, 29],
  workers: [10, 12, 14, 16, 18, 20, 22],
  economy: [24, 25, 26, 27, 28, 29, 32],
  company: [0, 2, 4, 8, 13, 19, 26, 31],
};

/* ------------------------------------------------------------------ */
/*  Parallax                                                           */
/* ------------------------------------------------------------------ */

function useScrollParallax() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    let raf = 0;
    let latest = 0;
    const onScroll = () => {
      latest = window.scrollY || 0;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = ref.current;
        if (!el) return;
        el.style.setProperty("--sy", `${latest}`);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return ref;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function Atmosphere() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const area = areaFromPath(pathname);
  const ref = useScrollParallax();
  const signalIdx = SIGNAL_INDICES[area];
  const emphasis = AREA_EMPHASIS[area];

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ ["--sy" as string]: "0" }}
    >
      {/* Layer 0 — base vignette + faint 64px grid, static */}
      <div className="absolute inset-0" style={{ background: "var(--gradient-vignette)" }} />
      <div
        className="absolute inset-0 grid-lines mask-fade-b"
        style={{ opacity: 0.7, transform: "translate3d(0, calc(var(--sy) * -0.04px), 0)" }}
      />

      {/* Layer 1 — Atmosphere. Soft radial gradients, 40–80s drift. */}
      <div
        className="absolute inset-0"
        style={{ transform: "translate3d(0, calc(var(--sy) * -0.08px), 0)" }}
      >
        <div
          className="absolute left-1/2 top-[-30%] h-[80vh] w-[80vh] -translate-x-1/2 rounded-full opacity-25 blur-3xl animate-atmos-slow-a"
          style={{
            background: "radial-gradient(circle, oklch(0.78 0.14 232 / 0.22), transparent 62%)",
          }}
        />
        <div
          className="absolute right-[-14%] top-[30%] h-[60vh] w-[60vh] rounded-full opacity-20 blur-3xl animate-atmos-slow-b"
          style={{
            background: "radial-gradient(circle, oklch(0.6 0.1 260 / 0.30), transparent 60%)",
          }}
        />
        <div
          className="absolute left-[-10%] bottom-[6%] h-[52vh] w-[52vh] rounded-full opacity-15 blur-3xl animate-atmos-slow-c"
          style={{
            background: "radial-gradient(circle, oklch(0.7 0.09 210 / 0.30), transparent 60%)",
          }}
        />
      </div>

      {/* Layer 4 — Structural shapes. Huge soft outlines behind everything. */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 2400 1400"
        preserveAspectRatio="xMidYMid slice"
        style={{
          opacity: 0.08,
          transform: "translate3d(0, calc(var(--sy) * -0.06px), 0)",
        }}
      >
        <g stroke="oklch(0.78 0.14 232)" strokeWidth="1.2" fill="none">
          <circle cx="900" cy="700" r="820" />
          <circle cx="1700" cy="600" r="520" />
          <rect x="200" y="140" width="2000" height="1120" rx="120" ry="120" />
          <path
            d="M 100,900 C 600,780 1200,1020 1900,860 S 2600,900 2800,940"
            strokeDasharray="6 12"
          />
          <path
            d="M 100,500 C 500,540 900,380 1400,500 S 2200,540 2500,480"
            strokeDasharray="3 14"
          />
        </g>
      </svg>

      {/* Layer 2 — Architecture blueprint. The signature layer. */}
      <svg
        className="absolute inset-0 h-full w-full animate-atmos-drift"
        viewBox="0 0 2400 1400"
        preserveAspectRatio="xMidYMid slice"
        style={{
          opacity: 0.18,
          transform: "translate3d(0, calc(var(--sy) * -0.14px), 0)",
        }}
      >
        <defs>
          <linearGradient id="atmos-edge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.78 0.14 232)" stopOpacity="0.15" />
            <stop offset="50%" stopColor="oklch(0.78 0.14 232)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="oklch(0.78 0.14 232)" stopOpacity="0.15" />
          </linearGradient>
          <radialGradient id="atmos-node-halo">
            <stop offset="0%" stopColor="oklch(0.85 0.14 232)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="oklch(0.78 0.14 232)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Edges */}
        <g fill="none" strokeLinecap="round">
          {EDGES.map(([a, b], i) => {
            const na = nodeById(a);
            const nb = nodeById(b);
            const mix = (emphasis[na.cluster] + emphasis[nb.cluster]) / 2;
            return (
              <path
                key={`e-${i}`}
                d={edgePath(na, nb)}
                stroke="url(#atmos-edge)"
                strokeWidth={0.8}
                opacity={0.35 * mix}
              />
            );
          })}
        </g>

        {/* Nodes — rounded rects with a tiny center dot and a label */}
        <g>
          {NODES.map((n) => {
            const em = emphasis[n.cluster];
            return (
              <g key={n.id} opacity={0.55 + em * 0.45}>
                <circle cx={n.x} cy={n.y} r={26} fill="url(#atmos-node-halo)" opacity={0.4 * em} />
                <rect
                  x={n.x - n.w / 2}
                  y={n.y - n.h / 2}
                  width={n.w}
                  height={n.h}
                  rx={n.h / 2}
                  ry={n.h / 2}
                  fill="none"
                  stroke="oklch(0.78 0.14 232)"
                  strokeWidth={0.9}
                  opacity={0.75}
                />
                <circle cx={n.x - n.w / 2 + 12} cy={n.y} r={1.6} fill="oklch(0.9 0.13 232)" />
                <text
                  x={n.x - n.w / 2 + 22}
                  y={n.y + 3}
                  fill="oklch(0.85 0.06 232)"
                  fontSize="9"
                  fontFamily="JetBrains Mono, ui-monospace, monospace"
                  letterSpacing="0.14em"
                  opacity={0.9}
                >
                  {n.label.toUpperCase()}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Layer 3 — Runtime signals. Sparse pulses on selected edges. */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 2400 1400"
        preserveAspectRatio="xMidYMid slice"
        style={{
          opacity: 0.5,
          mixBlendMode: "screen",
          transform: "translate3d(0, calc(var(--sy) * -0.14px), 0)",
        }}
      >
        {signalIdx.map((idx, k) => {
          const edge = EDGES[idx % EDGES.length];
          if (!edge) return null;
          const na = nodeById(edge[0]);
          const nb = nodeById(edge[1]);
          const d = edgePath(na, nb);
          const dur = 6 + ((k * 1.7) % 5);
          const begin = (k * 1.3) % 8;
          return (
            <g key={`sig-${idx}-${k}`}>
              <circle r={1.8} fill="oklch(0.9 0.14 232)" opacity={0.9}>
                <animateMotion
                  dur={`${dur}s`}
                  begin={`${begin}s`}
                  repeatCount="indefinite"
                  path={d}
                />
                <animate
                  attributeName="opacity"
                  values="0;0.9;0.9;0"
                  keyTimes="0;0.15;0.85;1"
                  dur={`${dur}s`}
                  begin={`${begin}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* Top & bottom edge fades — no hard seams */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
