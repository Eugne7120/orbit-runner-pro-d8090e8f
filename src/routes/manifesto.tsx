import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/orbit/PageShell";
import { PageHeader } from "@/components/orbit/PageHeader";
import { Section } from "@/components/orbit/Section";
import { PageBackground } from "@/components/orbit/PageBackground";

export const Route = createFileRoute("/manifesto")({
  head: () => ({
    meta: [
      { title: "Manifesto — 0RBIT" },
      { name: "description", content: "The infrastructure that runs intelligence should not belong to one company." },
      { property: "og:title", content: "Manifesto — 0RBIT" },
      { property: "og:description", content: "The infrastructure that runs intelligence should not belong to one company." },
    ],
  }),
  component: ManifestoPage,
});

const beats = [
  { n: "01", t: "Intelligence is infrastructure now.", b: "Every product ships with a model inside it. Every model runs on a server owned by someone else. The pipe between them decides who gets to build." },
  { n: "02", t: "One provider is a single point of failure.", b: "Not just for uptime. For pricing. For access. For what you are allowed to build. A single vendor is a single decision away from a different internet." },
  { n: "03", t: "A network cannot be turned off.", b: "0RBIT is a mesh of independent workers. No worker is essential. No region is a chokepoint. Nothing that matters lives in one datacenter." },
  { n: "04", t: "Money is a settlement problem.", b: "Blockchain is not the product. It is the ledger. It moves credits between developers and the workers that served them. It runs underneath, silently, correctly." },
  { n: "05", t: "The developer is the customer.", b: "Not the buyer. Not the analyst. The engineer who ships. Every surface we build is for them: SDK, docs, receipts, logs, dashboard. Everything else is second." },
  { n: "06", t: "Restraint is a feature.", b: "No hype. No mascots. No hexagons. The product speaks. The runtime speaks. The receipts speak. We stay quiet." },
];

const evolution = [
  { era: "2015", label: "One machine.", detail: "A GPU on a desk. A model per team." },
  { era: "2019", label: "One datacenter.", detail: "Managed inference. One provider, one bill." },
  { era: "2023", label: "One API.", detail: "Every product routes through the same handful of endpoints." },
  { era: "2026", label: "One network.", detail: "Workers everywhere. Routing between them. Settlement underneath." },
];

function ManifestoPage() {
  return (
    <PageShell>
      <PageBackground variant="blueprint" />
      <PageHeader
        eyebrow="/ manifesto"
        title="The infrastructure that runs intelligence should not belong to one company."
        intro="This is the reason 0RBIT exists. Six beliefs, in order, without decoration."
      />

      <Section eyebrow="/ beliefs">
        <div className="mx-auto max-w-3xl">
          {beats.map((b, i) => (
            <div
              key={b.n}
              className={`grid grid-cols-[60px_1fr] gap-6 py-10 ${i > 0 ? "border-t border-border" : ""}`}
            >
              <div className="pt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{b.n}</div>
              <div>
                <h3 className="text-balance font-display text-2xl font-medium tracking-[-0.02em] md:text-3xl">{b.t}</h3>
                <p className="mt-3 text-pretty text-[15.5px] leading-relaxed text-muted-foreground md:text-[16.5px]">{b.b}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="/ evolution" title="How the infrastructure of AI moved.">
        <div className="mx-auto max-w-4xl">
          <div className="relative">
            <div className="absolute left-0 top-6 h-px w-full bg-gradient-to-r from-transparent via-border-strong to-transparent" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              {evolution.map((e, i) => (
                <div key={e.era} className="relative">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-3 w-3">
                      {i === evolution.length - 1 && (
                        <span className="absolute inset-0 rounded-full bg-signal/60 animate-orbit-ping" />
                      )}
                      <span className={`relative h-3 w-3 rounded-full ${i === evolution.length - 1 ? "bg-signal shadow-[0_0_10px] shadow-signal" : "bg-border-strong"}`} />
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{e.era}</span>
                  </div>
                  <div className="mt-3 font-display text-xl tracking-tight">{e.label}</div>
                  <div className="mt-1 text-[13.5px] text-muted-foreground">{e.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section eyebrow="/ signature">
        <div className="mx-auto max-w-3xl border-t border-border pt-10 text-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">— the 0RBIT team</div>
          <div className="mt-2 font-mono text-[11px] text-muted-foreground">2026 · earth · always on</div>
        </div>
      </Section>
    </PageShell>
  );
}
