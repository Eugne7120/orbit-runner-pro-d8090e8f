/**
 * Docs flow diagrams — pure SVG + CSS, no images.
 * All animation is subtle: dashed flowing lines and a slow pulse on nodes.
 */

function Node({
  x,
  y,
  w = 120,
  h = 44,
  label,
  sub,
  accent = false,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <g transform={`translate(${x - w / 2}, ${y - h / 2})`}>
      <rect
        width={w}
        height={h}
        rx={10}
        fill="oklch(0.16 0.014 250 / 0.85)"
        stroke={accent ? "oklch(0.78 0.14 232 / 0.6)" : "oklch(0.4 0.02 250 / 0.6)"}
        strokeWidth={0.75}
      />
      <text
        x={w / 2}
        y={sub ? h / 2 - 2 : h / 2 + 4}
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize={11}
        fill="oklch(0.92 0 0)"
      >
        {label}
      </text>
      {sub && (
        <text
          x={w / 2}
          y={h / 2 + 12}
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize={9}
          fill="oklch(0.62 0.02 250)"
        >
          {sub}
        </text>
      )}
    </g>
  );
}

function Flow({ d, delay = 0 }: { d: string; delay?: number }) {
  return (
    <>
      <path d={d} fill="none" stroke="oklch(0.4 0.02 250 / 0.5)" strokeWidth={0.75} />
      <path
        d={d}
        fill="none"
        stroke="oklch(0.78 0.14 232 / 0.8)"
        strokeWidth={1}
        strokeDasharray="4 6"
        style={{ animation: `docs-flow 3.6s linear ${delay}s infinite` }}
      />
    </>
  );
}

function Frame({ children, height = 260 }: { children: React.ReactNode; height?: number }) {
  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-border bg-surface/40 p-4">
      <style>{`@keyframes docs-flow { to { stroke-dashoffset: -60 } }`}</style>
      <svg viewBox={`0 0 720 ${height}`} className="h-auto w-full">
        {children}
      </svg>
    </div>
  );
}

export function RequestFlow() {
  return (
    <Frame>
      <Node x={80} y={130} label="Client" sub="SDK" />
      <Node x={240} y={70} label="Edge Gateway" sub="TLS + auth" accent />
      <Node x={240} y={190} label="Router" sub="fit + cost" />
      <Node x={440} y={130} label="Worker" sub="us-west-2" accent />
      <Node x={620} y={70} label="Ledger" sub="receipt" />
      <Node x={620} y={190} label="Client" sub="tokens" />

      <Flow d="M 140 130 C 180 130, 180 80, 200 75" delay={0} />
      <Flow d="M 140 130 C 180 130, 180 180, 200 190" delay={0.4} />
      <Flow d="M 280 75 C 340 75, 340 130, 400 130" delay={0.8} />
      <Flow d="M 280 190 C 340 190, 340 130, 400 130" delay={1.2} />
      <Flow d="M 480 130 C 540 130, 540 75, 580 75" delay={1.6} />
      <Flow d="M 480 130 C 540 130, 540 190, 580 190" delay={2.0} />
    </Frame>
  );
}

export function ArchDiagram() {
  return (
    <Frame height={280}>
      <Node x={110} y={50} label="SDKs" sub="ts · py · go · rs" />
      <Node x={110} y={140} label="Public API" sub="OpenAI-compat" accent />
      <Node x={110} y={230} label="Webhooks" sub="receipts" />
      <Node x={360} y={50} label="Router" sub="constraint solver" />
      <Node x={360} y={140} label="Runtime" sub="scheduler + cache" accent />
      <Node x={360} y={230} label="Observer" sub="metrics · traces" />
      <Node x={610} y={50} label="Worker mesh" sub="214 nodes" />
      <Node x={610} y={140} label="Model store" sub="warm weights" accent />
      <Node x={610} y={230} label="Settlement" sub="signed ledger" />

      <Flow d="M 170 50 L 300 50" delay={0} />
      <Flow d="M 170 140 L 300 140" delay={0.3} />
      <Flow d="M 170 230 L 300 230" delay={0.6} />
      <Flow d="M 420 50 L 550 50" delay={0.9} />
      <Flow d="M 420 140 L 550 140" delay={1.2} />
      <Flow d="M 420 230 L 550 230" delay={1.5} />
      <Flow d="M 360 80 L 360 110" delay={1.8} />
      <Flow d="M 360 170 L 360 200" delay={2.1} />
    </Frame>
  );
}

