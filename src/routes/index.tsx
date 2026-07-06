import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/orbit/PageShell";
import { Section } from "@/components/orbit/Section";
import { BootTerminal } from "@/components/orbit/BootTerminal";
import { RuntimeFlow } from "@/components/orbit/RuntimeFlow";
import { LiveCard, LiveMetric, MiniSparkline } from "@/components/orbit/LiveCard";
import { ChatPreview } from "@/components/orbit/ChatPreview";
import { MetricTile } from "@/components/orbit/MetricTile";
import { RuntimeFeatures } from "@/components/orbit/RuntimeFeatures";
import { Reveal } from "@/components/orbit/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "0RBIT The decentralized runtime for AI" },
      {
        name: "description",
        content:
          "Inference, routing and streaming across a global network of workers. AI infrastructure engineered for speed, precision and trust.",
      },
      { property: "og:title", content: "0RBIT The decentralized runtime for AI" },
      {
        property: "og:description",
        content:
          "A global mesh of workers routes every inference request to wherever it is cheapest, fastest and closest.",
      },
      { name: "twitter:title", content: "0RBIT The decentralized runtime for AI" },
      {
        name: "twitter:description",
        content: "Inference, routing and streaming across a global network of workers.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <PageShell>
      {/* HERO already has animate-orbit-fade-up, leave as-is */}
      <section className="relative mx-auto max-w-6xl px-6 pt-8 md:pt-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="animate-orbit-fade-up inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_10px] shadow-signal" />
            0RBIT · runtime v1.0 · live
          </div>
          <h1
            className="animate-orbit-fade-up mt-8 text-balance font-display text-[52px] font-medium leading-[1.02] tracking-[-0.04em] text-signal-gradient md:text-[86px]"
            style={{ animationDelay: "60ms" }}
          >
            The runtime for AI,
            <br />
            distributed by design.
          </h1>
          <p
            className="animate-orbit-fade-up mx-auto mt-7 max-w-2xl text-pretty text-[17px] leading-relaxed text-muted-foreground md:text-[19px]"
            style={{ animationDelay: "140ms" }}
          >
            0RBIT routes every request through a global mesh of workers. Inference happens where it
            is cheapest, fastest and closest settled invisibly on-chain, delivered like software.
          </p>
          <div
            className="animate-orbit-fade-up mt-10 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: "220ms" }}
          >
            <Link
              to="/app/login"
              className="btn-sheen group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[14px] font-medium text-background transition-all duration-300 hover:bg-foreground/90 hover:scale-[1.01] shadow-[0_10px_30px_-10px_oklch(1_0_0/0.25)]"
            >
              Start App
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
            <Link
              to="/product"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/40 px-5 py-2.5 text-[14px] text-foreground/90 transition-all hover:border-border-strong hover:bg-surface"
            >
              How it works
            </Link>
          </div>
          <div
            className="animate-orbit-fade-up mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"
            style={{ animationDelay: "320ms" }}
          >
            <span>214 workers online</span>
            <span className="h-1 w-1 rounded-full bg-border-strong" />
            <span>p50 · 41ms</span>
            <span className="h-1 w-1 rounded-full bg-border-strong" />
            <span>1.2b tokens / day</span>
          </div>
        </div>

        {/* Runtime flow */}
        <div
          className="animate-orbit-fade-up relative mx-auto mt-20 max-w-5xl"
          style={{ animationDelay: "420ms" }}
        >
          <div className="glass-strong rounded-3xl p-4 shadow-elegant md:p-8">
            <div className="mb-4 flex items-center justify-between px-2">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                / runtime flow
              </div>
              <div className="flex items-center gap-2 font-mono text-[10.5px] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-signal animate-orbit-pulse" />
                streaming
              </div>
            </div>
            <RuntimeFlow />
          </div>
        </div>
      </section>

      {/* WHAT IT IS */}
      <Section
        eyebrow="/ 01 · thesis"
        title="Not a model. Not a chain. A runtime."
        intro="Models come and go. Chains settle value. In between lives the layer that actually runs the request: routes it, streams it, bills it, retries it. That layer has always belonged to one provider at a time. 0RBIT rebuilds it as an open network."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Reveal>
            <LiveCard
              eyebrow="Route"
              title="Every request, best path"
              description="Latency, price, availability and locality are evaluated on every call. The router picks the worker most likely to answer well, right now."
            >
              <div className="space-y-0">
                <LiveMetric label="p50 latency" base={41} />
                <LiveMetric label="p99 latency" base={210} />
                <LiveMetric label="routing decisions / s" base={4800} unit="" />
              </div>
            </LiveCard>
          </Reveal>
          <Reveal delay={80}>
            <LiveCard
              eyebrow="Execute"
              title="Workers you don't manage"
              description="Independent operators run inference on hardware they own. You get a single endpoint. They get paid per token served."
            >
              <MiniSparkline />
              <div className="mt-2 font-mono text-[11px] text-muted-foreground">
                tokens/sec · last 24h
              </div>
            </LiveCard>
          </Reveal>
          <Reveal delay={160}>
            <LiveCard
              eyebrow="Settle"
              title="Blockchain, invisible"
              description="Solana handles settlement, quotas and receipts. You never see a wallet. Payment is in credits. On-chain is an implementation detail."
            >
              <div className="space-y-0">
                <LiveMetric label="settlement" base={380} unit="ms" />
                <LiveMetric label="finality" base={2} unit="s" />
                <LiveMetric label="fees" base={0} unit="-" />
              </div>
            </LiveCard>
          </Reveal>
        </div>
      </Section>

      {/* TERMINAL SPLIT */}
      <Section
        eyebrow="/ 02 · developer surface"
        title="Ships like software. Runs like infrastructure."
        intro="One SDK. One key. Streaming from the first token. The network beneath it is elastic, distributed and priced per unit of work not per seat, not per model, not per month."
      >
        <Reveal>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <BootTerminal />
            </div>
            <div className="grid gap-4 lg:col-span-2">
              <LiveCard eyebrow="Install" title="One line, any language">
                <pre className="overflow-x-auto rounded-lg border border-border bg-[oklch(0.13_0.008_250)] p-3 font-mono text-[12.5px] text-foreground/90">
                  {`$ npm i @orbit/sdk
$ orbit login`}
                </pre>
              </LiveCard>
              <LiveCard eyebrow="Call" title="Familiar shape, better runtime">
                <pre className="overflow-x-auto rounded-lg border border-border bg-[oklch(0.13_0.008_250)] p-3 font-mono text-[12.5px] leading-relaxed">
                  <span className="text-muted-foreground">{`// stream tokens from anywhere\n`}</span>
                  <span className="text-foreground/90">{`const res = await orbit.chat({\n  model: "orbit-1",\n  stream: true,\n  messages,\n});`}</span>
                </pre>
              </LiveCard>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* PRODUCT PREVIEW Runtime chat */}
      <Section
        eyebrow="/ 03 · product"
        title="Experience 0RBIT Runtime."
        intro="A real chat streaming against the same architecture you see above routed, executed and settled on the mesh in real time. This is what your users will feel."
      >
        <Reveal>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <ChatPreview />
            </div>
            <div className="lg:col-span-2">
              <RuntimeFeatures />
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ARCHITECTURE PANEL */}
      <Section
        eyebrow="/ 04 · observability"
        title="The infrastructure is the artwork."
        intro="No stock diagrams. No brains, no hexagons, no globes. Just the actual shape of the system nodes, edges, queues, streams. Alive on every page."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Reveal delay={0}>
            <MetricTile
              label="workers online"
              base={214}
              variance={0.02}
              seed={1}
              hint="12 regions · 4 continents"
            />
          </Reveal>
          <Reveal delay={80}>
            <MetricTile
              label="p50 latency"
              base={41}
              variance={0.14}
              unit="ms"
              chartColor="muted"
              seed={2}
              hint="rolling 5m"
            />
          </Reveal>
          <Reveal delay={160}>
            <MetricTile
              label="requests / sec"
              base={38}
              variance={0.22}
              seed={4}
              hint="↑ 18% wow"
            />
          </Reveal>
          <Reveal delay={240}>
            <MetricTile
              label="credits processed"
              base={17}
              variance={0.6}
              format={(n) => `+${Math.max(1, Math.round(n))}`}
              chartColor="warm"
              seed={5}
              hint="last minute"
            />
          </Reveal>
          <Reveal delay={80}>
            <MetricTile
              label="uptime"
              base={99.994}
              variance={0.00002}
              format={(n) => `${n.toFixed(3)}%`}
              chart={false}
              hint="rolling 30d"
            />
          </Reveal>
          <Reveal delay={160}>
            <MetricTile
              label="ttft · warm"
              base={38}
              variance={0.15}
              unit="ms"
              seed={6}
              hint="median"
            />
          </Reveal>
          <Reveal delay={240}>
            <MetricTile
              label="cost / 1m tokens"
              base={0.42}
              variance={0.06}
              format={(n) => `$${n.toFixed(2)}`}
              chartColor="muted"
              seed={8}
              hint="orbit-1 · avg"
            />
          </Reveal>
          <Reveal delay={320}>
            <MetricTile
              label="tokens / day"
              base={1.2}
              variance={0.05}
              format={(n) => `${n.toFixed(2)}b`}
              seed={9}
              hint="24h rolling"
            />
          </Reveal>
        </div>
      </Section>

      {/* CLOSING CTA */}
      <Section eyebrow="/ 05 · ship">
        <Reveal>
          <div className="glass-strong relative overflow-hidden rounded-3xl p-10 shadow-elegant md:p-16">
            <div
              className="absolute inset-0 -z-10 opacity-40"
              style={{
                background:
                  "radial-gradient(60% 80% at 20% 0%, oklch(0.78 0.14 232 / 0.35), transparent 60%)",
              }}
            />
            <div className="max-w-2xl">
              <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                ready when you are
              </div>
              <h2 className="text-balance font-display text-4xl font-medium tracking-[-0.03em] md:text-5xl">
                Move your first request in an afternoon.
              </h2>
              <p className="mt-5 max-w-xl text-pretty text-[16px] leading-relaxed text-muted-foreground md:text-[17px]">
                A drop-in SDK, an OpenAI-compatible endpoint, and a network that scales the moment
                you send traffic. No infra to provision. No chain to touch. Just a runtime.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/developers"
                  className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[14px] font-medium text-background transition-all hover:bg-foreground/90"
                >
                  Read the docs
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/40 px-5 py-2.5 text-[14px] text-foreground/90 transition-all hover:bg-surface"
                >
                  See pricing
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </PageShell>
  );
}
