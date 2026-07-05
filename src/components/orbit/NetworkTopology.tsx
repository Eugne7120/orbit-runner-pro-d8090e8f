import { useEffect, useState } from "react";

/**
 * Worker network topology — a flat mesh diagram, not a map or globe.
 * A client submits requests to the scheduler hub, which routes to one
 * of several worker nodes arranged around it. Workers are loosely
 * interconnected (mesh), and a signal periodically travels client → hub → worker.
 */

type NodeDef = { id: string; x: number; y: number; label: string; kind: "client" | "hub" | "worker" };

const CENTER = { x: 560, y: 230 };
const RADIUS = 175;
const WORKER_COUNT = 8;

const WORKERS: NodeDef[] = Array.from({ length: WORKER_COUNT }).map((_, i) => {
  const angle = (i / WORKER_COUNT) * Math.PI * 2 - Math.PI / 2;
  return {
    id: `w${i}`,
    x: CENTER.x + Math.cos(angle) * RADIUS,
    y: CENTER.y + Math.sin(angle) * RADIUS,
    label: `Worker`,
    kind: "worker",
  };
});

const HUB: NodeDef = { id: "hub", x: CENTER.x, y: CENTER.y, label: "Scheduler", kind: "hub" };
const CLIENT: NodeDef = { id: "client", x: 90, y: CENTER.y, label: "Request", kind: "client" };

const NODES: NodeDef[] = [CLIENT, HUB, ...WORKERS];

function pathBetween(a: NodeDef, b: NodeDef) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  return `M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`;
}

// Faint mesh links between neighboring workers, for a "network" feel.
const MESH_LINKS: [string, string][] = WORKERS.map((w, i) => [w.id, WORKERS[(i + 1) % WORKERS.length].id]);

