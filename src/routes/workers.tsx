import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { PageShell } from "@/components/orbit/PageShell";
import { PageHeader } from "@/components/orbit/PageHeader";
import { Section } from "@/components/orbit/Section";
import { PageBackground } from "@/components/orbit/PageBackground";
import { MetricTile } from "@/components/orbit/MetricTile";
import { AreaChart } from "@/components/orbit/AreaChart";
import { LiveCard } from "@/components/orbit/LiveCard";
import { StatusPill } from "@/components/orbit/StatusPill";
import { NetworkTopology } from "@/components/orbit/NetworkTopology";
import { ActivityFeed } from "@/components/orbit/ActivityFeed";
import { JobRoutingFlow } from "@/components/orbit/JobRoutingFlow";
import { Reveal } from "@/components/orbit/Reveal";

export const Route = createFileRoute("/workers")({
  head: () => ({
    meta: [
      { title: "Workers 0RBIT" },
      {
        name: "description",
        content:
          "How the 0RBIT worker network operates live topology, worker status, rewards and how to join the mesh.",
      },
      { property: "og:title", content: "Workers 0RBIT" },
      {
        property: "og:description",
        content: "A live look at the decentralized workers powering 0RBIT.",
      },
    ],
  }),
  component: WorkersPage,
});

