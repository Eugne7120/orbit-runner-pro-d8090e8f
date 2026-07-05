import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/orbit/PageShell";
import { PageHeader } from "@/components/orbit/PageHeader";
import { Section } from "@/components/orbit/Section";
import { MetricTile } from "@/components/orbit/MetricTile";
import { AreaChart } from "@/components/orbit/AreaChart";
import { RegionMap } from "@/components/orbit/RegionMap";
import { StatusPill } from "@/components/orbit/StatusPill";
import { PageBackground } from "@/components/orbit/PageBackground";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/runtime")({
  head: () => ({
    meta: [
      { title: "Runtime — 0RBIT" },
      { name: "description", content: "Live operational view of the 0RBIT network — requests, workers, latency, throughput, credits." },
      { property: "og:title", content: "Runtime — 0RBIT" },
      { property: "og:description", content: "Live view of the 0RBIT network." },
    ],
  }),
  component: RuntimePage,
});

function RuntimePage() {
  return (
    <PageShell>
      <PageBackground variant="map" />
      <PageHeader
        eyebrow="/ runtime"
        title="A live view of the network."
        intro="This is the operator's view — what our own on-call sees. Numbers move in real time. Nothing is cached. Nothing is polished for effect."
      />

      <Section eyebrow="/ health">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <StatusPill status="operational" label="all systems operational" />
          <StatusPill status="operational" label="us-west-2 · normal" />
          <StatusPill status="operational" label="eu-west-1 · normal" />
          <StatusPill status="elevated" label="ap-northeast-1 · elevated" />
          <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
            updated · <LiveClock />
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricTile label="requests / s" base={4820} variance={0.08} seed={11} />
          <MetricTile label="workers online" base={214} variance={0.02} chartColor="muted" seed={22} />
          <MetricTile label="p50 latency" base={41} unit="ms" variance={0.14} seed={33} />
          <MetricTile label="tokens / s" base={12400} variance={0.16} seed={44} />
          <MetricTile label="queue depth" base={0} variance={0.5} chartColor="muted" seed={55} hint="target 0" />
          <MetricTile label="gpu util · fleet" base={68} unit="%" variance={0.08} seed={66} />
          <MetricTile label="credits burned · min" base={182} unit=" cr" variance={0.12} chartColor="warm" seed={77} />
          <MetricTile label="stream throughput" base={9200} variance={0.14} seed={88} />
        </div>
      </Section>

      <Section eyebrow="/ regions" title="Traffic by region." intro="Each region is a set of independent workers under a shared router. The mesh rebalances continuously.">
        <div className="glass-strong rounded-3xl p-6 shadow-elegant md:p-8">
          <RegionMap />
        </div>
      </Section>

      <Section eyebrow="/ latency" title="Latency, unbucketed." intro="Live p50 · p95 · p99 across the network. The gap between percentiles is the fingerprint of the system.">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface/40 p-5">
            <AreaChart label="p50" base={41} variance={8} unit="ms" seed={101} height={160} />
          </div>
          <div className="rounded-2xl border border-border bg-surface/40 p-5">
            <AreaChart label="p95" base={140} variance={30} unit="ms" seed={102} height={160} color="warm" />
          </div>
          <div className="rounded-2xl border border-border bg-surface/40 p-5">
            <AreaChart label="p99" base={210} variance={55} unit="ms" seed={103} height={160} color="muted" />
          </div>
        </div>
      </Section>

      <Section eyebrow="/ workers" title="Fleet state." intro="A sample of active workers. Real fleet is larger and rotates constantly.">
        <WorkerTable />
      </Section>
    </PageShell>
  );
}

function LiveClock() {
  const [t, setT] = useState<string>(() => new Date().toISOString().slice(11, 19));
  useEffect(() => {
    const i = setInterval(() => setT(new Date().toISOString().slice(11, 19)), 1000);
    return () => clearInterval(i);
  }, []);
  return <span className="tabular-nums text-foreground">{t} UTC</span>;
}

const SAMPLE_WORKERS = [
  { id: "wrk_a19f", region: "us-west-2", model: "orbit-1", gpu: "H100", state: "serving" },
  { id: "wrk_c72e", region: "us-east-1", model: "orbit-1-mini", gpu: "L40S", state: "serving" },
  { id: "wrk_9d10", region: "eu-west-1", model: "orbit-1", gpu: "H100", state: "warm" },
  { id: "wrk_88ba", region: "eu-central-1", model: "embed-1", gpu: "L4", state: "serving" },
  { id: "wrk_4501", region: "ap-northeast-1", model: "orbit-1", gpu: "H100", state: "elevated" },
  { id: "wrk_ff02", region: "ap-southeast-1", model: "image-1", gpu: "A100", state: "serving" },
  { id: "wrk_2beb", region: "sa-east-1", model: "orbit-1-mini", gpu: "L40S", state: "warm" },
];

function WorkerTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface/40">
      <div className="grid grid-cols-[1fr_1fr_1fr_0.6fr_0.8fr_1fr] gap-4 border-b border-border px-5 py-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
        <span>worker</span>
        <span>region</span>
        <span>model</span>
        <span>gpu</span>
        <span>state</span>
        <span className="text-right">req / s</span>
      </div>
      {SAMPLE_WORKERS.map((w, i) => (
        <WorkerRow key={w.id} w={w} i={i} />
      ))}
    </div>
  );
}

function WorkerRow({ w, i }: { w: (typeof SAMPLE_WORKERS)[number]; i: number }) {
  const [rps, setRps] = useState(20 + Math.floor(Math.random() * 60));
  useEffect(() => {
    const t = setInterval(() => {
      setRps((r) => Math.max(2, r + Math.round((Math.random() - 0.5) * 8)));
    }, 1400 + i * 90);
    return () => clearInterval(t);
  }, [i]);
  const stateColor =
    w.state === "serving"
      ? "text-signal"
      : w.state === "warm"
        ? "text-muted-foreground"
        : "text-amber-300";
  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_0.6fr_0.8fr_1fr] gap-4 border-t border-border/60 px-5 py-3 font-mono text-[12px] transition-colors hover:bg-surface first:border-t-0">
      <span className="text-foreground">{w.id}</span>
      <span className="text-muted-foreground">{w.region}</span>
      <span className="text-foreground/80">{w.model}</span>
      <span className="text-muted-foreground">{w.gpu}</span>
      <span className={stateColor}>● {w.state}</span>
      <span className="text-right tabular-nums text-foreground">{rps}</span>
    </div>
  );
}
