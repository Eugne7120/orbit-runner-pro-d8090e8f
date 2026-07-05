import type * as React from "react";

/**
 * 0RBIT — Runtime feature cards
 * Compact, hover-active cards that sit beside the runtime chat preview.
 */

type Feature = {
  eyebrow: string;
  title: string;
  description: string;
  icon: (props: { className?: string }) => React.ReactElement;
};

function IconApi({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 8h16M4 16h16M9 4v16M15 4v16"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconStream({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M3 8c3 0 3 3 6 3s3-3 6-3 3 3 6 3M3 16c3 0 3-3 6-3s3 3 6 3 3-3 6-3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconEye({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
function IconMesh({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="12" cy="12" rx="4" ry="9" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3 12h18" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
function IconShield({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6l8-3z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconBolt({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M13 3L5 14h6l-1 7 8-11h-6l1-7z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const FEATURES: Feature[] = [
  {
    eyebrow: "compat",
    title: "OpenAI compatible",
    description: "Same client, same schema. Point your SDK at orbit — nothing else changes.",
    icon: IconApi,
  },
  {
    eyebrow: "stream",
    title: "Streaming responses",
    description: "Tokens flow from the first millisecond. No polling, no wait for the full body.",
    icon: IconStream,
  },
  {
    eyebrow: "vision",
    title: "Vision ready",
    description: "Multimodal on the same endpoint. Send images alongside text with one call.",
    icon: IconEye,
  },
  {
    eyebrow: "mesh",
    title: "Global worker network",
    description: "214 workers across 12 regions. Requests land on the closest healthy node.",
    icon: IconMesh,
  },
  {
    eyebrow: "privacy",
    title: "Privacy first",
    description: "Prompts and completions are never persisted. Zero retention by default.",
    icon: IconShield,
  },
  {
    eyebrow: "routing",
    title: "Low-latency routing",
    description: "The router scores every path per call. You always get the fastest live worker.",
    icon: IconBolt,
  },
];

export function RuntimeFeatures() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      {FEATURES.map((f) => (
        <div
          key={f.title}
          className="group relative overflow-hidden rounded-2xl border border-border bg-surface/40 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface/70"
        >
          {/* Subtle signal wash on hover */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(120% 60% at 0% 0%, oklch(0.78 0.14 232 / 0.10), transparent 60%)",
            }}
          />
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background/50 text-signal transition-transform duration-300 group-hover:scale-105">
              <f.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                / {f.eyebrow}
              </div>
              <div className="mt-0.5 text-[14px] font-medium text-foreground/95">{f.title}</div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
                {f.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
