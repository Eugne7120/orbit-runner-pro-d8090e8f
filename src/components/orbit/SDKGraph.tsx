/**
 * Developer page architecture: SDK / transport / runtime dependency graph.
 * A vertical layered stack with connective flows — distinct from RuntimeFlow.
 */
import { useEffect, useState } from "react";

type L = { title: string; items: string[] };
const LAYERS: L[] = [
  { title: "Your code", items: ["chat()", "stream()", "embed()", "images()"] },
  { title: "SDK", items: ["typed client", "retries", "backoff", "telemetry"] },
  { title: "Transport", items: ["HTTP/2", "SSE", "gRPC · optional"] },
  { title: "0RBIT edge", items: ["auth", "quota", "router"] },
  { title: "Worker mesh", items: ["orbit-1", "orbit-1-mini", "embed-1", "image-1"] },
];

export function SDKGraph() {
  const [beat, setBeat] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setBeat((b) => (b + 1) % LAYERS.length), 900);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative">
      <div className="grid gap-3">
        {LAYERS.map((l, i) => {
          const active = beat >= i;
          return (
            <div key={l.title} className="relative">
              <div
                className={`flex items-center gap-4 rounded-xl border p-4 transition-all duration-700 ${
                  active
                    ? "border-border-strong bg-surface"
                    : "border-border bg-surface/30"
                }`}
              >
                <div className="w-32 shrink-0">
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
                    layer {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="mt-1 font-display text-[15px] tracking-tight">
                    {l.title}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {l.items.map((it) => (
                    <span
                      key={it}
                      className={`rounded-md border px-2 py-1 font-mono text-[11px] transition-all duration-500 ${
                        active
                          ? "border-signal/30 bg-signal/5 text-foreground"
                          : "border-border bg-transparent text-muted-foreground"
                      }`}
                    >
                      {it}
                    </span>
                  ))}
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${
                      active ? "bg-signal shadow-[0_0_8px] shadow-signal" : "bg-border-strong"
                    }`}
                  />
                </div>
              </div>
              {i < LAYERS.length - 1 && (
                <div className="ml-40 h-4 w-px bg-gradient-to-b from-border-strong to-transparent" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
