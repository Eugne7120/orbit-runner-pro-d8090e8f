import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/orbit/PageShell";
import { PageHeader } from "@/components/orbit/PageHeader";
import { Section } from "@/components/orbit/Section";
import { BootTerminal } from "@/components/orbit/BootTerminal";
import { CodeBlock } from "@/components/orbit/CodeBlock";
import { SDKGraph } from "@/components/orbit/SDKGraph";
import { MetricTile } from "@/components/orbit/MetricTile";
import { PageBackground } from "@/components/orbit/PageBackground";
import { StatusPill } from "@/components/orbit/StatusPill";
import { ApiCodeDemo } from "@/components/orbit/ApiCodeDemo";
import { EndpointCards } from "@/components/orbit/EndpointCards";
import { ApiWorkflow } from "@/components/orbit/ApiWorkflow";
import { DocsShell } from "@/components/orbit/DocsShell";

export const Route = createFileRoute("/developers")({
  head: () => ({
    meta: [
      { title: "Developers — 0RBIT" },
      { name: "description", content: "The complete developer portal — SDKs, docs, playground, runtime, deployment." },
      { property: "og:title", content: "Developers — 0RBIT" },
      { property: "og:description", content: "SDKs, docs, playground, runtime." },
    ],
  }),
  component: DevPage,
});

const sdks = [
  { name: "TypeScript", cmd: "bun add @orbit/sdk", version: "1.4.2" },
  { name: "Python", cmd: "pip install orbit-sdk", version: "1.4.0" },
  { name: "Go", cmd: "go get github.com/orbit/sdk-go", version: "0.9.1" },
  { name: "Rust", cmd: "cargo add orbit-sdk", version: "0.8.0" },
  { name: "Swift", cmd: "spm: orbit-sdk-swift", version: "0.6.0" },
  { name: "Kotlin", cmd: "impl 'dev.orbit:sdk:0.5.0'", version: "0.5.0" },
];

const models = [
  { id: "orbit-1", ctx: "128k", tps: "180", price: "$0.42", tag: "flagship" },
  { id: "orbit-1-mini", ctx: "64k", tps: "320", price: "$0.12", tag: "fast" },
  { id: "orbit-1-long", ctx: "1M", tps: "84", price: "$1.10", tag: "long" },
  { id: "embed-1", ctx: "8k", tps: "—", price: "$0.03", tag: "embed" },
  { id: "image-1", ctx: "—", tps: "—", price: "$0.004/img", tag: "image" },
  { id: "vision-1", ctx: "128k", tps: "140", price: "$0.62", tag: "vision" },
];

