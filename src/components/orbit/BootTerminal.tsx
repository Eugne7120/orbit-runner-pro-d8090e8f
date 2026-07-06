import { useEffect, useRef, useState } from "react";

/**
 * Full-lifecycle terminal:
 *  Phase 1: BOOT typed initialization sequence (only phase with typing)
 *  Phase 2: MONITOR continuous fade-in live logs (repeats forever)
 *  Between cycles, a new prompt arrives and streams tokens back.
 */

type Tone = "muted" | "signal" | "ok" | "warn" | "cmd";
type Line = { id: number; text: string; tone: Tone; ts?: string; typing?: boolean };

const BOOT: { text: string; tone: Tone; delay?: number }[] = [
  { text: "$ orbit runtime start", tone: "cmd" },
  { text: "boot: loading kernel v1.4.2", tone: "muted", delay: 320 },
  { text: "boot: scheduler online · quorum 3/3", tone: "ok", delay: 260 },
  { text: "boot: connecting workers · us-west-2", tone: "muted", delay: 220 },
  { text: "boot: connecting workers · eu-west-1", tone: "muted", delay: 220 },
  { text: "boot: connecting workers · ap-northeast-1", tone: "muted", delay: 220 },
  { text: "boot: 214 workers online", tone: "signal", delay: 300 },
  { text: "boot: warm pools ready · ttft 38ms", tone: "ok", delay: 280 },
  { text: "runtime ready · listening 0.0.0.0:443", tone: "ok", delay: 260 },
];

const MONITOR: { text: string; tone: Tone }[] = [
  { text: "request accepted · req_${id}", tone: "muted" },
  { text: "routed to us-west-2 · worker ${w}", tone: "muted" },
  { text: "worker ${w} allocated · warm", tone: "muted" },
  { text: "streaming response · ${tps} tok/s", tone: "signal" },
  { text: "completed in ${ms}ms · ${tok} tokens", tone: "ok" },
  { text: "settlement queued · 0.00${cr} cr", tone: "muted" },
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

function fill(text: string) {
  return text
    .replace("${id}", hex(6))
    .replace("${w}", hex(4))
    .replace("${tps}", String(96 + rand(80)))
    .replace("${ms}", String(28 + rand(180)))
    .replace("${tok}", String(240 + rand(1400)))
    .replace("${cr}", pad2(rand(90)))
    .replace("${dec}", String(4200 + rand(900)))
    .replace("${p}", String(38 + rand(8)))
    .replace("${hash}", hex(10));
}

function nowTs() {
  const d = new Date();
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

const toneClass: Record<Tone, string> = {
  muted: "text-muted-foreground",
  signal: "text-signal",
  ok: "text-emerald-300/85",
  warn: "text-amber-300/90",
  cmd: "text-foreground",
};

const toneGlyph: Record<Tone, string> = {
  muted: "·",
  signal: "◇",
  ok: "✓",
  warn: "!",
  cmd: "$",
};

const MAX = 16;

export function BootTerminal({ className = "" }: { className?: string }) {
  const seed = useRef(0);
  const [lines, setLines] = useState<Line[]>([]);
  const [booted, setBooted] = useState(false);
  const [cycle, setCycle] = useState(0);

  // Boot sequence
  useEffect(() => {
    let cancelled = false;
    let i = 0;
    const step = () => {
      if (cancelled) return;
      if (i >= BOOT.length) {
        setBooted(true);
        return;
      }
      const b = BOOT[i];
      const id = seed.current++;
      // add empty line, then progressively fill it (typing)
      setLines((prev) => {
        const next = [
          ...prev,
          { id, text: "", tone: b.tone, ts: b.tone === "cmd" ? undefined : nowTs(), typing: true },
        ];
        return next.length > MAX ? next.slice(next.length - MAX) : next;
      });
      let charIdx = 0;
      const typeSpeed = b.tone === "cmd" ? 24 : 8;
      const typer = setInterval(() => {
        if (cancelled) return clearInterval(typer);
        charIdx++;
        setLines((prev) =>
          prev.map((l) =>
            l.id === id
              ? { ...l, text: b.text.slice(0, charIdx), typing: charIdx < b.text.length }
              : l,
          ),
        );
        if (charIdx >= b.text.length) {
          clearInterval(typer);
          i++;
          setTimeout(step, b.delay ?? 180);
        }
      }, typeSpeed);
    };
    step();
    return () => {
      cancelled = true;
    };
  }, [cycle]);

  // Monitor mode continuous logs after boot
  useEffect(() => {
    if (!booted) return;
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout>;
    const startedAt = Date.now();
    const tick = () => {
      if (cancelled) return;
      // After ~18s in monitor mode, clear and re-run the boot sequence.
      if (Date.now() - startedAt > 18000) {
        setBooted(false);
        setLines([]);
        setCycle((c) => c + 1);
        return;
      }
      const t = MONITOR[rand(MONITOR.length)];
      const id = seed.current++;
      setLines((prev) => {
        const next = [...prev, { id, text: fill(t.text), tone: t.tone, ts: nowTs() }];
        return next.length > MAX ? next.slice(next.length - MAX) : next;
      });
      timeout = setTimeout(tick, 700 + Math.random() * 900);
    };
    timeout = setTimeout(tick, 500);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [booted]);

  return (
    <div className={`glass-strong overflow-hidden rounded-2xl shadow-elegant ${className}`}>
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
        </div>
        <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          orbit · runtime · {booted ? "monitor" : "boot"}
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-muted-foreground">
          <span className="relative flex h-1.5 w-1.5">
            <span
              className={`absolute inset-0 rounded-full ${booted ? "bg-signal/60" : "bg-amber-300/60"} animate-orbit-ping`}
            />
            <span
              className={`relative h-1.5 w-1.5 rounded-full ${booted ? "bg-signal" : "bg-amber-300"}`}
            />
          </span>
          {booted ? "live" : "booting"}
        </div>
      </div>
      <div className="relative h-[360px] overflow-x-auto overflow-y-hidden bg-[oklch(0.13_0.008_250)] p-5 font-mono text-[12.5px] leading-relaxed">
        <div className="flex h-full min-w-max flex-col justify-end gap-[3px]">
          {lines.map((l, i) => {
            const age = lines.length - 1 - i;
            const opacity = Math.max(0.3, 1 - age * 0.055);
            return (
              <div
                key={l.id}
                className="animate-orbit-log-in flex items-baseline gap-3 whitespace-nowrap"
                style={{ opacity }}
              >
                {l.ts && <span className="w-[62px] shrink-0 text-muted-foreground/50">{l.ts}</span>}
                {!l.ts && <span className="w-[62px] shrink-0" />}
                <span className={`w-3 shrink-0 ${toneClass[l.tone]}`}>{toneGlyph[l.tone]}</span>
                <span className={toneClass[l.tone]}>
                  {l.text}
                  {l.typing && (
                    <span className="ml-0.5 inline-block h-3 w-1.5 -mb-0.5 bg-signal animate-orbit-blink" />
                  )}
                </span>
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
