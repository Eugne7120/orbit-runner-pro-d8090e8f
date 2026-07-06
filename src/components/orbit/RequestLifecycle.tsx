import { useEffect, useState } from "react";

/**
 * Unique visualization for the API page: horizontal request lifecycle timeline.
 * Different from RuntimeFlow this is a time-based ribbon with phase blocks.
 */

type Phase = { id: string; label: string; ms: number; tone: "io" | "core" | "run" | "stream" };

const PHASES: Phase[] = [
  { id: "tls", label: "TLS", ms: 8, tone: "io" },
  { id: "auth", label: "Auth", ms: 3, tone: "core" },
  { id: "route", label: "Route", ms: 2, tone: "core" },
  { id: "queue", label: "Queue", ms: 4, tone: "core" },
  { id: "warm", label: "Warm", ms: 6, tone: "run" },
  { id: "infer", label: "Infer · first token", ms: 38, tone: "run" },
  { id: "stream", label: "Stream (2.1k tok)", ms: 620, tone: "stream" },
  { id: "close", label: "Settle", ms: 12, tone: "core" },
];

const TONE: Record<Phase["tone"], string> = {
  io: "oklch(0.55 0.02 250)",
  core: "oklch(0.62 0.05 232)",
  run: "oklch(0.78 0.14 232)",
  stream: "oklch(0.85 0.14 232)",
};

export function RequestLifecycle() {
  const total = PHASES.reduce((a, p) => a + p.ms, 0);
  const [t, setT] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const DUR = 6200;
    const tick = (now: number) => {
      const elapsed = ((now - start) % DUR) / DUR;
      setT(elapsed);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const cursorMs = t * total;
  let acc = 0;
  const activeIdx = PHASES.findIndex((p) => {
    acc += p.ms;
    return cursorMs < acc;
  });

  return (
    <div className="w-full">
      {/* ribbon */}
      <div className="mb-3 flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
        <span>request lifecycle · orbit-1 · us-west-2</span>
        <span className="text-signal">{total} ms total</span>
      </div>
      <div className="relative h-16 overflow-hidden rounded-xl border border-border bg-[oklch(0.13_0.008_250)]">
        {/* phase blocks */}
        <div className="absolute inset-0 flex">
          {PHASES.map((p, i) => {
            const w = (p.ms / total) * 100;
            return (
              <div
                key={p.id}
                className="relative border-r border-border/40 transition-all duration-500 last:border-r-0"
                style={{
                  width: `${w}%`,
                  background:
                    i === activeIdx
                      ? `linear-gradient(180deg, ${TONE[p.tone]}30, transparent)`
                      : "transparent",
                }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-[2px] transition-opacity duration-500"
                  style={{
                    background: TONE[p.tone],
                    opacity: i === activeIdx ? 1 : 0.4,
                  }}
                />
              </div>
            );
          })}
        </div>
        {/* cursor */}
        <div
          className="absolute inset-y-0 w-px bg-signal shadow-[0_0_10px] shadow-signal transition-none"
          style={{ left: `${t * 100}%` }}
        />
      </div>

      {/* labels */}
      <div className="mt-2 grid grid-cols-[repeat(8,minmax(0,1fr))] gap-1">
        {PHASES.map((p, i) => (
          <div key={p.id} className="min-w-0">
            <div
              className={`truncate font-mono text-[10.5px] transition-colors duration-500 ${
                i === activeIdx ? "text-foreground" : "text-muted-foreground/70"
              }`}
            >
              {p.label}
            </div>
            <div className="font-mono text-[10.5px] text-muted-foreground/60 tabular-nums">
              {p.ms}ms
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
