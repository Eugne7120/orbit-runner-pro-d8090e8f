import type { ReactNode } from "react";
import { Info, Lightbulb, AlertTriangle, ArrowUpRight } from "lucide-react";

export function Note({ children, title = "Note" }: { children: ReactNode; title?: string }) {
  return (
    <div className="my-6 flex gap-3 rounded-xl border border-border bg-surface/40 p-4">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
      <div className="min-w-0">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-signal">
          {title}
        </div>
        <div className="mt-1 text-[14.5px] leading-relaxed text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}

export function Tip({ children, title = "Tip" }: { children: ReactNode; title?: string }) {
  return (
    <div className="my-6 flex gap-3 rounded-xl border border-emerald-300/20 bg-emerald-300/5 p-4">
      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300/80" />
      <div className="min-w-0">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-emerald-300/80">
          {title}
        </div>
        <div className="mt-1 text-[14.5px] leading-relaxed text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}

export function Warning({ children, title = "Warning" }: { children: ReactNode; title?: string }) {
  return (
    <div className="my-6 flex gap-3 rounded-xl border border-amber-300/20 bg-amber-300/5 p-4">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300/85" />
      <div className="min-w-0">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-amber-300/85">
          {title}
        </div>
        <div className="mt-1 text-[14.5px] leading-relaxed text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}

export function InfoCard({
  title,
  kicker,
  children,
  href,
}: {
  title: string;
  kicker?: string;
  children: ReactNode;
  href?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-surface/40 p-5 transition-all hover:border-border-strong hover:bg-surface/70">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-signal/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      {kicker && (
        <div className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          {kicker}
        </div>
      )}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-[17px] tracking-tight text-foreground">{title}</h3>
        {href && (
          <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
        )}
      </div>
      <div className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

export function CardGrid({ children }: { children: ReactNode }) {
  return <div className="my-6 grid gap-4 sm:grid-cols-2">{children}</div>;
}

/* ----------------- Tables ----------------- */

export function ApiTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: (ReactNode | string)[][];
}) {
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[520px] text-left text-[13.5px]">
        <thead>
          <tr className="border-b border-border bg-surface/40">
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-border/60 last:border-b-0">
              {r.map((c, j) => (
                <td key={j} className="px-4 py-3 align-top text-foreground/90">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const METHOD_COLORS: Record<string, string> = {
  GET: "text-emerald-300/90 border-emerald-300/30",
  POST: "text-signal border-signal/30",
  PUT: "text-amber-300/90 border-amber-300/30",
  PATCH: "text-amber-300/90 border-amber-300/30",
  DELETE: "text-destructive border-destructive/40",
};

export function Method({ method }: { method: string }) {
  const cls = METHOD_COLORS[method] ?? "text-muted-foreground border-border";
  return (
    <span
      className={`inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[10.5px] tracking-[0.08em] ${cls}`}
    >
      {method}
    </span>
  );
}

export function Endpoint({ path }: { path: string }) {
  return <code className="font-mono text-[13px] text-foreground/90">{path}</code>;
}
