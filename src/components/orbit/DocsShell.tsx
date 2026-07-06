import { useState } from "react";

/**
 * Documentation sidebar mock (UI only).
 * Sticky column of nav items paired with a preview of the selected article.
 */

type DocSection = { group: string; items: { id: string; label: string; badge?: string }[] };

const SECTIONS: DocSection[] = [
  {
    group: "Get started",
    items: [
      { id: "intro", label: "Introduction" },
      { id: "auth", label: "Authentication" },
      { id: "quick", label: "Quick start", badge: "new" },
    ],
  },
  {
    group: "API reference",
    items: [
      { id: "chat", label: "Chat API" },
      { id: "image", label: "Image API" },
      { id: "embed", label: "Embeddings" },
      { id: "models", label: "Models" },
    ],
  },
  {
    group: "Runtime",
    items: [
      { id: "workers", label: "Workers" },
      { id: "receipts", label: "Receipts" },
      { id: "errors", label: "Errors" },
    ],
  },
  {
    group: "SDK",
    items: [
      { id: "sdk", label: "SDK overview" },
      { id: "examples", label: "Examples" },
    ],
  },
];

const CONTENT: Record<string, { title: string; kicker: string; body: string; code?: string }> = {
  intro: {
    title: "Introduction",
    kicker: "1 min read",
    body: "0RBIT is a distributed runtime for AI inference. One endpoint routes every request to the best-fitting worker across a global mesh, streams tokens back, and settles usage invisibly.",
  },
  auth: {
    title: "Authentication",
    kicker: "bearer tokens",
    body: "Every request carries an API key in the Authorization header. Keys are scoped to a workspace and can be capped per second, per day, or by hard credit budget.",
    code: `Authorization: Bearer orb_live_9f2a…`,
  },
  quick: {
    title: "Quick start",
    kicker: "90 seconds to first token",
    body: "Install the SDK, set your key, send a streaming chat completion. The response starts arriving before the model finishes composing it.",
    code: `bun add @orbit/sdk
export ORBIT_API_KEY=orb_live_…`,
  },
  chat: {
    title: "Chat API",
    kicker: "POST /v1/chat/completions",
    body: "OpenAI-compatible chat endpoint. Streaming is on by default. Tools, JSON mode and multi-turn context are all supported.",
  },
  image: {
    title: "Image API",
    kicker: "POST /v1/images/generations",
    body: "Text-to-image, routed to workers with image-capable GPUs. Returns a signed URL and a receipt.",
  },
  embed: {
    title: "Embeddings",
    kicker: "POST /v1/embeddings",
    body: "Batched, deduped and cached at the gateway. Latency stays flat as batch size grows.",
  },
  models: {
    title: "Models",
    kicker: "GET /v1/models",
    body: "The live catalog. Fields include context window, tokens-per-second, price per million tokens, and current network availability.",
  },
  workers: {
    title: "Workers",
    kicker: "GET /v1/workers",
    body: "Every worker on the network with region, GPU class, current queue depth and reliability score.",
  },
  receipts: {
    title: "Receipts",
    kicker: "signed proofs",
    body: "Every request produces a signed receipt. Verify off the hot path; never block a response on settlement.",
  },
  errors: {
    title: "Errors",
    kicker: "one envelope",
    body: "All failures share one shape: code, name, message, retry_after_ms, request_id and worker (when applicable).",
  },
  sdk: {
    title: "SDK overview",
    kicker: "6 languages",
    body: "TypeScript, Python, Go, Rust, Swift, Kotlin. All maintained in lock-step, all OpenAI-compatible surface, all with typed streaming.",
  },
  examples: {
    title: "Examples",
    kicker: "recipes",
    body: "End-to-end code for chat, streaming, tool calling, embeddings, image generation and receipt verification.",
  },
};

export function DocsShell() {
  const [active, setActive] = useState("quick");
  const doc = CONTENT[active];

  return (
    <div className="glass-strong grid grid-cols-1 gap-0 overflow-hidden rounded-2xl md:grid-cols-[220px_1fr]">
      {/* Sidebar */}
      <nav className="border-b border-border bg-surface/40 p-3 md:border-b-0 md:border-r">
        <div className="mb-2 px-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          / docs
        </div>
        <div className="space-y-4">
          {SECTIONS.map((sec) => (
            <div key={sec.group}>
              <div className="mb-1 px-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
                {sec.group}
              </div>
              <ul className="space-y-0.5">
                {sec.items.map((item) => {
                  const on = item.id === active;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => setActive(item.id)}
                        className={`group flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[12.5px] transition-all ${
                          on
                            ? "bg-foreground/[0.06] text-foreground"
                            : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground/90"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={`h-1 w-1 rounded-full transition-colors ${
                              on ? "bg-signal shadow-[0_0_6px] shadow-signal" : "bg-transparent"
                            }`}
                          />
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="rounded-full border border-signal/40 px-1.5 py-0 font-mono text-[9px] uppercase tracking-[0.14em] text-signal">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* Article preview */}
      <article key={active} className="animate-orbit-fade-up min-h-[320px] p-6 md:p-8">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          {doc.kicker}
        </div>
        <h3 className="mt-2 font-display text-[22px] tracking-tight text-foreground">
          {doc.title}
        </h3>
        <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
          {doc.body}
        </p>
        {doc.code && (
          <pre className="mt-5 max-w-xl overflow-x-auto rounded-lg border border-border bg-[oklch(0.13_0.008_250)] p-3 font-mono text-[12.5px] text-foreground/90">
            {doc.code}
          </pre>
        )}
        <div className="mt-6 flex items-center gap-3 font-mono text-[10.5px] text-muted-foreground/80">
          <span className="rounded-full border border-border px-2 py-0.5">← previous</span>
          <span className="rounded-full border border-border px-2 py-0.5">next →</span>
        </div>
      </article>
    </div>
  );
}