function DevPage() {
  return (
    <PageShell>
      <PageBackground variant="code" />
      <PageHeader
        eyebrow="/ developers"
        title="Built for the person on the keyboard."
        intro="Every choice we make is a choice a developer will feel — SDK ergonomics, error shapes, log formats, receipt structure. Nothing shipped to make a chart, everything shipped to make a shift."
      />

      {/* Why */}
      <Section eyebrow="/ why · build on 0rbit" title="A runtime that argues for itself.">
        <div className="grid gap-3 md:grid-cols-4">
          {[
            { k: "OpenAI-shape", v: "Drop-in", h: "Same endpoints, same SDK shape. Change the base URL." },
            { k: "Streams first", v: "SSE", h: "Streaming is on by default. First token in 38ms." },
            { k: "Every language", v: "6 SDKs", h: "TS, Python, Go, Rust, Swift, Kotlin." },
            { k: "Receipts", v: "Signed", h: "Every request produces a verifiable proof of work." },
          ].map((r) => (
            <div key={r.k} className="rounded-2xl border border-border bg-surface/40 p-5">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">{r.k}</div>
              <div className="mt-3 font-display text-2xl tracking-tight">{r.v}</div>
              <div className="mt-1.5 text-[13px] text-muted-foreground">{r.h}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Quickstart */}
      <Section eyebrow="/ quickstart" title="From zero to streaming in 90 seconds." intro="A live terminal boots the runtime, then monitors it. Follow the numbered steps on the right.">
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <BootTerminal />
          </div>
          <div className="grid gap-4 lg:col-span-2">
            <StepCard n="1" title="Install">
              <CodeBlock tabs={[{ label: "bun", code: "bun add @orbit/sdk" }, { label: "pip", code: "pip install orbit-sdk" }]} />
            </StepCard>
            <StepCard n="2" title="Auth">
              <CodeBlock tabs={[{ label: "cli", code: "orbit login\norbit keys create prod" }]} />
            </StepCard>
            <StepCard n="3" title="Ship">
              <CodeBlock tabs={[{ label: "cli", code: `orbit chat "hello, runtime"` }]} />
            </StepCard>
          </div>
        </div>
      </Section>

      {/* API workflow */}
      <Section
        eyebrow="/ workflow"
        title="One call. Five stops. Milliseconds."
        intro="A request enters the gateway, gets scored, warms a worker, streams back. Nothing between your code and the model that isn't earning its ms."
      >
        <ApiWorkflow />
      </Section>

      {/* API — request/response demo with language tabs */}
      <Section
        eyebrow="/ api"
        title="POST once. Stream forever."
        intro="A live request in the language you already write in. The response streams beside it, exactly like production."
      >
        <ApiCodeDemo />
      </Section>

      {/* Endpoints */}
      <Section
        eyebrow="/ endpoints"
        title="The surface, in six cards."
        intro="Every major endpoint on the runtime. Same auth, same envelope, same receipt."
      >
        <EndpointCards />
      </Section>

      {/* Docs */}
      <Section
        eyebrow="/ docs"
        title="A reference that stays out of the way."
        intro="Search by shape, not by page. Every endpoint, every error, every SDK — one keystroke away."
      >
        <DocsShell />
      </Section>

      {/* Streaming */}
      <Section eyebrow="/ streaming" title="Streaming, without ceremony." intro="Async iterables. Tools that stream. Backpressure the runtime respects.">
        <div className="grid gap-6 lg:grid-cols-2">
          <CodeBlock
            filename="stream.ts"
            tabs={[
              {
                label: "TypeScript",
                lang: "ts",
                code: `const stream = await orbit.chat.stream({
  model: "orbit-1",
  messages,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.delta ?? "");
}

const receipt = await stream.receipt();
console.log(receipt.worker, receipt.credits);`,
              },
              {
                label: "Python",
                lang: "py",
                code: `stream = orbit.chat.stream(
    model="orbit-1",
    messages=messages,
)

for chunk in stream:
    print(chunk.delta, end="", flush=True)

print(stream.receipt().worker)`,
              },
            ]}
          />
          <div className="grid grid-cols-2 gap-3">
            <MetricTile label="TTFT · p50" base={38} unit="ms" seed={1} />
            <MetricTile label="Tokens / s · p50" base={182} seed={2} chartColor="warm" />
            <MetricTile label="TTFT · p99" base={112} unit="ms" seed={3} chartColor="muted" />
            <MetricTile label="Stream complete · p50" base={620} unit="ms" seed={4} />
          </div>
        </div>
      </Section>

      {/* SDK architecture */}
      <Section eyebrow="/ architecture" title="How your call reaches a worker." intro="Every layer between your code and the model. Nothing hidden.">
        <div className="glass-strong rounded-3xl p-6 shadow-elegant md:p-8">
          <SDKGraph />
        </div>
      </Section>

      {/* Models */}
      <Section eyebrow="/ models" title="What the network runs." intro="Prices are per 1M tokens unless noted. Same endpoint, different worker.">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface/40">
          <div className="grid grid-cols-[1.2fr_0.7fr_0.7fr_0.9fr_0.7fr] gap-4 border-b border-border px-5 py-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
            <span>model</span>
            <span>context</span>
            <span>tok/s</span>
            <span>price</span>
            <span>tag</span>
          </div>
          {models.map((m) => (
            <div key={m.id} className="grid grid-cols-[1.2fr_0.7fr_0.7fr_0.9fr_0.7fr] gap-4 border-t border-border/60 px-5 py-3 font-mono text-[12.5px] transition-colors hover:bg-surface first:border-t-0">
              <span className="text-foreground">{m.id}</span>
              <span className="text-muted-foreground">{m.ctx}</span>
              <span className="text-muted-foreground tabular-nums">{m.tps}</span>
              <span className="text-signal tabular-nums">{m.price}</span>
              <span className="text-muted-foreground">{m.tag}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* SDK languages */}
      <Section eyebrow="/ sdks" title="Every language your stack speaks.">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {sdks.map((s) => (
            <div key={s.name} className="group rounded-xl border border-border bg-surface/40 p-5 transition-all hover:border-border-strong hover:bg-surface">
              <div className="flex items-center justify-between">
                <div className="font-display text-lg tracking-tight">{s.name}</div>
                <span className="font-mono text-[10.5px] text-muted-foreground">v{s.version}</span>
              </div>
              <pre className="mt-3 overflow-hidden rounded-lg border border-border bg-[oklch(0.13_0.008_250)] px-3 py-2 font-mono text-[11.5px] text-foreground/80">
                {s.cmd}
              </pre>
            </div>
          ))}
        </div>
      </Section>

      {/* Deploy */}
      <Section eyebrow="/ deploy" title="Ships anywhere your code ships." intro="No sidecars. No agents. HTTPS, a key, and a network.">
        <div className="grid gap-3 md:grid-cols-4">
          {["Vercel", "Cloudflare", "Fly.io", "AWS · Lambda", "Kubernetes", "Bare metal", "Local dev", "Edge functions"].map((p) => (
            <div key={p} className="flex items-center justify-between rounded-xl border border-border bg-surface/40 px-4 py-3.5 transition-all hover:border-border-strong hover:bg-surface">
              <span className="text-[14px] text-foreground/90">{p}</span>
              <StatusPill status="operational" label="supported" />
            </div>
          ))}
        </div>
      </Section>

      {/* Best practices */}
      <Section eyebrow="/ production" title="Best practices, from operators." intro="What our largest customers do. What we do ourselves.">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { t: "Pin a region only when you must.", b: "The router is usually smarter than you. Let it move traffic." },
            { t: "Set credit budgets per key.", b: "Never let a bug melt your bill. Every key has a hard cap." },
            { t: "Verify receipts async.", b: "Don't block a response on settlement. The receipt is always available." },
            { t: "Retry on 429, not on 500.", b: "5xx is us. 429 is you. Backoff differently." },
            { t: "Stream everything.", b: "TTFT is the felt latency. Streaming halves it for your users." },
            { t: "Log the worker ID.", b: "When something is off, we ask which worker. Give the answer immediately." },
          ].map((p) => (
            <div key={p.t} className="rounded-2xl border border-border bg-surface/40 p-5 transition-all hover:border-border-strong hover:bg-surface">
              <div className="font-display text-[16px] tracking-tight text-foreground">{p.t}</div>
              <div className="mt-1.5 text-[14px] text-muted-foreground">{p.b}</div>
            </div>
          ))}
        </div>
      </Section>


      {/* Live developer metrics */}
      <Section
        eyebrow="/ live"
        title="What the network is doing right now."
      >
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <MetricTile label="avg latency" base={41} unit="ms" seed={41} />
          <MetricTile label="api uptime" base={99.994} format={(n) => `${n.toFixed(3)}%`} chart={false} hint="rolling 30d" />
          <MetricTile label="workers online" base={214} variance={0.02} seed={42} />
          <MetricTile label="requests · today" base={1.84} variance={0.06} format={(n) => `${n.toFixed(2)}m`} seed={43} chartColor="warm" />
          <MetricTile label="streaming · now" base={318} variance={0.12} seed={44} chartColor="signal" />
        </div>
      </Section>

      {/* Developer CTA */}
      <Section eyebrow="/ next">
        <div className="glass-strong relative overflow-hidden rounded-3xl p-8 shadow-elegant md:p-12">
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-50"
            style={{
              background:
                "radial-gradient(60% 80% at 20% 0%, oklch(0.78 0.14 232 / 0.30), transparent 60%)",
            }}
          />
          <div className="max-w-2xl">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              ready to ship
            </div>
            <h2 className="mt-3 font-display text-3xl tracking-[-0.03em] md:text-4xl">
              Start building on the runtime.
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground md:text-[16px]">
              A key, a base URL, an SDK. That's it. Move your first request in an afternoon, then keep the same code as you scale to millions.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/developers"
              className="btn-sheen group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[14px] font-medium text-background transition-all duration-300 hover:scale-[1.01] hover:bg-foreground/90"
            >
              Start building
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
            <Link
              to="/docs"
              className="group inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/50 px-5 py-2.5 text-[14px] text-foreground/90 transition-all hover:bg-surface"
            >
              View documentation
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
            <Link
              to="/pricing"
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface/30 px-5 py-2.5 text-[14px] text-foreground/90 transition-all hover:border-border-strong hover:bg-surface/50"
            >
              Get an API key
            </Link>
            <Link
              to="/product"
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface/30 px-5 py-2.5 text-[14px] text-foreground/90 transition-all hover:border-border-strong hover:bg-surface/50"
            >
              Explore examples
            </Link>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}

function StepCard({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-signal/40 bg-signal/10 font-mono text-[11px] text-signal">
          {n}
        </span>
        <span className="font-display text-[14px] tracking-tight">{title}</span>
      </div>
      {children}
    </div>
  );
}
