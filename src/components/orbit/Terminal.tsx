import { useEffect, useRef, useState } from "react";

/**
 * Live monitoring console. No typing effect, no cursor.
 * Logs stream in from below, fade up, slowly scroll out the top.
 */

type Tone = "muted" | "signal" | "ok" | "warn";
type Log = { id: number; text: string; tone: Tone; ts: string };

const TEMPLATES: { text: string; tone: Tone }[] = [
  { text: "runtime ready", tone: "ok" },
  { text: "214 workers online", tone: "signal" },
  { text: "request accepted · req_${id}", tone: "muted" },
  { text: "routed to us-west-2 · worker ${w}", tone: "muted" },
  { text: "worker ${w} allocated · warm", tone: "muted" },
  { text: "streaming response · ${tps} tok/s", tone: "signal" },
  { text: "completed in ${ms}ms · ${tok} tokens", tone: "ok" },
  { text: "settlement queued · 0.00${cr} cr", tone: "muted" },
  { text: "worker ${w} released", tone: "muted" },
  { text: "router · ${dec} decisions/s", tone: "muted" },
  { text: "network stable · p50 ${p}ms", tone: "signal" },
  { text: "receipt signed · ${hash}", tone: "muted" },
  { text: "worker ${w} inference · ${ms}ms", tone: "muted" },
  { text: "embed · dim 1536 · ${ms}ms", tone: "muted" },
  { text: "backpressure normal · queue 0", tone: "ok" },
];

const HEX = "0123456789abcdef";
const rand = (n: number) => Math.floor(Math.random() * n);
const hex = (n: number) => Array.from({ length: n }, () => HEX[rand(16)]).join("");
const pad2 = (n: number) => String(n).padStart(2, "0");

function makeLog(id: number): Log {
  const t = TEMPLATES[rand(TEMPLATES.length)];
  const text = t.text
    .replace("${id}", hex(6))
    .replace("${w}", hex(4))
    .replace("${tps}", String(96 + rand(80)))
    .replace("${ms}", String(28 + rand(180)))
    .replace("${tok}", String(240 + rand(1400)))
    .replace("${cr}", pad2(rand(90)))
    .replace("${dec}", String(4200 + rand(900)))
    .replace("${p}", String(38 + rand(8)))
    .replace("${hash}", hex(10));
  const d = new Date();
  const ts = `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
  return { id, text, tone: t.tone, ts };
}

const toneClass: Record<Tone, string> = {
  muted: "text-muted-foreground",
  signal: "text-signal",
  ok: "text-emerald-300/85",
  warn: "text-amber-300/90",
};

const toneGlyph: Record<Tone, string> = {
  muted: "·",
  signal: "◇",
  ok: "✓",
  warn: "!",
};

const MAX = 14;

export function Terminal({ className = "" }: { className?: string }) {
  const seed = useRef(0);
  const [logs, setLogs] = useState<Log[]>(() =>
    Array.from({ length: 8 }, () => makeLog(seed.current++)),
  );

  useEffect(() => {
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (cancelled) return;
      setLogs((prev) => {
        const next = [...prev, makeLog(seed.current++)];
        return next.length > MAX ? next.slice(next.length - MAX) : next;
      });
      timeout = setTimeout(tick, 700 + Math.random() * 900);
    };
    timeout = setTimeout(tick, 900);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className={`glass-strong overflow-hidden rounded-2xl shadow-elegant ${className}`}>
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
        </div>
        <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          orbit · runtime · monitor
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-muted-foreground">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-full bg-signal/60 animate-orbit-ping" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-signal" />
          </span>
          live
        </div>
      </div>
      <div className="relative h-[320px] overflow-x-auto overflow-y-hidden bg-[oklch(0.13_0.008_250)] p-5 font-mono text-[12.5px] leading-relaxed">
        <div className="flex h-full min-w-max flex-col justify-end gap-[3px]">
          {logs.map((l, i) => {
            const age = logs.length - 1 - i;
            const opacity = Math.max(0.28, 1 - age * 0.06);
            return (
              <div
                key={l.id}
                className="animate-orbit-log-in flex items-baseline gap-3 whitespace-nowrap"
                style={{ opacity }}
              >
                <span className="w-[62px] shrink-0 text-muted-foreground/50">{l.ts}</span>
                <span className={`w-3 shrink-0 ${toneClass[l.tone]}`}>{toneGlyph[l.tone]}</span>
                <span className={toneClass[l.tone]}>{l.text}</span>
              </div>
            );
          })}
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[oklch(0.13_0.008_250)] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[oklch(0.13_0.008_250)] to-transparent" />
      </div>
    </div>
  );
}
