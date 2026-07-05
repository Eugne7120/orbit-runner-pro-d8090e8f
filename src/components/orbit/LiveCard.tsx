import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export function LiveCard({
  eyebrow,
  title,
  description,
  children,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}) {
  // Random-but-stable float offset so cards don't drift in lockstep
  const delay = useMemo(() => `-${Math.floor(Math.random() * 12)}s`, []);
  const dur = useMemo(() => `${14 + Math.floor(Math.random() * 6)}s`, []);
  return (
    <div
      className={`orbit-float group relative overflow-hidden rounded-2xl border border-border bg-surface/50 p-6 transition-all duration-500 hover:border-border-strong hover:bg-surface ${className}`}
      style={{ animationDelay: delay, animationDuration: dur }}
    >
      {/* Ambient sheen on hover */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="pointer-events-none absolute -inset-x-8 -top-24 h-40 rotate-[8deg] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100" />
      {eyebrow && (
        <div className="mb-3 flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-full bg-signal/50 animate-orbit-ping" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-signal" />
          </span>
          {eyebrow}
        </div>
      )}
      <h3 className="font-display text-lg font-medium tracking-tight text-foreground">{title}</h3>
      {description && (
        <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">{description}</p>
      )}
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}

/** Small always-running metric strip with an easing between values. */
export function LiveMetric({
  label,
  base,
  unit = "ms",
}: {
  label: string;
  base: number;
  unit?: string;
}) {
  const [v, setV] = useState(base);
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    const t = setInterval(() => {
      const next = base + Math.round((Math.random() - 0.5) * base * 0.16);
      setV(next);
      setFlash(true);
      setTimeout(() => setFlash(false), 320);
    }, 1400);
    return () => clearInterval(t);
  }, [base]);
  return (
    <div className="flex items-baseline justify-between border-t border-border py-2 first:border-t-0">
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
      <span
        className={`font-mono text-[13px] tabular-nums transition-colors duration-300 ${
          flash ? "text-signal" : "text-foreground"
        }`}
      >
        {v}
        <span className="ml-0.5 text-muted-foreground">{unit}</span>
      </span>
    </div>
  );
}

export function MiniSparkline({ color = "signal" }: { color?: "signal" | "muted" }) {
  const [pts, setPts] = useState<number[]>(() =>
    Array.from({ length: 32 }, () => 20 + Math.random() * 20),
  );
  useEffect(() => {
    const t = setInterval(() => {
      setPts((p) => [...p.slice(1), 20 + Math.random() * 20]);
    }, 700);
    return () => clearInterval(t);
  }, []);
  const stroke = color === "signal" ? "oklch(0.78 0.14 232)" : "oklch(0.55 0.01 250)";
  const d = pts
    .map((y, i) => `${i === 0 ? "M" : "L"}${(i / (pts.length - 1)) * 100},${50 - y}`)
    .join(" ");
  const lastX = 100;
  const lastY = 50 - pts[pts.length - 1];
  return (
    <svg viewBox="0 0 100 50" className="h-16 w-full overflow-visible">
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
      <path d={`${d} L100,50 L0,50 Z`} fill={stroke} opacity="0.08" />
      <circle cx={lastX} cy={lastY} r="1.6" fill={stroke}>
        <animate attributeName="r" values="1.6;3;1.6" dur="1.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.4;1" dur="1.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
