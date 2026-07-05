import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/orbit/PageShell";
import { PageBackground } from "@/components/orbit/PageBackground";
import { CodeBlock } from "@/components/orbit/CodeBlock";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Docs — 0RBIT" },
      { name: "description", content: "The complete reference for the 0RBIT runtime. Quickstart, API, streaming, workers, errors, changelog." },
      { property: "og:title", content: "Docs — 0RBIT" },
      { property: "og:description", content: "The complete reference for the 0RBIT runtime." },
    ],
  }),
  component: DocsPage,
});

const NAV: { group: string; items: { label: string; slug: string; active?: boolean }[] }[] = [
  {
    group: "Get started",
    items: [
      { label: "Quickstart", slug: "quickstart", active: true },
      { label: "Installation", slug: "installation" },
      { label: "Authentication", slug: "auth" },
      { label: "Credits & billing", slug: "credits" },
    ],
  },
  {
    group: "Core APIs",
    items: [
      { label: "Chat", slug: "chat" },
      { label: "Streaming", slug: "streaming" },
      { label: "Embeddings", slug: "embeddings" },
      { label: "Images", slug: "images" },
      { label: "Vision", slug: "vision" },
    ],
  },
  {
    group: "Runtime",
    items: [
      { label: "Routing", slug: "routing" },
      { label: "Workers", slug: "workers" },
      { label: "Receipts", slug: "receipts" },
      { label: "Rate limits", slug: "rate-limits" },
    ],
  },
  {
    group: "SDKs",
    items: [
      { label: "TypeScript", slug: "sdk-ts" },
      { label: "Python", slug: "sdk-py" },
      { label: "Go", slug: "sdk-go" },
      { label: "Rust", slug: "sdk-rs" },
    ],
  },
  {
    group: "Reference",
    items: [
      { label: "OpenAPI", slug: "openapi" },
      { label: "Errors", slug: "errors" },
      { label: "Changelog", slug: "changelog" },
    ],
  },
];

const TOC = [
  { id: "install", label: "Install the SDK" },
  { id: "auth", label: "Authenticate" },
  { id: "first", label: "Your first request" },
  { id: "stream", label: "Stream tokens" },
  { id: "receipt", label: "Read the receipt" },
  { id: "next", label: "Next steps" },
];

