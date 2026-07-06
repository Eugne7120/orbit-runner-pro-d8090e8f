import { useEffect, useState } from "react";

/**
 * Compact request flow: User App → 0RBIT API → Scheduler → Worker → Streaming Response.
 * A signal cycles through the nodes; a moving glyph traces each edge in turn.
 */

const NODES = [
  { label: "User app", sub: "SDK / HTTP" },
  { label: "0RBIT API", sub: "gateway · auth" },
  { label: "Scheduler", sub: "router · scoring" },
  { label: "Worker", sub: "H100 · eu-west-3" },
  { label: "Stream", sub: "response · SSE" },
];

export function ApiWorkflow() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => (a + 1) % NODES.length);
    }, 1100);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="glass-strong overflow-hidden rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          / request flow
        </div>
        <div className="flex items-center gap-2 font-mono text-[10.5px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-signal animate-orbit-pulse shadow-[0_0_8px] shadow-signal" />
          live · {NODES[active].label.toLowerCase()}
        </div>
      </div>

      <div className="flex items-stretch gap-2 overflow-x-auto pb-1">
        {NODES.map((n, i) => (
          <div key={n.label} className="flex flex-1 min-w-[120px] items-stretch gap-2">
            <div
              className={`flex-1 rounded-xl border p-3 transition-all duration-300 ${
                i === active
                  ? "border-signal/50 bg-signal/[0.06] shadow-[0_0_0_1px_oklch(0.78_0.14_232/0.25)]"
                  : "border-border bg-surface/40"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    i === active
                      ? "bg-signal shadow-[0_0_10px] shadow-signal"
                      : "bg-muted-foreground/40"
                  }`}
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  step {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div
                className={`mt-2 font-display text-[14px] tracking-tight transition-colors ${
                  i === active ? "text-foreground" : "text-foreground/80"
                }`}
              >
                {n.label}
              </div>
              <div className="mt-0.5 font-mono text-[10.5px] text-muted-foreground/80">{n.sub}</div>
            </div>

            {i < NODES.length - 1 && (
              <div className="relative flex w-6 shrink-0 items-center">
                <div className="h-px w-full bg-border" />
                <span
                  className={`absolute left-0 h-1.5 w-1.5 rounded-full bg-signal transition-transform duration-[900ms] ${
                    i === active
                      ? "translate-x-[calc(100%+8px)] opacity-100"
                      : "translate-x-0 opacity-0"
                  }`}
                  style={{ boxShadow: "0 0 8px oklch(0.78 0.14 232 / 0.6)" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
