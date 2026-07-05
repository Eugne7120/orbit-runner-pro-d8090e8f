import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/orbit/PageShell";
import { PageHeader } from "@/components/orbit/PageHeader";
import { Section } from "@/components/orbit/Section";
import { BootTerminal } from "@/components/orbit/BootTerminal";
import { RequestLifecycle } from "@/components/orbit/RequestLifecycle";
import { CodeBlock } from "@/components/orbit/CodeBlock";
import { PageBackground } from "@/components/orbit/PageBackground";
import { MetricTile } from "@/components/orbit/MetricTile";

export const Route = createFileRoute("/api")({
  head: () => ({
    meta: [
      { title: "API — 0RBIT" },
      { name: "description", content: "OpenAI-compatible endpoints, streaming by default, priced per token served." },
      { property: "og:title", content: "API — 0RBIT" },
      { property: "og:description", content: "OpenAI-compatible endpoints, streaming by default." },
    ],
  }),
  component: ApiPage,
});

const endpoints = [
  { m: "POST", p: "/v1/chat/completions", d: "Chat, streaming, tools." },
  { m: "POST", p: "/v1/embeddings", d: "Batched, deduped, cached." },
  { m: "POST", p: "/v1/images/generations", d: "Routed to image-capable workers." },
  { m: "POST", p: "/v1/vision", d: "Multi-modal input, streaming output." },
  { m: "GET", p: "/v1/models", d: "Live catalog with capabilities." },
  { m: "GET", p: "/v1/workers", d: "Network-wide worker status." },
  { m: "GET", p: "/v1/receipts/:id", d: "Signed receipt for any request." },
  { m: "GET", p: "/v1/usage", d: "Credits, tokens, requests by window." },
];

const errors = [
  { code: 400, name: "bad_request", d: "The request shape or values are invalid." },
  { code: 401, name: "unauthenticated", d: "Missing or invalid API key." },
  { code: 402, name: "insufficient_credits", d: "The workspace is out of credits." },
  { code: 404, name: "not_found", d: "Model or resource unknown." },
  { code: 429, name: "rate_limited", d: "Too many requests. Backoff and retry." },
  { code: 500, name: "runtime_error", d: "Us. Automatic retry on the network." },
  { code: 503, name: "no_worker_available", d: "No worker matched. Try a different model." },
];

function ApiPage() {
  return (
    <PageShell>
      <PageBackground variant="packets" />
      <PageHeader
        eyebrow="/ api"
        title="OpenAI-shaped. 0RBIT-powered."
        intro="Swap the base URL. Keep the code. Get a distributed runtime, streaming out of the box, priced by the token served."
      />

      {/* Lifecycle */}
      <Section eyebrow="/ lifecycle" title="A single request, timed." intro="Every millisecond a request spends inside the runtime. This is the real shape.">
        <div className="glass-strong rounded-3xl p-6 shadow-elegant md:p-8">
          <RequestLifecycle />
        </div>
      </Section>

      {/* Endpoints */}
      <Section eyebrow="/ endpoints" title="All the surface, in one table.">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface/40">
          {endpoints.map((e, i) => (
            <div
              key={e.p}
              className={`grid grid-cols-[80px_1fr_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-surface ${i > 0 ? "border-t border-border" : ""}`}
            >
              <span className="font-mono text-[11px] uppercase tracking-widest text-signal">{e.m}</span>
              <span className="font-mono text-[13px] text-foreground">{e.p}</span>
              <span className="text-[13px] text-muted-foreground">{e.d}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Example request */}
      <Section eyebrow="/ example" title="Streaming, in seconds." intro="A single POST. The response starts before the model finishes.">
        <div className="grid gap-6 lg:grid-cols-2">
          <CodeBlock
            filename="chat.request"
            tabs={[
              {
                label: "curl",
                lang: "sh",
                code: `POST https://api.0rbit.dev/v1/chat/completions
Authorization: Bearer $ORBIT_API_KEY
Content-Type: application/json

{
  "model": "orbit-1",
  "stream": true,
  "messages": [
    { "role": "user", "content": "explain the runtime" }
  ]
}`,
              },
              {
                label: "TypeScript",
                lang: "ts",
                code: `const stream = await orbit.chat.stream({
  model: "orbit-1",
  messages: [{ role: "user", content: "explain the runtime" }],
});
for await (const c of stream) process.stdout.write(c.delta ?? "");`,
              },
              {
                label: "Python",
                lang: "py",
                code: `stream = orbit.chat.stream(
    model="orbit-1",
    messages=[{"role": "user", "content": "explain the runtime"}],
)
for c in stream: print(c.delta, end="", flush=True)`,
              },
            ]}
          />
          <BootTerminal />
        </div>
      </Section>

      {/* Live perf */}
      <Section eyebrow="/ performance" title="Live, network-wide.">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <MetricTile label="req · avg" base={4820} seed={31} />
          <MetricTile label="TTFT · p50" base={38} unit="ms" seed={32} chartColor="warm" />
          <MetricTile label="stream · tok/s" base={182} seed={33} />
          <MetricTile label="errors · 5xx / 1k" base={0.4} variance={0.5} seed={34} chartColor="muted" hint="target < 1" />
        </div>
      </Section>

      {/* Errors */}
      <Section eyebrow="/ errors" title="Every failure, named." intro="One consistent error envelope. Every code has a documented meaning and a documented recovery.">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface/40">
            {errors.map((e, i) => (
              <div key={e.code} className={`grid grid-cols-[70px_180px_1fr] items-center gap-4 px-5 py-3 font-mono text-[12.5px] transition-colors hover:bg-surface ${i > 0 ? "border-t border-border" : ""}`}>
                <span className={e.code >= 500 ? "text-rose-300" : e.code >= 400 ? "text-amber-300" : "text-signal"}>{e.code}</span>
                <span className="text-foreground">{e.name}</span>
                <span className="text-muted-foreground">{e.d}</span>
              </div>
            ))}
          </div>
          <CodeBlock
            filename="error"
            tabs={[
              {
                label: "envelope",
                lang: "json",
                code: `{
  "error": {
    "code": 429,
    "name": "rate_limited",
    "message": "Concurrency ceiling reached.",
    "retry_after_ms": 240,
    "request_id": "req_9f2a...",
    "worker": null
  }
}`,
              },
            ]}
          />
        </div>
      </Section>

      {/* Rate limits */}
      <Section eyebrow="/ rate limits" title="Predictable ceilings.">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { t: "Developer", r: "10 req / s", c: "20 concurrent" },
            { t: "Team", r: "500 req / s", c: "200 concurrent" },
            { t: "Enterprise", r: "custom", c: "custom · private lanes" },
          ].map((r) => (
            <div key={r.t} className="rounded-2xl border border-border bg-surface/40 p-6">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">{r.t}</div>
              <div className="mt-3 font-display text-2xl tracking-tight">{r.r}</div>
              <div className="mt-1 font-mono text-[11.5px] text-muted-foreground">{r.c}</div>
            </div>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
