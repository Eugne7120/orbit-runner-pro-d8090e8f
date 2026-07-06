import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/orbit/PageShell";
import { PageHeader } from "@/components/orbit/PageHeader";
import { Section } from "@/components/orbit/Section";
import { CreditFlow } from "@/components/orbit/CreditFlow";
import { PageBackground } from "@/components/orbit/PageBackground";
import { Reveal } from "@/components/orbit/Reveal";
import { useState } from "react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing 0RBIT" },
      {
        name: "description",
        content: "Credits per token served. No seats, no tiers, no minimums.",
      },
      { property: "og:title", content: "Pricing 0RBIT" },
      {
        property: "og:description",
        content: "Credits per token served. No seats, no tiers, no minimums.",
      },
    ],
  }),
  component: PricingPage,
});

const plans = [
  {
    name: "Developer",
    price: "Free",
    tag: "for exploring",
    line: "1M credits included",
    features: [
      "Every model, every region",
      "10 req/s baseline",
      "Community support",
      "Signed receipts",
    ],
    cta: "Start free",
  },
  {
    name: "Team",
    price: "Usage",
    tag: "pay for what you serve",
    line: "$0.42 / 1M tokens · orbit-1",
    features: ["Higher concurrency", "Priority routing", "Slack support", "Workspace analytics"],
    cta: "Add credits",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Contract",
    tag: "for scale",
    line: "Custom SLAs, private lanes",
    features: ["Dedicated workers", "Region pinning", "24/7 on-call", "Signed audit exports"],
    cta: "Contact us",
  },
];

const CATALOG = [
  { k: "orbit-1", v: 0.42, u: "/ 1M tokens" },
  { k: "orbit-1-mini", v: 0.12, u: "/ 1M tokens" },
  { k: "orbit-1-long", v: 1.1, u: "/ 1M tokens" },
  { k: "embed-1", v: 0.03, u: "/ 1M tokens" },
  { k: "vision-1", v: 0.62, u: "/ 1M tokens" },
  { k: "image-1", v: 0.004, u: "/ image" },
];

function PricingPage() {
  return (
    <PageShell>
      <PageBackground variant="credits" />
      <PageHeader
        eyebrow="/ pricing"
        title="Credits per token. Nothing else."
        intro="No seats. No tiers to unlock features. No minimum spend. You are billed for the work the network does on your behalf and only that."
      />

      <Section
        eyebrow="/ how billing works"
        title="Credits move through the network."
        intro="A credit is a stable unit of work. You buy them. The runtime meters them. Workers earn them. Solana settles them."
      >
        <Reveal>
          <CreditFlow />
        </Reveal>
      </Section>

      <Section eyebrow="/ plans">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 80}>
              <div
                className={`relative overflow-hidden rounded-2xl border p-8 transition-all h-full ${
                  p.highlight
                    ? "border-signal/40 bg-surface shadow-signal"
                    : "border-border bg-surface/40 hover:border-border-strong"
                }`}
              >
                {p.highlight && (
                  <div
                    className="pointer-events-none absolute inset-0 -z-10 opacity-60"
                    style={{
                      background:
                        "radial-gradient(80% 60% at 50% 0%, oklch(0.78 0.14 232 / 0.18), transparent 70%)",
                    }}
                  />
                )}
                <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                  {p.tag}
                </div>
                <div className="mt-1 font-display text-2xl tracking-tight">{p.name}</div>
                <div className="mt-6 font-display text-5xl font-medium tracking-[-0.03em]">
                  {p.price}
                </div>
                <div className="mt-2 font-mono text-[12px] text-muted-foreground">{p.line}</div>
                <ul className="mt-8 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[14px] text-foreground/90">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-signal" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/developers"
                  className={`mt-10 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-medium transition-all ${
                    p.highlight
                      ? "bg-foreground text-background hover:bg-foreground/90"
                      : "border border-border-strong bg-surface text-foreground hover:bg-surface-2"
                  }`}
                >
                  {p.cta} →
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="/ catalog"
        title="Per-model pricing."
        intro="Prices go down as the network grows. Historical rates are recorded on-chain."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {CATALOG.map((r, i) => (
            <Reveal key={r.k} delay={i * 80}>
              <div className="rounded-xl border border-border bg-surface/40 p-6 h-full">
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {r.k}
                </div>
                <div className="mt-3 font-display text-3xl tabular-nums">
                  ${r.v.toFixed(3).replace(/0+$/, "").replace(/\.$/, "")}
                </div>
                <div className="font-mono text-[11px] text-muted-foreground">{r.u}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="/ estimate"
        title="Estimate your monthly bill."
        intro="A rough model. The runtime will always meter you exactly."
      >
        <Reveal>
          <Calculator />
        </Reveal>
      </Section>
    </PageShell>
  );
}

function Calculator() {
  const [model, setModel] = useState(CATALOG[0]);
  const [reqPerDay, setReqPerDay] = useState(50000);
  const [tokensPerReq, setTokensPerReq] = useState(800);

  const dailyTokens = reqPerDay * tokensPerReq;
  const monthlyTokens = dailyTokens * 30;
  const monthlyUSD = (monthlyTokens / 1_000_000) * model.v;

  return (
    <div className="glass rounded-2xl p-6 md:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
        <Field label="Model">
          <select
            value={model.k}
            onChange={(e) => setModel(CATALOG.find((c) => c.k === e.target.value)!)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 font-mono text-[13px] text-foreground focus:border-border-strong focus:outline-none"
          >
            {CATALOG.filter((c) => c.u.includes("tokens")).map((c) => (
              <option key={c.k} value={c.k}>
                {c.k}
              </option>
            ))}
          </select>
        </Field>
        <Field label={`Requests / day · ${reqPerDay.toLocaleString()}`}>
          <input
            type="range"
            min={1000}
            max={5_000_000}
            step={1000}
            value={reqPerDay}
            onChange={(e) => setReqPerDay(+e.target.value)}
            className="w-full accent-signal"
          />
        </Field>
        <Field label={`Tokens / request · ${tokensPerReq}`}>
          <input
            type="range"
            min={100}
            max={16000}
            step={100}
            value={tokensPerReq}
            onChange={(e) => setTokensPerReq(+e.target.value)}
            className="w-full accent-signal"
          />
        </Field>
        <div className="rounded-xl border border-signal/40 bg-signal/5 p-4 text-right">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
            est. monthly
          </div>
          <div className="mt-1 font-display text-3xl font-medium tabular-nums text-foreground">
            ${monthlyUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="font-mono text-[10.5px] text-muted-foreground">
            {(monthlyTokens / 1_000_000).toFixed(1)}M tokens
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
      {children}
    </label>
  );
}
