import type { ReactNode } from "react";
import { CodeBlock } from "@/components/orbit/CodeBlock";
import { TypingTerminal } from "./TypingTerminal";
import { Note, Tip, Warning, InfoCard, CardGrid, ApiTable, Method, Endpoint } from "./DocsCards";
import {
  RequestFlow,
  ArchDiagram,
  WorkerSelection,
  InferencePipeline,
  StreamingProcess,
  CreditFlowDiagram,
} from "./DocsDiagrams";

export type DocPage = {
  slug: string;
  group: string;
  title: string;
  kicker: string;
  description: string;
  toc: { id: string; label: string }[];
  render: () => ReactNode;
};

/* ------------ shared primitives ------------ */

function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="mt-14 scroll-mt-32 font-display text-2xl tracking-tight text-foreground md:text-3xl"
    >
      {children}
    </h2>
  );
}

function P({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3 max-w-2xl text-pretty text-[15px] leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}

function C({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-[12.5px] text-foreground/90">
      {children}
    </code>
  );
}

/* ------------ pages ------------ */

const intro: DocPage = {
  slug: "intro",
  group: "Get started",
  title: "Introduction",
  kicker: "docs · overview",
  description:
    "0RBIT is a distributed inference runtime. One endpoint routes every request to the best-fitting worker, streams tokens back, and settles usage on a signed ledger.",
  toc: [
    { id: "what", label: "What is 0RBIT" },
    { id: "arch", label: "Architecture" },
    { id: "prin", label: "Principles" },
    { id: "next", label: "Where to next" },
  ],
  render: () => (
    <>
      <H2 id="what">What is 0RBIT</H2>
      <P>
        0RBIT exposes an OpenAI-compatible API in front of a network of independent GPU workers.
        You send a chat, embedding, or image request; the router picks the worker with the lowest
        expected cost that fits your latency and policy constraints; the response streams back over
        server-sent events; and a signed receipt records what happened.
      </P>
      <P>
        There is nothing to deploy. Point your existing SDK at <C>https://api.0rbit.dev</C>, swap
        the key, and you are running on the mesh.
      </P>

      <CardGrid>
        <InfoCard title="Global mesh" kicker="214 workers" href="#">
          Requests routed across 12 regions. Cold starts are absorbed by warm pools; p50 first-token
          is under 40 ms in-region.
        </InfoCard>
        <InfoCard title="OpenAI-compatible" kicker="drop-in" href="#">
          <C>/v1/chat/completions</C>, <C>/v1/embeddings</C>, <C>/v1/images</C>. Same request shape,
          same streaming envelope.
        </InfoCard>
        <InfoCard title="Signed receipts" kicker="auditable" href="#">
          Every request produces a hash-linked ledger entry. Verify off the hot path; never block a
          response on settlement.
        </InfoCard>
        <InfoCard title="Predictable cost" kicker="per-token" href="#">
          Prices published per model, quoted before dispatch, charged on completion. No idle GPU
          time, no minimum spend.
        </InfoCard>
      </CardGrid>

      <H2 id="arch">Architecture</H2>
      <P>
        The runtime is four layers: the edge gateway that terminates TLS and auth, the router that
        chooses a worker, the worker mesh that runs the model, and the observer that records the
        receipt.
      </P>
      <ArchDiagram />

      <H2 id="prin">Principles</H2>
      <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
        <li>
          <span className="text-foreground">One endpoint.</span> Model selection is a parameter, not
          a URL.
        </li>
        <li>
          <span className="text-foreground">Streaming by default.</span> The first token is the
          product; buffering is opt-in.
        </li>
        <li>
          <span className="text-foreground">Prove, don&apos;t promise.</span> Every response links
          to a receipt you can verify without us.
        </li>
        <li>
          <span className="text-foreground">Fail loudly.</span> One error envelope, always.
        </li>
      </ul>

      <H2 id="next">Where to next</H2>
      <CardGrid>
        <InfoCard title="Quickstart" kicker="90 seconds">
          Install the SDK, set a key, stream a completion.
        </InfoCard>
        <InfoCard title="Chat API" kicker="reference">
          Full parameter reference for chat completions.
        </InfoCard>
      </CardGrid>
    </>
  ),
};

const quickstart: DocPage = {
  slug: "quickstart",
  group: "Get started",
  title: "Quickstart",
  kicker: "docs · get started",
  description:
    "From an empty terminal to a streaming response in under two minutes. Every example runs against the live runtime.",
  toc: [
    { id: "install", label: "Install the SDK" },
    { id: "auth", label: "Authenticate" },
    { id: "first", label: "Your first request" },
    { id: "stream", label: "Stream tokens" },
    { id: "receipt", label: "Read the receipt" },
  ],
  render: () => (
    <>
      <H2 id="install">Install the SDK</H2>
      <P>Pick your language. All SDKs share the same shape and streaming semantics.</P>
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

      <H2 id="auth">Authenticate</H2>
      <P>
        Create a key with the CLI or paste one into your environment. Keys are workspace-scoped and
        revocable at any time.
      </P>
      <div className="mt-5">
        <CodeBlock
          tabs={[
            { label: "cli", code: `orbit login\norbit keys create prod\n# export ORBIT_API_KEY=sk_live_...` },
            { label: "env", code: `# .env\nORBIT_API_KEY=sk_live_...` },
          ]}
        />
      </div>

      <Note title="Key rotation">
        Rotate a key in one call — <C>orbit keys rotate prod</C>. The old key stays valid for
        60 seconds so in-flight requests finish cleanly.
      </Note>

      <H2 id="first">Your first request</H2>
      <P>A single call. The runtime chooses the worker, region, and path.</P>
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

      <H2 id="stream">Stream tokens</H2>
      <P>
        Streaming is on by default when you pass <C>stream: true</C>. Tokens arrive over
        server-sent events; the SDK exposes them as an async iterable.
      </P>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
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
        <TypingTerminal
          title="live"
          language="ts"
          snippets={[
            `const stream = await orbit.chat.stream({\n  model: "orbit-1",\n  messages: [\n    { role: "user", content: "hello" }\n  ],\n});\n\nfor await (const c of stream) {\n  process.stdout.write(c.delta);\n}`,
          ]}
        />
      </div>

      <H2 id="receipt">Read the receipt</H2>
      <P>Every request produces a signed receipt. Use it to audit cost, worker, and region.</P>
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

      <Tip>
        Every SDK exposes <C>response.receipt</C> as a string. Store it alongside your own request
        id — it is the fastest way to correlate our logs with yours.
      </Tip>
    </>
  ),
};

const auth: DocPage = {
  slug: "auth",
  group: "Get started",
  title: "Authentication",
  kicker: "security · keys",
  description:
    "API keys are bearer tokens. They are workspace-scoped, capped, revocable, and rotatable without downtime.",
  toc: [
    { id: "keys", label: "API keys" },
    { id: "header", label: "Sending the key" },
    { id: "scopes", label: "Scopes & caps" },
    { id: "rotate", label: "Rotation" },
  ],
  render: () => (
    <>
      <H2 id="keys">API keys</H2>
      <P>
        Keys are minted per workspace. Two prefixes exist: <C>sk_live_</C> for production and{" "}
        <C>sk_test_</C> for the sandbox. Test keys route to a deterministic fake worker that never
        charges credits.
      </P>

      <H2 id="header">Sending the key</H2>
      <P>All requests carry the key in the Authorization header.</P>
      <div className="mt-5">
        <CodeBlock
          tabs={[
            { label: "http", code: `Authorization: Bearer sk_live_9f2a…` },
            {
              label: "curl",
              lang: "sh",
              code: `curl -H "Authorization: Bearer $ORBIT_API_KEY" https://api.0rbit.dev/v1/models`,
            },
          ]}
        />
      </div>

      <Warning title="Never ship a key">
        Client bundles are public. If you need a key in the browser, use a proxy or a short-lived
        session token from <C>/v1/sessions</C>.
      </Warning>

      <H2 id="scopes">Scopes & caps</H2>
      <ApiTable
        headers={["Scope", "Grants", "Default"]}
        rows={[
          ["chat:write", "Chat completions & streaming", "on"],
          ["images:write", "Image generation", "off"],
          ["embed:write", "Embeddings", "on"],
          ["admin:read", "Read workspace metadata", "off"],
          ["admin:write", "Create keys, set budgets", "off"],
        ]}
      />

      <H2 id="rotate">Rotation</H2>
      <P>Rotate a key without dropping in-flight requests. The old key stays live for 60 s.</P>
      <div className="mt-5">
        <CodeBlock tabs={[{ label: "cli", code: `orbit keys rotate prod --grace 60s` }]} />
      </div>
    </>
  ),
};

const chat: DocPage = {
  slug: "chat",
  group: "Core APIs",
  title: "Chat API",
  kicker: "POST /v1/chat/completions",
  description:
    "Multi-turn chat completions with streaming, tools, JSON mode, and structured outputs. OpenAI-compatible.",
  toc: [
    { id: "ep", label: "Endpoint" },
    { id: "params", label: "Parameters" },
    { id: "resp", label: "Response" },
    { id: "codes", label: "Status codes" },
    { id: "flow", label: "Request flow" },
  ],
  render: () => (
    <>
      <H2 id="ep">Endpoint</H2>
      <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-surface/40 px-4 py-3">
        <Method method="POST" />
        <Endpoint path="/v1/chat/completions" />
      </div>

      <div className="mt-5">
        <CodeBlock
          filename="chat.ts"
          tabs={[
            {
              label: "TypeScript",
              lang: "ts",
              code: `const res = await orbit.chat.create({
  model: "orbit-1",
  messages: [
    { role: "system", content: "You are a terse assistant." },
    { role: "user", content: "explain rate limiting in one sentence" }
  ],
  temperature: 0.4,
  max_tokens: 128,
});`,
            },
            {
              label: "Python",
              lang: "py",
              code: `res = orbit.chat.create(
    model="orbit-1",
    messages=[
        {"role": "system", "content": "You are a terse assistant."},
        {"role": "user", "content": "explain rate limiting in one sentence"},
    ],
    temperature=0.4,
    max_tokens=128,
)`,
            },
            {
              label: "curl",
              lang: "sh",
              code: `curl https://api.0rbit.dev/v1/chat/completions \\
  -H "Authorization: Bearer $ORBIT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "orbit-1",
    "messages": [{"role":"user","content":"hello"}]
  }'`,
            },
          ]}
        />
      </div>

      <H2 id="params">Parameters</H2>
      <ApiTable
        headers={["Field", "Type", "Required", "Description"]}
        rows={[
          [<C>model</C>, "string", "yes", "Model id, e.g. orbit-1, orbit-1-mini."],
          [<C>messages</C>, "message[]", "yes", "Chronological conversation, at least one entry."],
          [<C>stream</C>, "boolean", "no", "Emit deltas over SSE. Default false."],
          [<C>temperature</C>, "number", "no", "0–2. Default 1."],
          [<C>max_tokens</C>, "integer", "no", "Cap output length. Default: model max."],
          [<C>tools</C>, "tool[]", "no", "OpenAI-compatible tool spec."],
          [<C>response_format</C>, "object", "no", `{"type":"json_object"} for JSON mode.`],
        ]}
      />

      <H2 id="resp">Response</H2>
      <div className="mt-5">
        <CodeBlock
          tabs={[
            {
              label: "response",
              lang: "json",
              code: `{
  "id": "req_9f2a1b",
  "object": "chat.completion",
  "created": 1751673600,
  "model": "orbit-1",
  "choices": [{
    "index": 0,
    "message": { "role": "assistant", "content": "…" },
    "finish_reason": "stop"
  }],
  "usage": { "input_tokens": 24, "output_tokens": 118, "total_tokens": 142 },
  "worker": "wrk_a19f",
  "region": "us-west-2",
  "receipt": "0x9c8f…b12a"
}`,
            },
          ]}
        />
      </div>

      <H2 id="codes">Status codes</H2>
      <ApiTable
        headers={["Code", "Name", "Meaning"]}
        rows={[
          ["200", "OK", "Completion returned."],
          ["400", "invalid_request", "Bad params — see message."],
          ["401", "unauthorized", "Missing or invalid key."],
          ["402", "insufficient_credits", "Wallet below reserve."],
          ["409", "worker_unavailable", "Retry — router will pick another."],
          ["429", "rate_limited", "See Retry-After header."],
          ["500", "runtime_error", "Report the request id."],
        ]}
      />

      <H2 id="flow">Request flow</H2>
      <RequestFlow />
    </>
  ),
};

const images: DocPage = {
  slug: "images",
  group: "Core APIs",
  title: "Image API",
  kicker: "POST /v1/images/generations",
  description:
    "Text-to-image generation routed to workers with image-capable GPUs. Returns a signed URL and a receipt.",
  toc: [
    { id: "ep", label: "Endpoint" },
    { id: "params", label: "Parameters" },
    { id: "models", label: "Models" },
    { id: "resp", label: "Response" },
  ],
  render: () => (
    <>
      <H2 id="ep">Endpoint</H2>
      <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-surface/40 px-4 py-3">
        <Method method="POST" />
        <Endpoint path="/v1/images/generations" />
      </div>

      <div className="mt-5">
        <CodeBlock
          filename="image.ts"
          tabs={[
            {
              label: "TypeScript",
              lang: "ts",
              code: `const res = await orbit.images.create({
  model: "orbit-image-1",
  prompt: "a topographic map of an unnamed island",
  size: "1024x1024",
  n: 1,
});

console.log(res.data[0].url);`,
            },
            {
              label: "Python",
              lang: "py",
              code: `res = orbit.images.create(
    model="orbit-image-1",
    prompt="a topographic map of an unnamed island",
    size="1024x1024",
    n=1,
)
print(res.data[0].url)`,
            },
          ]}
        />
      </div>

      <H2 id="params">Parameters</H2>
      <ApiTable
        headers={["Field", "Type", "Description"]}
        rows={[
          [<C>model</C>, "string", "orbit-image-1 · orbit-image-1-hd"],
          [<C>prompt</C>, "string", "Up to 4000 characters."],
          [<C>size</C>, "string", "512x512 · 1024x1024 · 1792x1024 · 1024x1792"],
          [<C>n</C>, "integer", "1–4. Each counts as one request."],
          [<C>response_format</C>, "string", "url (default) · b64_json"],
          [<C>seed</C>, "integer", "Deterministic sampling."],
        ]}
      />

      <H2 id="models">Models</H2>
      <ApiTable
        headers={["Model", "Max size", "Steps", "Price / image"]}
        rows={[
          [<C>orbit-image-1</C>, "1024²", "28", "0.008 cr"],
          [<C>orbit-image-1-hd</C>, "1792×1024", "40", "0.021 cr"],
        ]}
      />

      <H2 id="resp">Response</H2>
      <div className="mt-5">
        <CodeBlock
          tabs={[
            {
              label: "response",
              lang: "json",
              code: `{
  "created": 1751673612,
  "model": "orbit-image-1",
  "data": [{ "url": "https://cdn.0rbit.dev/img/…png", "seed": 918273 }],
  "usage": { "steps": 28 },
  "receipt": "0x71ea…4c02"
}`,
            },
          ]}
        />
      </div>
    </>
  ),
};

const models: DocPage = {
  slug: "models",
  group: "Core APIs",
  title: "Models",
  kicker: "GET /v1/models",
  description:
    "The live model catalog. Each entry publishes its context window, throughput class, price, and current availability across the mesh.",
  toc: [
    { id: "list", label: "List models" },
    { id: "avail", label: "Availability" },
    { id: "picks", label: "Popular picks" },
  ],
  render: () => (
    <>
      <H2 id="list">List models</H2>
      <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-surface/40 px-4 py-3">
        <Method method="GET" />
        <Endpoint path="/v1/models" />
      </div>

      <ApiTable
        headers={["Model", "Context", "Tokens/s", "Input / 1M", "Output / 1M"]}
        rows={[
          [<C>orbit-1</C>, "128k", "180", "1.20 cr", "3.60 cr"],
          [<C>orbit-1-mini</C>, "64k", "410", "0.20 cr", "0.60 cr"],
          [<C>orbit-1-vision</C>, "64k", "120", "1.60 cr", "4.80 cr"],
          [<C>orbit-embed-1</C>, "8k", "—", "0.04 cr", "—"],
          [<C>orbit-image-1</C>, "—", "—", "—", "0.008 / image"],
        ]}
      />

      <H2 id="avail">Availability</H2>
      <P>
        The <C>availability</C> field reports the fraction of workers currently online for each
        model. A value above 0.6 means the router will almost always pick in-region.
      </P>
      <CardGrid>
        <InfoCard title="Warm pools" kicker="performance">
          Weights are pre-loaded across regions during peak hours. Cold-start hits only long-tail
          models.
        </InfoCard>
        <InfoCard title="Deprecations" kicker="lifecycle">
          Every model publishes a <C>sunset_at</C> field. 90 days minimum notice; migration guide
          in the changelog.
        </InfoCard>
      </CardGrid>

      <H2 id="picks">Popular picks</H2>
      <P>
        Use <C>orbit-1-mini</C> for high-QPS agents and background pipelines. Use{" "}
        <C>orbit-1</C> for user-facing chat where quality dominates cost. Use{" "}
        <C>orbit-1-vision</C> for anything with an image in the prompt.
      </P>
    </>
  ),
};

const streaming: DocPage = {
  slug: "streaming",
  group: "Core APIs",
  title: "Streaming",
  kicker: "server-sent events",
  description:
    "The runtime streams tokens over SSE from the moment a worker begins decoding. The SDK exposes them as async iterables.",
  toc: [
    { id: "how", label: "How streaming works" },
    { id: "envelope", label: "Event envelope" },
    { id: "backp", label: "Backpressure" },
    { id: "diag", label: "Streaming process" },
  ],
  render: () => (
    <>
      <H2 id="how">How streaming works</H2>
      <P>
        When you set <C>stream: true</C> the gateway keeps the connection open, and the worker
        pushes one event per decode step. The stream closes with a terminal <C>done</C> event and
        a trailing usage summary.
      </P>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <CodeBlock
          filename="consume.ts"
          tabs={[
            {
              label: "TypeScript",
              lang: "ts",
              code: `const stream = await orbit.chat.stream({
  model: "orbit-1",
  messages: [{ role: "user", content: "count to five" }],
});

let full = "";
for await (const chunk of stream) {
  full += chunk.delta ?? "";
}

console.log(stream.usage);`,
            },
            {
              label: "curl",
              lang: "sh",
              code: `curl -N https://api.0rbit.dev/v1/chat/completions \\
  -H "Authorization: Bearer $ORBIT_API_KEY" \\
  -d '{"model":"orbit-1","stream":true,"messages":[…]}'`,
            },
          ]}
        />
        <TypingTerminal
          title="stream"
          language="sse"
          snippets={[
            `event: token\ndata: {"delta":"one"}\n\nevent: token\ndata: {"delta":", "}\n\nevent: token\ndata: {"delta":"two"}\n\nevent: done\ndata: {"usage":{"output_tokens":42}}`,
          ]}
        />
      </div>

      <H2 id="envelope">Event envelope</H2>
      <ApiTable
        headers={["Event", "Payload", "When"]}
        rows={[
          ["token", `{ delta: string, index: number }`, "Every decode step."],
          ["tool_call", `{ id, name, arguments_delta }`, "During tool invocations."],
          ["error", `{ code, message, retry_after_ms? }`, "Terminal — stream closes after."],
          ["done", `{ usage, receipt, worker }`, "Always last on a clean close."],
        ]}
      />

      <H2 id="backp">Backpressure</H2>
      <Note>
        The runtime honors TCP backpressure. If your consumer stops draining, the worker pauses
        decoding within one token — you are never charged for tokens the client did not receive.
      </Note>

      <H2 id="diag">Streaming process</H2>
      <StreamingProcess />
    </>
  ),
};

const workers: DocPage = {
  slug: "workers",
  group: "Runtime",
  title: "Workers",
  kicker: "GET /v1/workers",
  description:
    "Every worker on the mesh — region, GPU class, current queue depth, reliability score. The router uses this to place your request; you can query it too.",
  toc: [
    { id: "list", label: "List workers" },
    { id: "select", label: "Worker selection" },
    { id: "policy", label: "Pinning & policy" },
  ],
  render: () => (
    <>
      <H2 id="list">List workers</H2>
      <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-surface/40 px-4 py-3">
        <Method method="GET" />
        <Endpoint path="/v1/workers" />
      </div>
      <ApiTable
        headers={["Field", "Type", "Description"]}
        rows={[
          [<C>id</C>, "string", "Stable worker id."],
          [<C>region</C>, "string", "e.g. us-west-2, eu-central-1."],
          [<C>gpu</C>, "string", "e.g. h100-80g, a100-40g."],
          [<C>models</C>, "string[]", "Warm-loaded model ids."],
          [<C>queue_depth</C>, "integer", "Requests waiting on this worker."],
          [<C>reliability</C>, "number", "0–1 rolling 24h success ratio."],
        ]}
      />

      <H2 id="select">Worker selection</H2>
      <P>
        The router evaluates every eligible worker on a three-term score: expected cost per output
        token, expected time to first token, and a fit multiplier for policy constraints.
      </P>
      <WorkerSelection />

      <H2 id="policy">Pinning & policy</H2>
      <P>
        Pass <C>routing</C> to constrain placement. Use it for compliance, latency budgets, or
        A/B testing worker classes.
      </P>
      <div className="mt-5">
        <CodeBlock
          tabs={[
            {
              label: "TypeScript",
              lang: "ts",
              code: `await orbit.chat.create({
  model: "orbit-1",
  messages,
  routing: {
    region: ["eu-central-1", "eu-west-1"],
    gpu: ["h100-80g"],
    max_latency_ms: 800,
  },
});`,
            },
          ]}
        />
      </div>

      <Tip>
        Pin lightly. Every constraint you add shrinks the candidate pool, which raises expected
        cost. Start with a region prefix and only tighten if measurements demand it.
      </Tip>
    </>
  ),
};

const credits: DocPage = {
  slug: "credits",
  group: "Runtime",
  title: "Credits & billing",
  kicker: "metering",
  description:
    "Credits are the runtime's unit of account. One credit is one dollar. Every request is metered on tokens in and out, priced against the live book, and settled on the ledger.",
  toc: [
    { id: "how", label: "How metering works" },
    { id: "budget", label: "Budgets" },
    { id: "flow", label: "Credit flow" },
    { id: "invoice", label: "Invoices" },
  ],
  render: () => (
    <>
      <H2 id="how">How metering works</H2>
      <P>
        A request is metered the moment the worker emits <C>done</C>. Input tokens are priced from
        the model card; output tokens are priced identically regardless of which worker served
        them.
      </P>

      <ApiTable
        headers={["Category", "Unit", "Charged when"]}
        rows={[
          ["Input tokens", "per 1M", "Completion returns."],
          ["Output tokens", "per 1M", "Completion returns."],
          ["Images", "per image", "Image URL is signed."],
          ["Embeddings", "per 1M input", "Batch resolves."],
          ["Failed requests", "0", "Never charged."],
        ]}
      />

      <H2 id="budget">Budgets</H2>
      <P>
        Every workspace has a soft cap and a hard cap. The soft cap triggers a webhook; the hard
        cap starts returning <C>402 insufficient_credits</C>.
      </P>
      <div className="mt-5">
        <CodeBlock
          tabs={[
            {
              label: "cli",
              code: `orbit budget set --soft 500 --hard 750 --alert ops@example.com`,
            },
          ]}
        />
      </div>

      <H2 id="flow">Credit flow</H2>
      <CreditFlowDiagram />

      <H2 id="invoice">Invoices</H2>
      <P>
        Invoices are issued monthly and are downloadable from the console. Line items break down by
        model and by workspace, and each line links to the underlying receipt bundle.
      </P>
    </>
  ),
};

const sdk: DocPage = {
  slug: "sdk",
  group: "SDKs",
  title: "SDK",
  kicker: "typescript · python · go · rust",
  description:
    "All SDKs share the same shape. Language-idiomatic on the surface, identical wire format underneath.",
  toc: [
    { id: "install", label: "Install" },
    { id: "shape", label: "Shape" },
    { id: "errors", label: "Errors" },
    { id: "pipe", label: "Inference pipeline" },
  ],
  render: () => (
    <>
      <H2 id="install">Install</H2>
      <div className="mt-5">
        <CodeBlock
          tabs={[
            { label: "bun", code: "bun add @orbit/sdk" },
            { label: "npm", code: "npm install @orbit/sdk" },
            { label: "pip", code: "pip install orbit-sdk" },
            { label: "go", code: "go get github.com/0rbit/orbit-go" },
            { label: "cargo", code: "cargo add orbit-sdk" },
          ]}
        />
      </div>

      <H2 id="shape">Shape</H2>
      <div className="mt-5">
        <CodeBlock
          filename="shape"
          tabs={[
            {
              label: "TypeScript",
              lang: "ts",
              code: `import { Orbit } from "@orbit/sdk";

const orbit = new Orbit({ apiKey: process.env.ORBIT_API_KEY! });

const chat   = await orbit.chat.create({ /* … */ });
const stream = await orbit.chat.stream({ /* … */ });
const embed  = await orbit.embeddings.create({ /* … */ });
const image  = await orbit.images.create({ /* … */ });`,
            },
            {
              label: "Python",
              lang: "py",
              code: `from orbit import Orbit

orbit = Orbit()

chat   = orbit.chat.create(...)
stream = orbit.chat.stream(...)
embed  = orbit.embeddings.create(...)
image  = orbit.images.create(...)`,
            },
            {
              label: "Go",
              lang: "go",
              code: `client := orbit.NewClient()
res, err := client.Chat.Create(ctx, orbit.ChatCreateParams{ /* … */ })`,
            },
          ]}
        />
      </div>

      <H2 id="errors">Errors</H2>
      <P>
        SDKs throw one class per code: <C>OrbitAuthError</C>, <C>OrbitRateLimit</C>,{" "}
        <C>OrbitRuntimeError</C>. All carry <C>.request_id</C>, <C>.retry_after_ms</C>, and{" "}
        <C>.worker</C> when applicable.
      </P>

      <H2 id="pipe">Inference pipeline</H2>
      <InferencePipeline />
    </>
  ),
};

const examples: DocPage = {
  slug: "examples",
  group: "SDKs",
  title: "Examples",
  kicker: "recipes",
  description:
    "Full working examples for the patterns we get asked about most. Copy, adapt, ship.",
  toc: [
    { id: "rag", label: "Retrieval-augmented chat" },
    { id: "tool", label: "Tool calls" },
    { id: "batch", label: "Batch embeddings" },
  ],
  render: () => (
    <>
      <H2 id="rag">Retrieval-augmented chat</H2>
      <div className="mt-5">
        <CodeBlock
          filename="rag.ts"
          tabs={[
            {
              label: "TypeScript",
              lang: "ts",
              code: `const query = "how do budgets work?";

const [embed] = (await orbit.embeddings.create({
  model: "orbit-embed-1",
  input: [query],
})).data;

const hits = await vectorStore.search(embed.embedding, 4);

const res = await orbit.chat.stream({
  model: "orbit-1",
  messages: [
    { role: "system", content: "Answer only from context." },
    { role: "user", content: query + "\\n\\n" + hits.map(h => h.text).join("\\n---\\n") },
  ],
});

for await (const c of res) process.stdout.write(c.delta ?? "");`,
            },
          ]}
        />
      </div>

      <H2 id="tool">Tool calls</H2>
      <div className="mt-5">
        <CodeBlock
          filename="tools.ts"
          tabs={[
            {
              label: "TypeScript",
              lang: "ts",
              code: `const tools = [{
  type: "function",
  function: {
    name: "get_weather",
    parameters: {
      type: "object",
      properties: { city: { type: "string" } },
      required: ["city"],
    },
  },
}];

const res = await orbit.chat.create({
  model: "orbit-1",
  messages: [{ role: "user", content: "weather in Lisbon?" }],
  tools,
});

if (res.choices[0].message.tool_calls) {
  // dispatch, then send tool result back as role: "tool"
}`,
            },
          ]}
        />
      </div>

      <H2 id="batch">Batch embeddings</H2>
      <div className="mt-5">
        <CodeBlock
          filename="batch.py"
          tabs={[
            {
              label: "Python",
              lang: "py",
              code: `docs = load_corpus()  # list[str], up to 2048 per call

out = orbit.embeddings.create(
    model="orbit-embed-1",
    input=docs,
)

for doc, item in zip(docs, out.data):
    store.upsert(doc, item.embedding)`,
            },
          ]}
        />
      </div>

      <Tip>
        The embeddings endpoint dedupes identical inputs within a batch and caches recent hashes,
        so re-embedding a mostly-unchanged corpus is close to free.
      </Tip>
    </>
  ),
};

const faq: DocPage = {
  slug: "faq",
  group: "Reference",
  title: "FAQ",
  kicker: "answers",
  description:
    "Short answers to the questions we get most, and pointers to the pages that go deeper.",
  toc: [
    { id: "compat", label: "Is it OpenAI-compatible?" },
    { id: "sla", label: "Do you offer an SLA?" },
    { id: "region", label: "Where does data live?" },
    { id: "errors", label: "How do errors work?" },
  ],
  render: () => (
    <>
      <H2 id="compat">Is it OpenAI-compatible?</H2>
      <P>
        Yes for chat, embeddings and images. Point your existing OpenAI client at{" "}
        <C>https://api.0rbit.dev</C> with an <C>sk_live_</C> key. The one addition is the{" "}
        <C>receipt</C> field on every response.
      </P>

      <H2 id="sla">Do you offer an SLA?</H2>
      <P>
        99.9% availability on chat and embeddings, 99.5% on images. Credits are refunded 10× on any
        breach, up to the price of the request. See the <C>/status</C> page for the live number.
      </P>

      <H2 id="region">Where does data live?</H2>
      <P>
        Requests are pinned to the region prefix in your workspace policy. We never persist
        prompts or completions beyond the request lifetime; only usage metadata and the receipt
        are stored.
      </P>

      <H2 id="errors">How do errors work?</H2>
      <P>Every failure returns the same envelope regardless of the endpoint.</P>
      <div className="mt-5">
        <CodeBlock
          tabs={[
            {
              label: "error",
              lang: "json",
              code: `{
  "error": {
    "code": "rate_limited",
    "message": "429 — 1200 RPM ceiling on chat.",
    "retry_after_ms": 1400,
    "request_id": "req_a9c1…",
    "worker": null
  }
}`,
            },
          ]}
        />
      </div>
      <Warning>
        Never retry on <C>400</C> or <C>402</C>. Both are terminal — fix the request or top up.
      </Warning>
    </>
  ),
};

const changelog: DocPage = {
  slug: "changelog",
  group: "Reference",
  title: "Changelog",
  kicker: "release notes",
  description:
    "Every change to the API, the runtime, and the SDKs. Reverse chronological, additive by default.",
  toc: [
    { id: "v260", label: "v2.6.0 — 2026-06-30" },
    { id: "v253", label: "v2.5.3 — 2026-06-14" },
    { id: "v250", label: "v2.5.0 — 2026-05-28" },
  ],
  render: () => (
    <>
      <H2 id="v260">v2.6.0 · 2026-06-30</H2>
      <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-muted-foreground">
        <li>· Added <C>routing.max_latency_ms</C> as a first-class constraint.</li>
        <li>· <C>orbit-1-vision</C> promoted out of beta.</li>
        <li>· Receipts now include the worker&apos;s GPU class.</li>
      </ul>

      <H2 id="v253">v2.5.3 · 2026-06-14</H2>
      <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-muted-foreground">
        <li>· Fixed a token-boundary bug on <C>orbit-1-mini</C> streams over long tools.</li>
        <li>· Python SDK now ships wheels for musl.</li>
      </ul>

      <H2 id="v250">v2.5.0 · 2026-05-28</H2>
      <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-muted-foreground">
        <li>· New endpoint: <C>/v1/embeddings</C>.</li>
        <li>· Budgets: soft/hard split with a webhook on the soft cap.</li>
        <li>· 4 new EU regions.</li>
      </ul>
    </>
  ),
};

/* ------------ registry ------------ */

export const PAGES: DocPage[] = [
  intro,
  quickstart,
  auth,
  chat,
  images,
  models,
  streaming,
  workers,
  credits,
  sdk,
  examples,
  faq,
  changelog,
];

export const PAGE_MAP: Record<string, DocPage> = Object.fromEntries(
  PAGES.map((p) => [p.slug, p]),
);

export const NAV_GROUPS: { group: string; slugs: string[] }[] = [
  { group: "Get started", slugs: ["intro", "quickstart", "auth"] },
  { group: "Core APIs", slugs: ["chat", "images", "models", "streaming"] },
  { group: "Runtime", slugs: ["workers", "credits"] },
  { group: "SDKs", slugs: ["sdk", "examples"] },
  { group: "Reference", slugs: ["faq", "changelog"] },
];