function DocsPage() {
  return (
    <PageShell>
      <PageBackground variant="code" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 pt-8 md:pt-16 lg:grid-cols-[240px_1fr_200px]">
        {/* SIDEBAR */}
        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <div className="mb-4 flex items-center gap-2">
              <input
                readOnly
                placeholder="Search docs · ⌘K"
                className="w-full rounded-lg border border-border bg-surface/50 px-3 py-2 font-mono text-[11.5px] text-muted-foreground placeholder:text-muted-foreground/50 focus:border-border-strong focus:outline-none"
              />
            </div>
            <nav className="space-y-6">
              {NAV.map((g) => (
                <div key={g.group}>
                  <div className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
                    {g.group}
                  </div>
                  <ul className="space-y-0.5">
                    {g.items.map((it) => (
                      <li key={it.slug}>
                        <a
                          href="#"
                          className={`block rounded-md px-2 py-1 text-[13px] transition-colors ${
                            it.active
                              ? "bg-surface text-foreground"
                              : "text-muted-foreground hover:bg-surface/40 hover:text-foreground"
                          }`}
                        >
                          {it.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="min-w-0">
          <div className="mb-6 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            docs · get started
          </div>
          <h1 className="font-display text-4xl font-medium tracking-[-0.03em] md:text-5xl">
            Quickstart
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-[16px] leading-relaxed text-muted-foreground md:text-[17px]">
            From an empty terminal to a streaming response in under two minutes.
            Every example below runs against the live runtime.
          </p>

          <section id="install" className="mt-14 scroll-mt-32">
            <h2 className="font-display text-2xl tracking-tight md:text-3xl">Install the SDK</h2>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              Pick your language. All SDKs share the same shape and streaming semantics.
            </p>
            <div className="mt-5">
              <CodeBlock
                filename="install"
                tabs={[
                  { label: "bun", code: "bun add @orbit/sdk" },
                  { label: "npm", code: "npm install @orbit/sdk" },
                  { label: "pnpm", code: "pnpm add @orbit/sdk" },
                  { label: "pip", code: "pip install orbit-sdk" },
                ]}
              />
            </div>
          </section>

          <section id="auth" className="mt-14 scroll-mt-32">
            <h2 className="font-display text-2xl tracking-tight md:text-3xl">Authenticate</h2>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              Create a key with the CLI, or paste it directly in your environment.
              Keys are workspace-scoped and revocable.
            </p>
            <div className="mt-5">
              <CodeBlock
                tabs={[
                  { label: "cli", code: `orbit login\norbit keys create prod\n# export ORBIT_API_KEY=sk_live_...` },
                  { label: "env", code: `# .env\nORBIT_API_KEY=sk_live_...` },
                ]}
              />
            </div>
          </section>

          <section id="first" className="mt-14 scroll-mt-32">
            <h2 className="font-display text-2xl tracking-tight md:text-3xl">Your first request</h2>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              A single call. The runtime chooses the worker, the region, and the path.
            </p>
            <div className="mt-5">
              <CodeBlock
                filename="hello.ts"
                tabs={[
                  {
                    label: "TypeScript",
                    lang: "ts",
                    code: `import { Orbit } from "@orbit/sdk";

const orbit = new Orbit({ apiKey: process.env.ORBIT_API_KEY! });

const res = await orbit.chat.create({
  model: "orbit-1",
  messages: [{ role: "user", content: "hello, runtime" }],
});

console.log(res.output_text);`,
                  },
                  {
                    label: "Python",
                    lang: "py",
                    code: `from orbit import Orbit

orbit = Orbit()

res = orbit.chat.create(
    model="orbit-1",
    messages=[{"role": "user", "content": "hello, runtime"}],
)

print(res.output_text)`,
                  },
                  {
                    label: "curl",
                    lang: "sh",
                    code: `curl https://api.0rbit.dev/v1/chat/completions \\
  -H "Authorization: Bearer $ORBIT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"orbit-1","messages":[{"role":"user","content":"hello"}]}'`,
                  },
                ]}
              />
            </div>
          </section>

          <section id="stream" className="mt-14 scroll-mt-32">
            <h2 className="font-display text-2xl tracking-tight md:text-3xl">Stream tokens</h2>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              Streaming is on by default when you pass <code className="rounded bg-surface px-1 text-[13px] text-foreground">stream: true</code>. The
              runtime pushes tokens over server-sent events; the SDK exposes them as an async iterable.
            </p>
            <div className="mt-5">
              <CodeBlock
                filename="stream.ts"
                tabs={[
                  {
                    label: "TypeScript",
                    lang: "ts",
                    code: `const stream = await orbit.chat.stream({
  model: "orbit-1",
  messages: [{ role: "user", content: "write a haiku" }],
});

for await (const chunk of stream) {
  process.stdout.write(chunk.delta ?? "");
}`,
                  },
                ]}
              />
            </div>
          </section>

          <section id="receipt" className="mt-14 scroll-mt-32">
            <h2 className="font-display text-2xl tracking-tight md:text-3xl">Read the receipt</h2>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              Every request produces a signed receipt. Use it to audit cost, worker, and region.
            </p>
            <div className="mt-5">
              <CodeBlock
                tabs={[
                  {
                    label: "response",
                    lang: "json",
                    code: `{
  "id": "req_9f2a...",
  "model": "orbit-1",
  "worker": "wrk_a19f",
  "region": "us-west-2",
  "usage": { "input_tokens": 24, "output_tokens": 118 },
  "credits": 0.0042,
  "receipt": "0x9c8f...b12a",
  "latency_ms": 342
}`,
                  },
                ]}
              />
            </div>
          </section>

          <section id="next" className="mt-14 scroll-mt-32">
            <h2 className="font-display text-2xl tracking-tight md:text-3xl">Next steps</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                { t: "Streaming", d: "SSE, chunks, backpressure." },
                { t: "Routing", d: "How the runtime chooses a worker." },
                { t: "Receipts", d: "Verify and export signed proofs." },
                { t: "Errors", d: "Every error shape, every recovery." },
              ].map((c) => (
                <a
                  key={c.t}
                  href="#"
                  className="group flex items-center justify-between rounded-xl border border-border bg-surface/40 px-4 py-3.5 transition-all hover:border-border-strong hover:bg-surface"
                >
                  <div>
                    <div className="font-display text-[15px] tracking-tight">{c.t}</div>
                    <div className="text-[13px] text-muted-foreground">{c.d}</div>
                  </div>
                  <span className="text-muted-foreground transition-transform group-hover:translate-x-0.5">→</span>
                </a>
              ))}
            </div>
          </section>

          {/* Prev / next */}
          <nav className="mt-16 flex items-center justify-between border-t border-border pt-6">
            <div className="text-muted-foreground">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em]">Previous</div>
              <div className="text-[14px]">—</div>
            </div>
            <Link
              to="/docs"
              className="text-right"
            >
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">Next</div>
              <div className="text-[14px] text-foreground">Installation →</div>
            </Link>
          </nav>
        </main>

        {/* TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <div className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
              On this page
            </div>
            <ul className="space-y-1.5 border-l border-border pl-3">
              {TOC.map((t, i) => (
                <li key={t.id}>
                  <a
                    href={`#${t.id}`}
                    className={`block text-[12.5px] transition-colors ${
                      i === 0 ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-lg border border-border bg-surface/40 p-3">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
                Edit
              </div>
              <a href="#" className="mt-1 block text-[12.5px] text-foreground hover:text-signal">
                Suggest a change →
              </a>
            </div>
          </div>
        </aside>
      </div>
      <div className="h-24" />
    </PageShell>
  );
}
