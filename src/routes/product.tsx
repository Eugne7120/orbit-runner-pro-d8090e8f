import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/orbit/PageShell";
import { PageHeader } from "@/components/orbit/PageHeader";
import { Section } from "@/components/orbit/Section";
import { RuntimeFlow } from "@/components/orbit/RuntimeFlow";
import { LiveCard, LiveMetric, MiniSparkline } from "@/components/orbit/LiveCard";
import { PageBackground } from "@/components/orbit/PageBackground";
import { Reveal } from "@/components/orbit/Reveal";

export const Route = createFileRoute("/product")({
  head: () => ({
    meta: [
      { title: "Product — 0RBIT" },
      { name: "description", content: "A runtime for AI that routes, executes and settles every request across a distributed mesh." },
      { property: "og:title", content: "Product — 0RBIT" },
      { property: "og:description", content: "A runtime for AI that routes, executes and settles every request across a distributed mesh." },
    ],
  }),
  component: ProductPage,
});

const capabilities = [
  { title: "Adaptive routing", body: "Every call is scored against latency, price, load and locality. The best worker wins in under a millisecond." },
  { title: "Streaming natively", body: "Token-level streams from the first byte. No polling. No queues you can see." },
  { title: "Model-agnostic", body: "Open models, closed models, private fine-tunes. Same endpoint. Same billing." },
  { title: "Deterministic quotas", body: "Credits, not surprises. Set a ceiling, get exact behavior at the ceiling." },
  { title: "Verifiable receipts", body: "Every request produces a signed receipt: worker, region, tokens, cost. Auditable, ignorable." },
  { title: "Zero cold start", body: "Warm pools per region keep TTFT under 50ms on production workloads." },
];

function ProductPage() {
  return (
    <PageShell>
      <PageBackground variant="packets" />
      <PageHeader
        eyebrow="/ product"
        title="A single endpoint. A network beneath it."
        intro="0RBIT is the layer between your app and the model. It picks the worker, streams the tokens, retries the failure, settles the payment — and disappears."
      />

      <Section eyebrow="/ system">
        <Reveal>
          <div className="glass-strong rounded-3xl p-4 shadow-elegant md:p-8">
            <RuntimeFlow />
          </div>
        </Reveal>
      </Section>

      <Section
        eyebrow="/ capabilities"
        title="What the runtime handles for you."
        intro="Everything below is on by default. Nothing is a plan tier. Nothing is a phone call."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <LiveCard eyebrow={`/ ${String(i + 1).padStart(2, "0")}`} title={c.title} description={c.body} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="/ observability" title="See the runtime, always." intro="The dashboard is a live view of your traffic, not a weekly digest.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Reveal>
            <LiveCard eyebrow="Latency" title="p50 · p95 · p99">
              <MiniSparkline />
              <div className="mt-3 space-y-0">
                <LiveMetric label="p50" base={41} />
                <LiveMetric label="p95" base={140} />
                <LiveMetric label="p99" base={210} />
              </div>
            </LiveCard>
          </Reveal>
          <Reveal delay={80}>
            <LiveCard eyebrow="Throughput" title="Tokens per second">
              <MiniSparkline color="muted" />
              <div className="mt-3 space-y-0">
                <LiveMetric label="now" base={12400} unit="" />
                <LiveMetric label="peak · 24h" base={41800} unit="" />
              </div>
            </LiveCard>
          </Reveal>
          <Reveal delay={160}>
            <LiveCard eyebrow="Cost" title="Credits consumed">
              <div className="space-y-0">
                <LiveMetric label="hour" base={82} unit="cr" />
                <LiveMetric label="day" base={1904} unit="cr" />
                <LiveMetric label="month" base={38210} unit="cr" />
              </div>
            </LiveCard>
          </Reveal>
        </div>
      </Section>
    </PageShell>
  );
}
