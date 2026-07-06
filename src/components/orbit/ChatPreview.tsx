import { useEffect, useMemo, useRef, useState } from "react";

/**
 * 0RBIT — Runtime Chat Preview
 *
 * A living product preview. A scripted conversation loops forever:
 * user prompt → phased thinking (routing/selecting/inferring) → streamed
 * response (text + code + report) → next turn → clear → repeat.
 *
 * Around the chat: model selector, live status strip, and a small
 * request-flow signal that pulses while the assistant is answering.
 *
 * Pure React + CSS. No screenshots, no external assets.
 */

type Segment =
  | { kind: "text"; value: string }
  | { kind: "code"; lang: "python"; value: string }
  | {
      kind: "report";
      title: string;
      rows: { label: string; value: string; tone?: "ok" | "warn" }[];
    };

type Turn = {
  user: string;
  assistant: Segment[];
  think?: number;
};

const SCRIPT: Turn[] = [
  {
    user: "Explain distributed AI inference in simple terms.",
    think: 900,
    assistant: [
      {
        kind: "text",
        value:
          "Think of it as one endpoint backed by many small GPUs around the world. When you send a request, a router looks at price, latency and who's free right now, then hands the job to the best worker. That worker streams the answer back to you token by token. If it slows down, the next request goes somewhere else — the network keeps re-shaping itself so you always get the fastest path.",
      },
    ],
  },
  {
    user: "Generate a Python example that streams a response.",
    think: 700,
    assistant: [
      { kind: "text", value: "OpenAI-compatible client, streaming from the nearest worker:" },
      {
        kind: "code",
        lang: "python",
        value: `from orbit import Orbit

client = Orbit(api_key="orb_live_...")

stream = client.chat.completions.create(
    model="orbit-1",
    stream=True,
    messages=[
        {"role": "user", "content": "Say hi from the runtime."}
    ],
)

for chunk in stream:
    delta = chunk.choices[0].delta.content or ""
    print(delta, end="", flush=True)`,
      },
    ],
  },
  {
    user: "Summarize today's worker network status.",
    think: 800,
    assistant: [
      {
        kind: "text",
        value: "Network is healthy. Snapshot from the last 5 minutes:",
      },
      {
        kind: "report",
        title: "runtime · rolling 5m",
        rows: [
          { label: "workers online", value: "214 / 218", tone: "ok" },
          { label: "regions active", value: "12", tone: "ok" },
          { label: "p50 latency", value: "41 ms", tone: "ok" },
          { label: "p99 latency", value: "212 ms", tone: "ok" },
          { label: "tokens streamed", value: "1.42k / s" },
          { label: "settlement lag", value: "0.38 s" },
          { label: "eu-west-3 saturation", value: "82%", tone: "warn" },
        ],
      },
    ],
  },
];

const THINK_PHASES = [
  "Routing request",
  "Selecting worker",
  "Warming context",
  "Running inference",
];

const MODELS = [
  { id: "fast", label: "0RBIT Fast", hint: "8b · 32k" },
  { id: "pro", label: "0RBIT Pro", hint: "70b · 128k" },
  { id: "vision", label: "0RBIT Vision", hint: "multimodal" },
] as const;

/* ---------- syntax highlight (tiny, python only) ---------- */

