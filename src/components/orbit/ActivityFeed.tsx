import { useEffect, useRef, useState } from "react";

/**
 * Live activity feed — continuously rotating worker/network events.
 * Newest entries enter at the bottom and drift upward, fading as they age.
 */

type Kind = "connect" | "complete" | "assign" | "reward" | "upgrade" | "sync" | "offline";

type Event = { id: number; kind: Kind; text: string; ts: string };

const HEX = "0123456789abcdef";
const rand = (n: number) => Math.floor(Math.random() * n);
const hex = (n: number) => Array.from({ length: n }, () => HEX[rand(16)]).join("");
const pad2 = (n: number) => String(n).padStart(2, "0");

function nowTs() {
  const d = new Date();
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

const REGIONS = ["us-west-2", "us-east-1", "eu-west-1", "eu-central-1", "ap-northeast-1", "ap-southeast-1", "sa-east-1"];
const GPUS = ["H100", "A100", "RTX 4090", "L40S", "RTX 5090"];

const TEMPLATES: { kind: Kind; text: () => string }[] = [
  { kind: "connect", text: () => `Worker wrk_${hex(4)} connected · ${REGIONS[rand(REGIONS.length)]}` },
  { kind: "complete", text: () => `Inference completed · ${240 + rand(1600)} tokens · ${28 + rand(180)}ms` },
  { kind: "assign", text: () => `Job assigned to wrk_${hex(4)} · ${GPUS[rand(GPUS.length)]}` },
  { kind: "reward", text: () => `Reward distributed · 0.0${rand(90)} cr → wrk_${hex(4)}` },
  { kind: "upgrade", text: () => `Worker wrk_${hex(4)} upgraded · driver v${1 + rand(3)}.${rand(9)}.${rand(9)}` },
  { kind: "sync", text: () => `Node synchronized · ${REGIONS[rand(REGIONS.length)]} · quorum ok` },
  { kind: "offline", text: () => `Worker wrk_${hex(4)} went idle · ${REGIONS[rand(REGIONS.length)]}` },
];

const KIND_STYLE: Record<Kind, { dot: string; label: string }> = {
  connect: { dot: "bg-signal", label: "connect" },
  complete: { dot: "bg-emerald-300", label: "inference" },
  assign: { dot: "bg-amber-300", label: "assign" },
  reward: { dot: "bg-signal", label: "reward" },
  upgrade: { dot: "bg-muted-foreground", label: "upgrade" },
  sync: { dot: "bg-emerald-300", label: "sync" },
  offline: { dot: "bg-muted-foreground", label: "idle" },
};

const MAX = 9;

export function ActivityFeed({ className = "" }: { className?: string }) {
  const seed = useRef(0);
  const [events, setEvents] = useState<Event[]>(() =>
    Array.from({ length: 6 }).map(() => {
      const t = TEMPLATES[rand(TEMPLATES.length)];
      return { id: seed.current++, kind: t.kind, text: t.text(), ts: nowTs() };
    }),
  );

  useEffect(() => {
    const t = setInterval(() => {
      const tpl = TEMPLATES[rand(TEMPLATES.length)];
      setEvents((prev) => {
        const next = [...prev, { id: seed.current++, kind: tpl.kind, text: tpl.text(), ts: nowTs() }];
        return next.length > MAX ? next.slice(next.length - MAX) : next;
      });
    }, 1500 + Math.random() * 900);
    return () => clearInterval(t);
  }, []);

  return (
    <div className={`glass-strong overflow-hidden rounded-2xl shadow-elegant ${className}`}>
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
          / live activity
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-muted-foreground">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-full bg-signal/60 animate-orbit-ping" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-signal" />
          </span>
          streaming
        </div>
      </div>
      <div className="relative h-[320px] overflow-hidden p-3">
        <div className="flex h-full flex-col justify-end gap-1">
          {events.map((e, i) => {
            const age = events.length - 1 - i;
            const opacity = Math.max(0.28, 1 - age * 0.11);
            const style = KIND_STYLE[e.kind];
            return (
              <div
                key={e.id}
                className="animate-orbit-log-in flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-surface"
                style={{ opacity }}
              >
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`} />
                <span className="min-w-[46px] shrink-0 font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted-foreground/70 sm:min-w-[64px]">
                  {style.label}
                </span>
                <span className="min-w-0 flex-1 truncate text-[13px] text-foreground/90">{e.text}</span>
                <span className="hidden shrink-0 font-mono text-[10.5px] tabular-nums text-muted-foreground/60 sm:inline">{e.ts}</span>
              </div>
            );
          })}
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[oklch(0.175_0.01_250)] to-transparent" />
      </div>
    </div>
  );
}