function WorkersPage() {
  return (
    <PageShell>
      <PageBackground variant="network" />
      <PageHeader
        eyebrow="/ workers"
        title="The mesh that runs the models."
        intro="0RBIT has no data centers of its own. Every request is served by an independent worker a GPU, somewhere, running our runtime and earning credits for it. This is how that network operates."
      />

      <Section
        eyebrow="/ 01 · what workers are"
        title="A worker is compute, not a company."
        intro="Anyone with a capable GPU can join the mesh. Workers stake for priority, run the runtime binary, and start receiving jobs within minutes."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Reveal>
            <LiveCard
              eyebrow="/ contribute"
              title="Contribute compute"
              description="Idle GPU cycles are matched against live inference demand across the network."
            />
          </Reveal>
          <Reveal delay={80}>
            <LiveCard
              eyebrow="/ assign"
              title="Jobs get assigned"
              description="The scheduler scores every worker on latency, load and price, then routes in under a millisecond."
            />
          </Reveal>
          <Reveal delay={160}>
            <LiveCard
              eyebrow="/ earn"
              title="Rewards accrue"
              description="Completed inference settles instantly as credits redeemable, stakeable, on-chain."
            />
          </Reveal>
          <Reveal delay={240}>
            <LiveCard
              eyebrow="/ decentralize"
              title="No single point of failure"
              description="Thousands of independent nodes beat a handful of hyperscale regions on resilience and price."
            />
          </Reveal>
        </div>
      </Section>

      <Section
        eyebrow="/ 02 · network overview"
        title="The network, right now."
        intro="A live dashboard view of the mesh. Every number below moves continuously this is the same telemetry our schedulers see."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal delay={0}>
            <MetricTile label="workers online" base={214} variance={0.02} seed={201} />
          </Reveal>
          <Reveal delay={80}>
            <MetricTile
              label="available gpus"
              base={891}
              variance={0.03}
              chartColor="muted"
              seed={202}
            />
          </Reveal>
          <Reveal delay={160}>
            <MetricTile label="jobs running" base={3402} variance={0.12} seed={203} />
          </Reveal>
          <Reveal delay={240}>
            <MetricTile label="inference requests / s" base={4820} variance={0.1} seed={204} />
          </Reveal>
          <Reveal delay={80}>
            <MetricTile
              label="avg latency"
              base={41}
              unit="ms"
              variance={0.14}
              chartColor="warm"
              seed={205}
            />
          </Reveal>
          <Reveal delay={160}>
            <MetricTile
              label="success rate"
              base={99.6}
              unit="%"
              variance={0.002}
              chartColor="muted"
              seed={206}
              format={(n) => `${n.toFixed(2)}%`}
            />
          </Reveal>
          <Reveal delay={240}>
            <MetricTile
              label="network throughput"
              base={12400}
              unit=" tok/s"
              variance={0.16}
              seed={207}
            />
          </Reveal>
          <Reveal delay={320}>
            <MetricTile
              label="credits processed / min"
              base={1820}
              unit=" cr"
              variance={0.12}
              chartColor="warm"
              seed={208}
            />
          </Reveal>
        </div>
      </Section>

      <Section
        eyebrow="/ 03 · topology"
        title="Requests find the best worker."
        intro="A simplified view of the mesh: the scheduler holds no state of its own it just routes. Watch a request travel from client to scheduler to worker."
      >
        <Reveal>
          <div className="glass-strong rounded-3xl p-4 shadow-elegant md:p-8">
            <NetworkTopology />
          </div>
        </Reveal>
      </Section>

      <Section
        eyebrow="/ 04 · fleet"
        title="A sample of active workers."
        intro="Status, hardware and throughput for a slice of the live fleet. The real fleet is larger and rotates constantly."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_WORKERS.map((w, i) => (
            <Reveal key={w.id} delay={i * 80}>
              <WorkerCard worker={w} index={i} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="/ 05 · activity"
        title="Live from the network."
        intro="A rolling feed of what's happening across the mesh connections, completions, rewards, syncs."
      >
        <Reveal>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <ActivityFeed />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <StatCard label="events / min" base={38} />
              <StatCard label="active regions" base={11} variance={0.01} />
            </div>
          </div>
        </Reveal>
      </Section>

      <Section
        eyebrow="/ 06 · performance"
        title="How the fleet is performing."
        intro="Latency, distribution and saturation, generated straight from the runtime no snapshots, no cached charts."
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Reveal delay={0}>
            <div className="rounded-2xl border border-border bg-surface/40 p-5">
              <AreaChart label="latency" base={41} variance={9} unit="ms" seed={301} height={150} />
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="rounded-2xl border border-border bg-surface/40 p-5">
              <AreaChart
                label="gpu usage · fleet"
                base={68}
                variance={10}
                unit="%"
                seed={302}
                height={150}
                color="warm"
              />
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="rounded-2xl border border-border bg-surface/40 p-5">
              <AreaChart
                label="queue length"
                base={4}
                variance={3}
                seed={303}
                height={150}
                color="muted"
              />
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="rounded-2xl border border-border bg-surface/40 p-5">
              <AreaChart
                label="success rate"
                base={99.6}
                variance={0.3}
                unit="%"
                seed={304}
                height={150}
                format={(n) => `${n.toFixed(2)}%`}
              />
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="rounded-2xl border border-border bg-surface/40 p-5">
              <AreaChart label="throughput" base={9200} variance={1400} seed={305} height={150} />
            </div>
          </Reveal>
          <Reveal delay={240}>
            <div className="rounded-2xl border border-border bg-surface/40 p-5 md:col-span-1">
              <WorkerDistribution />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section
        eyebrow="/ 07 · job routing"
        title="From request to response."
        intro="Every job takes the same five-stage path through the runtime the scheduler never becomes the bottleneck."
      >
        <Reveal>
          <div className="glass-strong rounded-3xl p-8 shadow-elegant md:p-12">
            <JobRoutingFlow />
          </div>
        </Reveal>
      </Section>

      <Section
        eyebrow="/ 08 · become a worker"
        title="Turn your GPU into revenue."
        intro="Four steps between an idle card and a running node."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {BECOME_STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 80}>
              <div className="relative h-full">
                <div className="rounded-2xl border border-border bg-surface/40 p-6 transition-all duration-500 hover:border-border-strong hover:bg-surface h-full">
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
                    step {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mt-3 font-display text-lg font-medium tracking-tight text-foreground">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </div>
                {i < BECOME_STEPS.length - 1 && (
                  <div className="pointer-events-none absolute -right-4 top-1/2 hidden -translate-y-1/2 text-muted-foreground/40 lg:block">
                    →
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link
            to="/developers"
            className="btn-sheen group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-[14px] font-medium text-background transition-all hover:bg-foreground/90"
          >
            Download the worker binary
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </Section>

      <Section
        eyebrow="/ 09 · benefits"
        title="Why run a node."
        intro="Decentralized inference isn't just an architecture choice it changes the economics for everyone who contributes compute."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={i * 80}>
              <LiveCard
                eyebrow={`/ ${String(i + 1).padStart(2, "0")}`}
                title={b.title}
                description={b.body}
              />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="/ 10 · hardware"
        title="Supported hardware."
        intro="Estimated performance and reward tier for common cards. Actual rewards depend on live demand and uptime."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {HARDWARE.map((h, i) => (
            <Reveal key={h.name} delay={i * 80}>
              <div className="rounded-2xl border border-border bg-surface/40 p-6 transition-all duration-500 hover:border-border-strong hover:bg-surface h-full">
                <div className="flex items-start justify-between">
                  <h3 className="font-display text-lg font-medium tracking-tight text-foreground">
                    {h.name}
                  </h3>
                  <span className="rounded-full border border-border bg-surface/60 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    {h.tier}
                  </span>
                </div>
                <div className="mt-5 space-y-2.5">
                  <Row label="memory" value={h.memory} />
                  <Row label="est. performance" value={h.perf} />
                  <Row label="est. reward" value={h.reward} accent />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}

function Row({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-baseline justify-between border-t border-border py-2 first:border-t-0">
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
      <span
        className={`font-mono text-[13px] tabular-nums ${accent ? "text-signal" : "text-foreground"}`}
      >
        {value}
      </span>
    </div>
  );
}

function StatCard({
  label,
  base,
  variance = 0.2,
}: {
  label: string;
  base: number;
  variance?: number;
}) {
  const [v, setV] = useState(base);
  useEffect(() => {
    const t = setInterval(() => {
      setV((cur) => {
        const drift = (Math.random() - 0.5) * base * variance;
        const target = Math.max(0, base + drift);
        return cur + (target - cur) * 0.3;
      });
    }, 1100);
    return () => clearInterval(t);
  }, [base, variance]);
  return (
    <div className="flex h-full flex-col justify-center rounded-2xl border border-border bg-surface/40 p-6">
      <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 font-display text-3xl font-medium tabular-nums tracking-tight">
        {Math.round(v)}
      </div>
    </div>
  );
}

type WorkerStatus = "Idle" | "Busy" | "Streaming" | "Offline";

type WorkerDef = {
  id: string;
  location: string;
  gpu: string;
  status: WorkerStatus;
  jobs: number;
  latency: number;
  uptime: string;
  reward: string;
};

const SAMPLE_WORKERS: WorkerDef[] = [
  {
    id: "wrk_a19f2c",
    location: "Portland, US",
    gpu: "H100",
    status: "Streaming",
    jobs: 48210,
    latency: 32,
    uptime: "99.98%",
    reward: "1.4×",
  },
  {
    id: "wrk_c72e91",
    location: "Ashburn, US",
    gpu: "RTX 4090",
    status: "Busy",
    jobs: 21904,
    latency: 44,
    uptime: "99.81%",
    reward: "1.1×",
  },
  {
    id: "wrk_9d10bb",
    location: "Dublin, IE",
    gpu: "H100",
    status: "Idle",
    jobs: 61233,
    latency: 38,
    uptime: "99.95%",
    reward: "1.3×",
  },
  {
    id: "wrk_88bafe",
    location: "Frankfurt, DE",
    gpu: "RTX 3090",
    status: "Busy",
    jobs: 15877,
    latency: 51,
    uptime: "99.62%",
    reward: "1.0×",
  },
  {
    id: "wrk_4501aa",
    location: "Tokyo, JP",
    gpu: "RTX 5090",
    status: "Streaming",
    jobs: 9021,
    latency: 29,
    uptime: "99.90%",
    reward: "1.6×",
  },
  {
    id: "wrk_2bebcd",
    location: "São Paulo, BR",
    gpu: "M3 Max",
    status: "Offline",
    jobs: 4310,
    latency: 68,
    uptime: "97.10%",
    reward: "0.8×",
  },
];

const STATUS_STYLE: Record<WorkerStatus, { dot: string; text: string }> = {
  Idle: { dot: "bg-muted-foreground", text: "text-muted-foreground" },
  Busy: { dot: "bg-amber-300", text: "text-amber-300/90" },
  Streaming: { dot: "bg-signal", text: "text-signal" },
  Offline: { dot: "bg-rose-400", text: "text-rose-300/80" },
};

function WorkerCard({ worker, index }: { worker: WorkerDef; index: number }) {
  const [status, setStatus] = useState(worker.status);
  const [jobs, setJobs] = useState(worker.jobs);
  const cycle = useRef<WorkerStatus[]>(
    worker.status === "Offline" ? ["Offline", "Idle"] : ["Idle", "Busy", "Streaming"],
  );

  useEffect(() => {
    if (worker.status === "Offline") return;
    const t = setInterval(
      () => {
        setStatus((s) => {
          const opts = cycle.current;
          const idx = opts.indexOf(s);
          return opts[(idx + 1) % opts.length];
        });
      },
      4200 + index * 380,
    );
    return () => clearInterval(t);
  }, [worker.status, index]);

  useEffect(() => {
    if (status === "Offline") return;
    const t = setInterval(() => {
      setJobs((j) => j + (status === "Streaming" ? 2 : status === "Busy" ? 1 : 0));
    }, 1600);
    return () => clearInterval(t);
  }, [status]);

  const s = STATUS_STYLE[status];
  const delay = useMemo(() => `-${(index * 3) % 12}s`, [index]);

  return (
    <div
      className="orbit-float relative overflow-hidden rounded-2xl border border-border bg-surface/50 p-6 transition-all duration-500 hover:border-border-strong hover:bg-surface"
      style={{ animationDelay: delay, animationDuration: `${15 + (index % 4)}s` }}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[13px] text-foreground">{worker.id}</span>
        <StatusPill
          status={
            status === "Streaming" || status === "Idle"
              ? "operational"
              : status === "Busy"
                ? "elevated"
                : "degraded"
          }
          label={status}
        />
      </div>
      <div className="mt-1 font-mono text-[11px] text-muted-foreground">
        {worker.location} · {worker.gpu}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5">
        <Row label="jobs done" value={jobs.toLocaleString()} />
        <Row label="latency" value={`${worker.latency}ms`} />
        <Row label="uptime" value={worker.uptime} />
        <Row label="reward ×" value={worker.reward} accent />
      </div>
      <div className={`mt-4 flex items-center gap-1.5 font-mono text-[10.5px] ${s.text}`}>
        <span
          className={`h-1.5 w-1.5 rounded-full ${s.dot} ${status !== "Offline" ? "animate-orbit-pulse" : ""}`}
        />
        {status === "Offline" ? "last seen 14m ago" : "reporting now"}
      </div>
    </div>
  );
}

function WorkerDistribution() {
  const DATA = [
    { label: "us-west", pct: 24 },
    { label: "us-east", pct: 19 },
    { label: "eu-west", pct: 21 },
    { label: "ap-ne", pct: 14 },
    { label: "ap-se", pct: 12 },
    { label: "other", pct: 10 },
  ];
  return (
    <div className="w-full">
      <div className="mb-2 flex items-baseline justify-between">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
          worker distribution
        </div>
        <div className="font-mono text-[13px] tabular-nums text-foreground">by region</div>
      </div>
      <div className="space-y-2.5">
        {DATA.map((d) => (
          <div key={d.label} className="flex items-center gap-3">
            <span className="w-16 shrink-0 font-mono text-[10.5px] uppercase text-muted-foreground">
              {d.label}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-signal/70 transition-all duration-1000"
                style={{ width: `${d.pct}%` }}
              />
            </div>
            <span className="w-8 shrink-0 text-right font-mono text-[10.5px] tabular-nums text-muted-foreground">
              {d.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const BECOME_STEPS = [
  {
    title: "Download Worker",
    body: "Grab the runtime binary for Linux, macOS or Windows. No account required to start.",
  },
  {
    title: "Connect GPU",
    body: "The installer detects your hardware and benchmarks it against the network's baseline.",
  },
  {
    title: "Receive Jobs",
    body: "Once verified, the scheduler starts routing inference and embedding jobs to your node.",
  },
  {
    title: "Earn Rewards",
    body: "Credits settle per completed job and accrue toward your on-chain balance in real time.",
  },
];

const BENEFITS = [
  {
    title: "Earn passive income",
    body: "Idle GPU time converts directly into credits no marketplace listing, no negotiation.",
  },
  {
    title: "Privacy focused",
    body: "Workers never see raw request content beyond what's required to execute the job.",
  },
  {
    title: "No central servers",
    body: "There is no 0RBIT data center to fail. The network is the infrastructure.",
  },
  {
    title: "Global network",
    body: "Nodes across six continents mean requests are served from wherever they originate.",
  },
  {
    title: "Stake for higher rewards",
    body: "Staking credits against your node raises its priority tier and reward multiplier.",
  },
  {
    title: "Open infrastructure",
    body: "The routing protocol and worker spec are open anyone can build a compatible client.",
  },
];

const HARDWARE = [
  { name: "RTX 5090", memory: "32GB GDDR7", tier: "tier 1", perf: "~410 tok/s", reward: "1.6×" },
  { name: "RTX 4090", memory: "24GB GDDR6X", tier: "tier 1", perf: "~340 tok/s", reward: "1.4×" },
  { name: "RTX 3090", memory: "24GB GDDR6X", tier: "tier 2", perf: "~210 tok/s", reward: "1.0×" },
  {
    name: "Apple M3 Max",
    memory: "128GB unified",
    tier: "tier 2",
    perf: "~180 tok/s",
    reward: "0.9×",
  },
  {
    name: "RX 7900 XTX",
    memory: "24GB GDDR6",
    tier: "tier 2",
    perf: "~195 tok/s",
    reward: "0.95×",
  },
  {
    name: "H100 (datacenter)",
    memory: "80GB HBM3",
    tier: "tier 0",
    perf: "~980 tok/s",
    reward: "2.2×",
  },
];