function highlightPython(code: string) {
  const kw = /\b(from|import|for|in|print|None|True|False|as|def|return|if|else|and|or|not)\b/g;
  const str = /("[^"]*"|'[^']*')/g;
  const num = /\b(\d+)\b/g;
  const com = /(#[^\n]*)/g;
  let s = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  s = s.replace(com, '<span class="text-muted-foreground/70">$1</span>');
  s = s.replace(str, '<span class="text-emerald-300/85">$1</span>');
  s = s.replace(kw, '<span class="text-signal">$1</span>');
  s = s.replace(num, '<span class="text-amber-300/85">$1</span>');
  return s;
}

/* ---------- Signal flow (user → runtime → worker → user) ---------- */

function SignalFlow({ active }: { active: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
      {["user", "runtime", "worker", "user"].map((node, i, arr) => (
        <div key={i} className="flex flex-1 items-center gap-2 last:flex-none">
          <div
            className={`flex items-center gap-1.5 rounded-full border px-2 py-1 transition-colors ${
              active ? "border-signal/40 text-foreground/90" : "border-border text-muted-foreground"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                active ? "bg-signal shadow-[0_0_8px] shadow-signal" : "bg-muted-foreground/50"
              }`}
              style={{ animation: active ? `orbit-pulse 1.6s ${i * 0.15}s infinite` : "none" }}
            />
            {node}
          </div>
          {i < arr.length - 1 && (
            <div className="relative h-px flex-1 overflow-hidden bg-border">
              <div
                className={`absolute inset-y-0 -left-full h-px w-1/2 bg-gradient-to-r from-transparent via-signal to-transparent ${
                  active ? "animate-[flow_1.6s_linear_infinite]" : ""
                }`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            </div>
          )}
        </div>
      ))}
      <style>{`@keyframes flow { 0% { left: -50%; } 100% { left: 100%; } }`}</style>
    </div>
  );
}

/* ---------- Live status strip ---------- */

function useJitter(base: number, variance = 0.06, everyMs = 1600, decimals = 0) {
  const [v, setV] = useState(base);
  useEffect(() => {
    const id = setInterval(() => {
      const next = base * (1 + (Math.random() - 0.5) * variance * 2);
      setV(Number(next.toFixed(decimals)));
    }, everyMs);
    return () => clearInterval(id);
  }, [base, variance, everyMs, decimals]);
  return v;
}

function StatusStrip({ streaming, model }: { streaming: boolean; model: string }) {
  const workers = useJitter(214, 0.01, 2200);
  const latency = useJitter(41, 0.18, 1400);
  const credits = useJitter(1284, 0.02, 1800);

  const items = [
    { k: "workers", v: `${workers}`, hint: "online" },
    { k: "latency", v: `${latency}ms`, hint: "p50" },
    { k: "stream", v: streaming ? "active" : "idle", hint: "socket", live: streaming },
    { k: "api", v: "200 · ok", hint: "gateway", ok: true },
    { k: "credits", v: `${credits.toLocaleString()}`, hint: "used · 24h" },
    { k: "model", v: model, hint: "route" },
  ];

  return (
    <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-6">
      {items.map((it) => (
        <div key={it.k} className="flex flex-col gap-0.5 bg-surface/60 px-3 py-2.5">
          <div className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">
            {(it.live || it.ok) && (
              <span
                className={`h-1 w-1 rounded-full ${
                  it.live
                    ? "bg-signal animate-orbit-pulse shadow-[0_0_6px] shadow-signal"
                    : "bg-emerald-400/80"
                }`}
              />
            )}
            {it.k}
          </div>
          <div className="truncate font-mono text-[12px] tabular-nums text-foreground/90">
            {it.v}
          </div>
          <div className="truncate font-mono text-[9.5px] text-muted-foreground/70">{it.hint}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Component ---------- */

export function ChatPreview({ className = "" }: { className?: string }) {
  const [modelId, setModelId] = useState<(typeof MODELS)[number]["id"]>("fast");
  const [turnIdx, setTurnIdx] = useState(0);
  const [visibleTurns, setVisibleTurns] = useState<
    { user: string; assistant: Segment[]; streamed: string[] }[]
  >([]);
  const [thinking, setThinking] = useState(false);
  const [thinkPhase, setThinkPhase] = useState(0);
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const modelLabel = useMemo(
    () => MODELS.find((m) => m.id === modelId)?.label ?? "0RBIT Fast",
    [modelId],
  );

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((r) => {
        const t = setTimeout(() => r(), ms);
        timers.push(t);
      });

    const run = async () => {
      const turn = SCRIPT[turnIdx];

      // 1. User bubble
      setVisibleTurns((prev) => [
        ...prev,
        { user: turn.user, assistant: turn.assistant, streamed: turn.assistant.map(() => "") },
      ]);
      await wait(280);
      if (cancelled) return;

      // 2. Phased thinking
      setThinking(true);
      const phaseMs = Math.max(180, Math.floor((turn.think ?? 700) / THINK_PHASES.length));
      for (let p = 0; p < THINK_PHASES.length; p++) {
        setThinkPhase(p);
        await wait(phaseMs);
        if (cancelled) return;
      }
      setThinking(false);

      // 3. Stream
      setStreaming(true);
      for (let segIdx = 0; segIdx < turn.assistant.length; segIdx++) {
        const seg = turn.assistant[segIdx];
        const full =
          seg.kind === "report"
            ? seg.rows.map((r) => `${r.label} ${r.value}`).join("\n")
            : seg.value;
        const chunk = seg.kind === "code" ? 3 : seg.kind === "report" ? 4 : 2;
        const delay = seg.kind === "code" ? 14 : seg.kind === "report" ? 40 : 20;
        for (let i = 0; i <= full.length; i += chunk) {
          await wait(delay);
          if (cancelled) return;
          setVisibleTurns((prev) => {
            const copy = [...prev];
            const last = { ...copy[copy.length - 1] };
            const streamed = [...last.streamed];
            streamed[segIdx] = full.slice(0, i);
            last.streamed = streamed;
            copy[copy.length - 1] = last;
            return copy;
          });
        }
      }
      setStreaming(false);

      // 4. Pause, then advance / reset
      await wait(2000);
      if (cancelled) return;

      const next = turnIdx + 1;
      if (next >= SCRIPT.length) {
        await wait(600);
        if (cancelled) return;
        setVisibleTurns([]);
        setTurnIdx(0);
      } else {
        setTurnIdx(next);
      }
    };

    run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [turnIdx]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [visibleTurns, thinking]);

  const active = thinking || streaming;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Chat surface */}
      <div className="glass-strong overflow-hidden rounded-2xl shadow-elegant">
        {/* Header — model selector + status */}
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                active ? "bg-signal shadow-[0_0_10px] shadow-signal" : "bg-muted-foreground/50"
              }`}
            />
            <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              orbit · runtime
            </span>
          </div>

          <div className="flex items-center gap-1 rounded-full border border-border bg-surface/50 p-0.5">
            {MODELS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setModelId(m.id)}
                className={`rounded-full px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] transition-all ${
                  modelId === m.id
                    ? "bg-foreground/90 text-background"
                    : "text-muted-foreground hover:text-foreground/90"
                }`}
              >
                {m.label.replace("0RBIT ", "")}
              </button>
            ))}
          </div>
        </div>

        {/* Transcript */}
        <div
          ref={scrollRef}
          className="h-[440px] overflow-y-auto bg-[oklch(0.13_0.008_250)] px-5 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="mx-auto flex max-w-2xl flex-col gap-5">
            {visibleTurns.map((t, i) => (
              <div key={i} className="animate-orbit-fade-up flex flex-col gap-4">
                {/* User */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-sm border border-border bg-foreground/[0.06] px-4 py-2.5 text-[14px] text-foreground/90">
                    {t.user}
                  </div>
                </div>

                {/* Assistant */}
                <div className="flex gap-3">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-surface/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-3 text-[14px] leading-relaxed text-foreground/90">
                    {t.assistant.map((seg, j) => {
                      const streamed = t.streamed[j] ?? "";
                      const isLast = i === visibleTurns.length - 1;
                      const stillStreaming =
                        isLast &&
                        streamed.length <
                          (seg.kind === "report"
                            ? seg.rows.map((r) => `${r.label} ${r.value}`).join("\n").length
                            : (seg as { value: string }).value.length);

                      if (seg.kind === "text") {
                        return (
                          <p key={j} className="whitespace-pre-wrap">
                            {streamed}
                            {stillStreaming && (
                              <span className="ml-0.5 -mb-0.5 inline-block h-3 w-1.5 animate-orbit-blink bg-signal align-baseline" />
                            )}
                          </p>
                        );
                      }

                      if (seg.kind === "code") {
                        return (
                          <div
                            key={j}
                            className="overflow-hidden rounded-lg border border-border bg-[oklch(0.11_0.008_250)]"
                          >
                            <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
                              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                                {seg.lang}
                              </span>
                              <span className="font-mono text-[10.5px] text-muted-foreground/70">
                                {stillStreaming ? "streaming" : "complete"}
                              </span>
                            </div>
                            <pre
                              className="overflow-x-auto p-3 font-mono text-[12.5px] leading-relaxed text-foreground/90"
                              dangerouslySetInnerHTML={{ __html: highlightPython(streamed) }}
                            />
                          </div>
                        );
                      }

                      // Report
                      const revealedRows = Math.min(
                        seg.rows.length,
                        Math.ceil(
                          (streamed.length /
                            Math.max(
                              1,
                              seg.rows.map((r) => `${r.label} ${r.value}`).join("\n").length,
                            )) *
                            seg.rows.length,
                        ),
                      );
                      return (
                        <div
                          key={j}
                          className="overflow-hidden rounded-lg border border-border bg-[oklch(0.11_0.008_250)]"
                        >
                          <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
                            <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                              {seg.title}
                            </span>
                            <span className="font-mono text-[10.5px] text-muted-foreground/70">
                              live
                            </span>
                          </div>
                          <div className="divide-y divide-border">
                            {seg.rows.slice(0, revealedRows).map((r, k) => (
                              <div
                                key={k}
                                className="flex items-center justify-between px-3 py-1.5 font-mono text-[12px]"
                              >
                                <span className="text-muted-foreground">{r.label}</span>
                                <span
                                  className={
                                    r.tone === "warn"
                                      ? "text-amber-300/90"
                                      : r.tone === "ok"
                                        ? "text-emerald-300/90"
                                        : "text-foreground/90"
                                  }
                                >
                                  {r.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}

            {thinking && (
              <div className="animate-orbit-fade-up flex gap-3">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-surface/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-signal animate-orbit-pulse" />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="font-mono text-[11.5px] uppercase tracking-[0.16em] text-muted-foreground">
                    {THINK_PHASES[thinkPhase]}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/60 animate-orbit-blink" />
                    <span
                      className="h-1 w-1 rounded-full bg-muted-foreground/60 animate-orbit-blink"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <span
                      className="h-1 w-1 rounded-full bg-muted-foreground/60 animate-orbit-blink"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Signal flow */}
        <div className="border-t border-border px-4 py-2.5">
          <SignalFlow active={active} />
        </div>

        {/* Composer */}
        <div className="flex items-center gap-3 border-t border-border px-4 py-3">
          <div className="flex-1 rounded-full border border-border bg-surface/40 px-4 py-2 text-[13px] text-muted-foreground/70">
            Ask the runtime…
          </div>
          <button
            type="button"
            disabled
            aria-hidden
            className="rounded-full bg-foreground/90 px-3.5 py-2 text-[12px] font-medium text-background opacity-90"
          >
            Send ↵
          </button>
        </div>
      </div>

      {/* Status strip */}
      <StatusStrip streaming={active} model={modelLabel} />
    </div>
  );
}
