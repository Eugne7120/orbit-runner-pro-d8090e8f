import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/orbit/PageShell";
import { Section } from "@/components/orbit/Section";
import { PageBackground } from "@/components/orbit/PageBackground";
import { MetricTile } from "@/components/orbit/MetricTile";
import { LiveCard } from "@/components/orbit/LiveCard";
import { ValueFlowDiagram } from "@/components/orbit/ValueFlowDiagram";
import { BuybackBurnFlow } from "@/components/orbit/BuybackBurnFlow";
import { StakingPreview } from "@/components/orbit/StakingPreview";
import { RewardTimeline } from "@/components/orbit/RewardTimeline";
import { EconomicFlywheel } from "@/components/orbit/EconomicFlywheel";
import { FaqAccordion } from "@/components/orbit/FaqAccordion";
import { Reveal } from "@/components/orbit/Reveal";

export const Route = createFileRoute("/economy")({
  head: () => ({
    meta: [
      { title: "Economy — 0RBIT" },
      {
        name: "description",
        content:
          "How the $0RBIT token economy works — treasury, buyback and burn, staking rewards, and the flywheel that powers the network.",
      },
      { property: "og:title", content: "Economy — 0RBIT" },
      {
        property: "og:description",
        content: "A transparent, usage-backed token economy for decentralized AI.",
      },
    ],
  }),
  component: EconomyPage,
});

function EconomyPage() {
  return (
    <PageShell>
      <PageBackground variant="credits" />

      <Hero />

      <Section
        eyebrow="/ 01 · value flow"
        title="Every inference feeds the economy."
        intro="A single request turns into revenue, then splits between burning supply and paying stakers in USDC. No step is hidden."
      >
        <Reveal>
          <div className="glass-strong rounded-3xl p-6 shadow-elegant md:p-10">
            <ValueFlowDiagram />
          </div>
        </Reveal>
      </Section>

      <Section
        id="tokenomics"
        eyebrow="/ 02 · treasury"
        title="The treasury, live."
        intro="Every figure below is generated from the same telemetry the runtime uses internally — nothing here is a static snapshot."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal delay={0}>
            <MetricTile
              label="treasury balance"
              base={4820000}
              unit=" USDC"
              variance={0.02}
              seed={401}
            />
          </Reveal>
          <Reveal delay={80}>
            <MetricTile
              label="daily revenue"
              base={38200}
              unit=" USDC"
              variance={0.1}
              chartColor="warm"
              seed={402}
            />
          </Reveal>
          <Reveal delay={160}>
            <MetricTile
              label="usdc rewards / day"
              base={19100}
              unit=" USDC"
              variance={0.1}
              seed={403}
            />
          </Reveal>
          <Reveal delay={240}>
            <MetricTile
              label="buyback today"
              base={19100}
              unit=" USDC"
              variance={0.12}
              chartColor="warm"
              seed={404}
            />
          </Reveal>
          <Reveal delay={80}>
            <MetricTile
              label="tokens burned / day"
              base={214000}
              unit=" $0RBIT"
              variance={0.14}
              seed={405}
            />
          </Reveal>
          <Reveal delay={160}>
            <MetricTile
              label="active stakers"
              base={8420}
              variance={0.02}
              chartColor="muted"
              seed={406}
            />
          </Reveal>
          <Reveal delay={240}>
            <MetricTile
              label="staked supply"
              base={41.2}
              unit="%"
              variance={0.01}
              format={(n) => `${n.toFixed(1)}%`}
              chartColor="muted"
              seed={407}
            />
          </Reveal>
          <Reveal delay={320}>
            <MetricTile
              label="apr estimate"
              base={14.2}
              unit="%"
              variance={0.03}
              format={(n) => `${n.toFixed(1)}%`}
              seed={408}
            />
          </Reveal>
        </div>
      </Section>

      <Section
        id="utility"
        eyebrow="/ 03 · utility"
        title="What holding $0RBIT does."
        intro="The token isn't a ticket — it's a claim on the economics of the network."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {UTILITY.map((u, i) => (
            <Reveal key={u.title} delay={i * 80}>
              <LiveCard
                eyebrow={`/ ${String(i + 1).padStart(2, "0")}`}
                title={u.title}
                description={u.body}
              />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        id="buyback"
        eyebrow="/ 04 · buyback & burn"
        title="Revenue becomes scarcity."
        intro="Half of platform revenue is used to buy $0RBIT on the open market and burn it — permanently, verifiably."
      >
        <Reveal>
          <div className="glass-strong rounded-3xl p-6 shadow-elegant md:p-10">
            <BuybackBurnFlow />
          </div>
        </Reveal>
      </Section>

      <Section
        id="staking"
        eyebrow="/ 05 · staking"
        title="Stake, earn, compound."
        intro="A preview of the staking dashboard. Connect a wallet at launch — for now, try it with demo balances."
      >
        <Reveal>
          <StakingPreview />
        </Reveal>
      </Section>

      <Section
        eyebrow="/ 06 · schedule"
        title="The daily reward cycle."
        intro="Treasury settlement runs on a fixed daily loop, the same one every staker's rewards move through."
      >
        <Reveal>
          <div className="glass-strong rounded-3xl p-6 shadow-elegant md:p-10">
            <RewardTimeline />
          </div>
        </Reveal>
      </Section>

      <Section
        id="statistics"
        eyebrow="/ 07 · statistics"
        title="Token statistics."
        intro="Supply-side numbers move slowly by design — this is a monetary policy, not a trading chart."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal delay={0}>
            <MetricTile
              label="total supply"
              base={1_000_000_000}
              unit=""
              variance={0}
              chart={false}
              seed={501}
            />
          </Reveal>
          <Reveal delay={80}>
            <MetricTile
              label="circulating supply"
              base={612_400_000}
              unit=""
              variance={0.001}
              chart={false}
              seed={502}
            />
          </Reveal>
          <Reveal delay={160}>
            <MetricTile
              label="burned supply"
              base={38_900_000}
              unit=""
              variance={0.004}
              chart={false}
              seed={503}
            />
          </Reveal>
          <Reveal delay={240}>
            <MetricTile
              label="daily volume"
              base={2_140_000}
              unit=" USDC"
              variance={0.18}
              chartColor="warm"
              seed={504}
            />
          </Reveal>
          <Reveal delay={80}>
            <MetricTile
              label="staking ratio"
              base={41.2}
              unit="%"
              variance={0.01}
              format={(n) => `${n.toFixed(1)}%`}
              chart={false}
              seed={505}
            />
          </Reveal>
          <Reveal delay={160}>
            <MetricTile
              label="workers staked"
              base={5210}
              variance={0.02}
              chartColor="muted"
              seed={506}
            />
          </Reveal>
          <Reveal delay={240}>
            <MetricTile
              label="premium workers"
              base={1840}
              variance={0.03}
              chartColor="muted"
              seed={507}
            />
          </Reveal>
          <Reveal delay={320}>
            <MetricTile
              label="market activity"
              base={98.4}
              unit="%"
              variance={0.005}
              format={(n) => `${n.toFixed(1)}%`}
              chart={false}
              seed={508}
            />
          </Reveal>
        </div>
      </Section>

      <Section
        id="flywheel"
        eyebrow="/ 08 · flywheel"
        title="Why growth compounds."
        intro="Usage doesn't just generate revenue once — it strengthens every part of the network that produces the next request."
      >
        <Reveal>
          <div className="glass-strong rounded-3xl p-6 shadow-elegant md:p-10">
            <EconomicFlywheel />
          </div>
        </Reveal>
      </Section>

      <Section
        id="faq"
        eyebrow="/ 09 · faq"
        title="Questions, answered plainly."
        intro="No jargon. If something's unclear, it stays unclear until it isn't."
      >
        <FaqAccordion items={FAQ} />
      </Section>
    </PageShell>
  );
}

function Hero() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 pb-16 pt-10">
      <div className="max-w-3xl animate-orbit-fade-up">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_8px] shadow-signal" />/
          economy
        </div>
        <h1 className="text-balance font-display text-5xl font-medium tracking-[-0.035em] text-foreground md:text-6xl">
          The economy behind every inference.
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-[17px] leading-relaxed text-muted-foreground md:text-[18px]">
          Every AI request contributes to a sustainable token economy powered by real compute usage
          — not speculation.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#tokenomics"
            className="btn-sheen group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[14px] font-medium text-background transition-all hover:bg-foreground/90"
          >
            View Tokenomics
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </a>
          <a
            href="#staking"
            className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-5 py-2.5 text-[14px] font-medium text-foreground transition-all hover:bg-surface-2"
          >
            Start Staking
          </a>
        </div>
      </div>
      <div className="mt-14 h-px w-full bg-gradient-to-r from-transparent via-border-strong to-transparent" />
    </section>
  );
}