export function NetworkTopology() {
  const [activeWorker, setActiveWorker] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveWorker((i) => (i + 1) % WORKER_COUNT);
      setTick((n) => n + 1);
    }, 2600);
    return () => clearInterval(t);
  }, []);

  const active = WORKERS[activeWorker];
  const clientToHub = pathBetween(CLIENT, HUB);
  const hubToWorker = pathBetween(HUB, active);

  return (
    <div className="relative w-full">
      <svg viewBox="0 0 1080 460" className="h-auto w-full" role="img" aria-label="Worker network topology">
        <defs>
          <radialGradient id="topo-hub-glow">
            <stop offset="0%" stopColor="oklch(0.85 0.15 232)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="oklch(0.85 0.15 232)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="topo-node-glow">
            <stop offset="0%" stopColor="oklch(0.78 0.14 232)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="oklch(0.78 0.14 232)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Faint mesh links between workers */}
        <g stroke="oklch(1 0 0 / 0.06)" strokeWidth="0.8" fill="none">
          {MESH_LINKS.map(([a, b]) => {
            const na = WORKERS.find((w) => w.id === a)!;
            const nb = WORKERS.find((w) => w.id === b)!;
            return <path key={`${a}-${b}`} d={pathBetween(na, nb)} />;
          })}
        </g>

        {/* Hub → every worker, faint */}
        <g stroke="oklch(0.78 0.14 232 / 0.14)" strokeWidth="0.8" fill="none">
          {WORKERS.map((w) => (
            <path key={`hub-${w.id}`} d={pathBetween(HUB, w)} />
          ))}
        </g>

        {/* Client → hub main line */}
        <path d={clientToHub} stroke="oklch(1 0 0 / 0.16)" strokeWidth="1.1" fill="none" />

        {/* Active hub → worker highlighted line */}
        <path
          key={`active-line-${tick}`}
          d={hubToWorker}
          stroke="oklch(0.78 0.14 232 / 0.55)"
          strokeWidth="1.3"
          fill="none"
        />

        {/* Traveling signal: client → hub */}
        <circle key={`sig-a-${tick}`} r="3" fill="oklch(0.9 0.15 232)">
          <animateMotion dur="1.1s" path={clientToHub} fill="freeze" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.8;1" dur="1.1s" fill="freeze" />
        </circle>

        {/* Traveling signal: hub → active worker */}
        <circle key={`sig-b-${tick}`} r="3" fill="oklch(0.9 0.15 232)">
          <animateMotion dur="1.1s" begin="1.05s" path={hubToWorker} fill="freeze" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.8;1" dur="1.1s" begin="1.05s" fill="freeze" />
        </circle>

        {/* Client node */}
        <g>
          <circle cx={CLIENT.x} cy={CLIENT.y} r="26" fill="url(#topo-node-glow)" opacity="0.5" />
          <rect x={CLIENT.x - 34} y={CLIENT.y - 14} width="68" height="28" rx="14" fill="oklch(0.14 0.008 250)" stroke="oklch(0.78 0.14 232)" strokeWidth="1" />
          <text x={CLIENT.x} y={CLIENT.y + 4} textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono, monospace" letterSpacing="0.08em" fill="oklch(0.85 0.06 232)">
            CLIENT
          </text>
          <text x={CLIENT.x} y={CLIENT.y + 40} textAnchor="middle" fontSize="8" fontFamily="JetBrains Mono, monospace" fill="oklch(0.55 0.012 250)">
            request
          </text>
        </g>

        {/* Hub node */}
        <g>
          <circle cx={HUB.x} cy={HUB.y} r="46" fill="url(#topo-hub-glow)" opacity="0.55" className="animate-orbit-breathe" />
          <circle cx={HUB.x} cy={HUB.y} r="20" fill="oklch(0.14 0.008 250)" stroke="oklch(0.9 0.16 232)" strokeWidth="1.4" />
          <circle cx={HUB.x} cy={HUB.y} r="3" fill="oklch(0.97 0.004 250)" />
          <circle cx={HUB.x} cy={HUB.y} r="20" fill="none" stroke="oklch(0.78 0.14 232 / 0.5)" strokeWidth="0.8" className="animate-orbit-ring" />
          <text x={HUB.x} y={HUB.y + 40} textAnchor="middle" fontSize="9.5" fontFamily="JetBrains Mono, monospace" letterSpacing="0.1em" fill="oklch(0.9 0.06 232)">
            SCHEDULER
          </text>
        </g>

        {/* Worker nodes */}
        {WORKERS.map((w, i) => {
          const isActive = i === activeWorker;
          return (
            <g key={w.id} style={{ transformOrigin: `${w.x}px ${w.y}px` }}>
              <circle
                cx={w.x}
                cy={w.y}
                r={isActive ? 22 : 14}
                fill="url(#topo-node-glow)"
                opacity={isActive ? 0.85 : 0.35}
                style={{ transition: "all 900ms var(--ease-out-soft)" }}
              />
              <circle
                cx={w.x}
                cy={w.y}
                r="7"
                fill="oklch(0.14 0.008 250)"
                stroke={isActive ? "oklch(0.9 0.16 232)" : "oklch(0.55 0.11 232)"}
                strokeWidth="1.1"
                style={{ transition: "stroke 700ms" }}
              />
              <circle cx={w.x} cy={w.y} r="2.2" fill={isActive ? "oklch(0.97 0.004 250)" : "oklch(0.7 0.03 232)"} />
              <circle
                cx={w.x}
                cy={w.y}
                r="7"
                fill="none"
                stroke="oklch(0.78 0.14 232 / 0.35)"
                strokeWidth="0.7"
                className="animate-orbit-ring"
                style={{ animationDelay: `${(i % 4) * 0.7}s` }}
              />
              <text
                x={w.x}
                y={w.y + (w.y > CENTER.y ? 26 : -20)}
                textAnchor="middle"
                fontSize="8"
                fontFamily="JetBrains Mono, monospace"
                letterSpacing="0.06em"
                fill={isActive ? "oklch(0.85 0.12 232)" : "oklch(0.55 0.012 250)"}
                style={{ transition: "fill 700ms" }}
              >
                {isActive ? "ROUTING" : `NODE·${i.toString().padStart(2, "0")}`}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
