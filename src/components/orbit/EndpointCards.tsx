import type * as React from "react";

/**
 * Endpoint cards visual grid of the main API surfaces.
 * Each card has: method pill, path, description, subtle hover animation.
 */

type Endpoint = {
  method: "POST" | "GET";
  path: string;
  title: string;
  description: string;
  icon: (p: { className?: string }) => React.ReactElement;
};

function I({ d, className = "" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ENDPOINTS: Endpoint[] = [
  {
    method: "POST",
    path: "/v1/chat/completions",
    title: "Chat completion",
    description: "Streamed chat with tools, JSON mode, and function calling.",
    icon: (p) => <I d="M4 6h16v9a2 2 0 0 1-2 2H9l-5 4V6z" {...p} />,
  },
  {
    method: "POST",
    path: "/v1/images/generations",
    title: "Image generation",
    description: "Text-to-image routed to image-capable workers.",
    icon: (p) => <I d="M3 5h18v14H3zM7 15l3-4 3 3 3-5 5 6" {...p} />,
  },
  {
    method: "POST",
    path: "/v1/embeddings",
    title: "Embeddings",
    description: "Batched, deduped, cached. 1536-d by default.",
    icon: (p) => (
      <I d="M4 12h4M16 12h4M12 4v4M12 16v4M8 8l3 3M16 16l-3-3M16 8l-3 3M8 16l3-3" {...p} />
    ),
  },
  {
    method: "GET",
    path: "/v1/models",
    title: "Models",
    description: "Live catalog with capabilities, context, price per token.",
    icon: (p) => <I d="M4 7l8-4 8 4-8 4-8-4zM4 12l8 4 8-4M4 17l8 4 8-4" {...p} />,
  },
  {
    method: "GET",
    path: "/v1/workers",
    title: "Workers",
    description: "Network-wide status: region, GPU class, health, load.",
    icon: (p) => <I d="M4 5h16v6H4zM4 13h16v6H4zM8 8h.01M8 16h.01" {...p} />,
  },
  {
    method: "GET",
    path: "/v1/credits",
    title: "Credits",
    description: "Usage by key, by model, by window. Live and historical.",
    icon: (p) => <I d="M3 7h18v10H3zM3 10h18M7 14h3" {...p} />,
  },
];

export function EndpointCards() {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {ENDPOINTS.map((e) => (
        <div
          key={e.path}
          className="group relative overflow-hidden rounded-2xl border border-border bg-surface/40 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface/70"
        >
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(120% 60% at 0% 0%, oklch(0.78 0.14 232 / 0.10), transparent 60%)",
            }}
          />
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/50 text-signal transition-transform duration-300 group-hover:scale-105">
              <e.icon className="h-4 w-4" />
            </div>
            <span
              className={`rounded-full border px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.18em] ${
                e.method === "POST"
                  ? "border-signal/40 text-signal"
                  : "border-emerald-300/40 text-emerald-300/90"
              }`}
            >
              {e.method}
            </span>
          </div>
          <div className="mt-4 font-mono text-[12.5px] text-foreground/90">{e.path}</div>
          <div className="mt-2 font-display text-[15px] tracking-tight text-foreground">
            {e.title}
          </div>
          <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
            {e.description}
          </p>
        </div>
      ))}
    </div>
  );
}