const UTILITY = [
  {
    title: "Stake to earn USDC",
    body: "Staked $0RBIT earns a share of daily platform revenue, paid in USDC — not inflationary token emissions.",
  },
  {
    title: "Higher worker rewards",
    body: "Workers who stake unlock a reward multiplier on every job they complete.",
  },
  {
    title: "Daily free credits",
    body: "Holders above a threshold receive a small daily credit allowance, automatically.",
  },
  {
    title: "Priority job allocation",
    body: "Staked workers are preferred by the scheduler during periods of high demand.",
  },
  {
    title: "Governance ready",
    body: "Protocol parameters — fee splits, burn rate, emission schedule — move to token-holder governance over time.",
  },
  {
    title: "Deflationary economy",
    body: "Supply only moves in one direction: down. Every buyback permanently removes tokens from circulation.",
  },
];

const FAQ = [
  {
    q: "Why stake?",
    a: "Staking is the only way to earn a direct share of platform revenue. Staked tokens also raise a worker's priority in the scheduler and a holder's reward multiplier.",
  },
  {
    q: "How are rewards calculated?",
    a: "50% of daily platform revenue is converted to USDC and distributed to stakers, proportional to their share of total staked supply.",
  },
  {
    q: "Where does revenue come from?",
    a: "Every inference request is metered and billed in credits. That revenue funds the treasury, which powers both rewards and buybacks.",
  },
  {
    q: "How does buyback work?",
    a: "The other 50% of revenue is used to buy $0RBIT on the open market. Purchased tokens are sent to a burn address and permanently removed from supply.",
  },
  {
    q: "Is staking required?",
    a: "No. You can hold, use, or transact with $0RBIT without staking. Staking is opt-in for anyone who wants a share of network revenue.",
  },
];