export function WorkerSelection() {
  return (
    <Frame>
      <Node x={90} y={130} label="Request" sub="model + region" />
      <Node x={280} y={60} label="Candidates" sub="hot workers" />
      <Node x={280} y={130} label="Score" sub="cost · latency · fit" accent />
      <Node x={280} y={200} label="Filter" sub="quotas · policy" />
      <Node x={490} y={130} label="Winner" sub="lowest cost/token" accent />
      <Node x={640} y={130} label="Dispatch" />

      <Flow d="M 150 130 L 220 60" delay={0} />
      <Flow d="M 150 130 L 220 130" delay={0.3} />
      <Flow d="M 150 130 L 220 200" delay={0.6} />
      <Flow d="M 340 60 L 430 130" delay={0.9} />
      <Flow d="M 340 130 L 430 130" delay={1.1} />
      <Flow d="M 340 200 L 430 130" delay={1.3} />
      <Flow d="M 550 130 L 580 130" delay={1.7} />
    </Frame>
  );
}

export function InferencePipeline() {
  const stages = [
    { x: 90, label: "Tokenize", sub: "bpe" },
    { x: 230, label: "Prefill", sub: "kv cache" },
    { x: 370, label: "Decode", sub: "sampled" },
    { x: 510, label: "Detokenize", sub: "utf-8" },
    { x: 650, label: "Emit", sub: "sse" },
  ];
  return (
    <Frame height={160}>
      {stages.map((s, i) => (
        <Node key={s.label} x={s.x} y={80} label={s.label} sub={s.sub} accent={i === 1 || i === 4} />
      ))}
      {stages.slice(0, -1).map((s, i) => (
        <Flow key={i} d={`M ${s.x + 60} 80 L ${stages[i + 1].x - 60} 80`} delay={i * 0.3} />
      ))}
    </Frame>
  );
}

export function StreamingProcess() {
  return (
    <Frame height={200}>
      <Node x={90} y={100} label="Client" sub="EventSource" />
      <Node x={290} y={100} label="Gateway" sub="SSE broker" accent />
      <Node x={490} y={50} label="Worker" sub="token stream" />
      <Node x={490} y={150} label="Recorder" sub="usage tap" />
      <Node x={650} y={100} label="Receipt" sub="on close" accent />

      <Flow d="M 150 100 L 230 100" delay={0} />
      <Flow d="M 350 100 L 430 50" delay={0.3} />
      <Flow d="M 430 50 L 350 100" delay={0.6} />
      <Flow d="M 350 100 L 150 100" delay={0.9} />
      <Flow d="M 430 50 L 430 150" delay={1.2} />
      <Flow d="M 550 150 L 590 100" delay={1.5} />
    </Frame>
  );
}

export function CreditFlowDiagram() {
  return (
    <Frame height={220}>
      <Node x={90} y={110} label="Request" />
      <Node x={270} y={110} label="Meter" sub="tokens in/out" accent />
      <Node x={450} y={50} label="Price book" sub="per model" />
      <Node x={450} y={170} label="Wallet" sub="credits" accent />
      <Node x={640} y={110} label="Ledger" sub="signed entry" />

      <Flow d="M 150 110 L 210 110" delay={0} />
      <Flow d="M 330 110 L 390 50" delay={0.3} />
      <Flow d="M 330 110 L 390 170" delay={0.6} />
      <Flow d="M 510 50 L 580 110" delay={0.9} />
      <Flow d="M 510 170 L 580 110" delay={1.2} />
    </Frame>
  );
}
