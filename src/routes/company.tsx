import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/orbit/PageShell";
import { PageHeader } from "@/components/orbit/PageHeader";
import { Section } from "@/components/orbit/Section";
import { LiveCard } from "@/components/orbit/LiveCard";
import { RegionMap } from "@/components/orbit/RegionMap";
import { PageBackground } from "@/components/orbit/PageBackground";
import { Reveal } from "@/components/orbit/Reveal";

export const Route = createFileRoute("/company")({
  head: () => ({
    meta: [
      { title: "Company — 0RBIT" },
      {
        name: "description",
        content: "Who is building the decentralized runtime for AI, and how to reach us.",
      },
      { property: "og:title", content: "Company — 0RBIT" },
      { property: "og:description", content: "Who is building the decentralized runtime for AI." },
    ],
  }),
  component: CompanyPage,
});

const timeline = [
  {
    d: "2025 · Q1",
    t: "0RBIT Labs founded.",
    b: "A small team, one thesis: the runtime should not belong to one provider.",
  },
  {
    d: "2025 · Q3",
    t: "First worker joins the mesh.",
    b: "12 workers · 3 regions · closed alpha with 40 engineers.",
  },
  {
    d: "2025 · Q4",
    t: "Public beta.",
    b: "OpenAI-compatible endpoint, signed receipts, Solana settlement.",
  },
  {
    d: "2026 · Q1",
    t: "Runtime v1.0.",
    b: "214 workers · 12 regions · 42M requests/day · streaming by default.",
  },
  {
    d: "2026 · Q3",
    t: "Enterprise lanes.",
    b: "Dedicated workers, region pinning, audit exports.",
  },
];

function CompanyPage() {
  return (
    <PageShell>
      <PageBackground variant="map" />
      <PageHeader
        eyebrow="/ company"
        title="A small team, building the layer under the layer."
        intro="0RBIT Labs was founded in 2025 by engineers who spent a decade shipping inference at scale and got tired of the bill for it. We ship quietly, in public."
      />

      <Section
        eyebrow="/ network"
        title="Global by construction."
        intro="Every worker is independent. Every region is a peer. The network has no center."
      >
        <Reveal>
          <div className="glass-strong rounded-3xl p-6 shadow-elegant md:p-8">
            <RegionMap />
          </div>
        </Reveal>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { k: "regions", v: "12" },
            { k: "workers", v: "214" },
            { k: "requests · day", v: "42.1M" },
            { k: "uptime · 30d", v: "99.994%" },
          ].map((s, i) => (
            <Reveal key={s.k} delay={i * 80}>
              <div className="rounded-xl border border-border bg-surface/40 p-5 h-full">
                <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
                  {s.k}
                </div>
                <div className="mt-2 font-display text-2xl tabular-nums tracking-tight">{s.v}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="/ timeline" title="Where we came from. Where we are.">
        <div className="mx-auto max-w-3xl">
          {timeline.map((t, i) => (
            <Reveal key={t.d} delay={i * 60}>
              <div
                className={`grid grid-cols-[100px_1fr] gap-6 py-6 ${i > 0 ? "border-t border-border" : ""}`}
              >
                <div className="pt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {t.d}
                </div>
                <div>
                  <h3 className="font-display text-lg tracking-tight">{t.t}</h3>
                  <p className="mt-1 text-[14.5px] leading-relaxed text-muted-foreground">{t.b}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="/ operating principles">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              eyebrow: "ship",
              title: "Runtime, not marketing.",
              description:
                "The product argues for itself. Our best week is the one where the changelog is long and the homepage is quiet.",
            },
            {
              eyebrow: "write",
              title: "Docs before slides.",
              description:
                "If it isn't in the docs, it isn't in the product. Every feature ships with the reference it deserves.",
            },
            {
              eyebrow: "respect",
              title: "Developers first, always.",
              description:
                "We measure success by the number of people building things they couldn't have built yesterday.",
            },
            {
              eyebrow: "operate",
              title: "Nines are cultural.",
              description:
                "Uptime is not a target. It is a promise. Everyone in the company can page the network.",
            },
            {
              eyebrow: "settle",
              title: "On-chain, invisible.",
              description:
                "Solana is the ledger. It is never the pitch. The user should never feel it.",
            },
            {
              eyebrow: "stay",
              title: "Independent.",
              description:
                "We take capital that lets us stay small and stay honest. We are here for a decade.",
            },
          ].map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <LiveCard eyebrow={p.eyebrow} title={p.title} description={p.description} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="/ contact" title="Talk to us.">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { k: "General", v: "hello@0rbit.dev" },
            { k: "Sales", v: "sales@0rbit.dev" },
            { k: "Press", v: "press@0rbit.dev" },
          ].map((c, i) => (
            <Reveal key={c.k} delay={i * 80}>
              <div className="rounded-xl border border-border bg-surface/40 p-6 transition-all hover:border-border-strong hover:bg-surface h-full">
                <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                  {c.k}
                </div>
                <div className="mt-3 font-mono text-[14px] text-foreground">{c.v}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
