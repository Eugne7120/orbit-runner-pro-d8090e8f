import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Interactive multi-language API demo.
 * - Language tabs (curl / Python / JavaScript / TypeScript) with smooth transitions.
 * - Real-looking POST /v1/chat/completions request.
 * - Copy button.
 * - Side panel streams a realistic AI response line-by-line, loops forever.
 */

type Lang = "curl" | "python" | "javascript" | "typescript";

const REQUEST_BODY = {
  model: "orbit-1",
  stream: true,
  temperature: 0.4,
  messages: [
    { role: "system", content: "You are a runtime engineer." },
    {
      role: "user",
      content: "How does the router decide which worker gets my request?",
    },
  ],
};

const REQUEST_JSON = JSON.stringify(REQUEST_BODY, null, 2);

const SNIPPETS: Record<Lang, { label: string; code: string }> = {
  curl: {
    label: "curl",
    code: `curl https://api.0rbit.dev/v1/chat/completions \\
  -H "Authorization: Bearer $ORBIT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${REQUEST_JSON.replace(/\n/g, "\n     ")}'`,
  },
  python: {
    label: "python",
    code: `from orbit import Orbit

client = Orbit(api_key=os.environ["ORBIT_API_KEY"])

stream = client.chat.completions.create(
    model="orbit-1",
    stream=True,
    temperature=0.4,
    messages=[
        {"role": "system", "content": "You are a runtime engineer."},
        {"role": "user", "content": "How does the router decide which worker gets my request?"},
    ],
)

for chunk in stream:
    print(chunk.choices[0].delta.content or "", end="", flush=True)`,
  },
  javascript: {
    label: "javascript",
    code: `import { Orbit } from "@orbit/sdk";

const orbit = new Orbit({ apiKey: process.env.ORBIT_API_KEY });

const stream = await orbit.chat.completions.create({
  model: "orbit-1",
  stream: true,
  temperature: 0.4,
  messages: [
    { role: "system", content: "You are a runtime engineer." },
    { role: "user", content: "How does the router decide which worker gets my request?" },
  ],
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0].delta.content ?? "");
}`,
  },
  typescript: {
    label: "typescript",
    code: `import { Orbit, type ChatCompletionChunk } from "@orbit/sdk";

const orbit = new Orbit({ apiKey: process.env.ORBIT_API_KEY! });

const stream = await orbit.chat.completions.create({
  model: "orbit-1",
  stream: true,
  temperature: 0.4,
  messages: [
    { role: "system", content: "You are a runtime engineer." },
    { role: "user", content: "How does the router decide which worker gets my request?" },
  ],
});

for await (const chunk of stream as AsyncIterable<ChatCompletionChunk>) {
  process.stdout.write(chunk.choices[0].delta.content ?? "");
}`,
  },
};

/* --- streamed response, loops --- */
const RESPONSE_LINES = [
  "▸ POST /v1/chat/completions",
  "▸ auth ok · key orb_live_9f2a…",
  "▸ router scoring 214 workers…",
  "▸ selected · wrk_a19f · eu-west-3 · H100",
  "▸ ttft · 38ms · stream open",
  "",
  "The router scores every live worker on four signals before your request",
  "leaves the gateway: predicted latency, current queue depth, per-token price,",
  "and geographic locality. The lowest weighted score wins. If it slows down",
  "mid-stream, the next chunk is quietly reassigned — you never see the swap.",
  "",
  "▸ 412 tokens · 218 tok/s · complete",
  "▸ receipt · rcp_7ab1 · signed",
];

/* --- tiny syntax highlighter --- */
function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlight(code: string, lang: Lang) {
  let s = esc(code);
  // strings
  s = s.replace(/("(?:[^"\\]|\\.)*")/g, '<span class="text-emerald-300/85">$1</span>');
  s = s.replace(/('(?:[^'\\]|\\.)*')/g, '<span class="text-emerald-300/85">$1</span>');
  // numbers
  s = s.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="text-amber-300/85">$1</span>');
  // comments
  if (lang === "python") {
    s = s.replace(/(^|\n)(\s*#[^\n]*)/g, '$1<span class="text-muted-foreground/70">$2</span>');
  } else {
    s = s.replace(/(\/\/[^\n]*)/g, '<span class="text-muted-foreground/70">$1</span>');
  }
  // keywords per lang
  const KW: Record<Lang, RegExp> = {
    curl: /\b(curl|POST|GET|Bearer|Authorization|Content-Type)\b/g,
    python: /\b(from|import|for|in|print|def|return|if|else|as|None|True|False|await|async)\b/g,
    javascript:
      /\b(import|from|const|let|var|await|async|for|of|new|return|if|else|export|default)\b/g,
    typescript:
      /\b(import|from|const|let|var|await|async|for|of|new|return|if|else|export|default|type|interface|as)\b/g,
  };
  s = s.replace(KW[lang], '<span class="text-signal">$1</span>');
  return s;
}

export function ApiCodeDemo({ className = "" }: { className?: string }) {
  const [lang, setLang] = useState<Lang>("python");
  const [copied, setCopied] = useState(false);
  const [lines, setLines] = useState<{ text: string; typed: string }[]>([]);
  const [running, setRunning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = SNIPPETS[lang];
  const highlighted = useMemo(() => highlight(active.code, lang), [active.code, lang]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(active.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* no-op */
    }
  };

  // Loop the response
  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((r) => {
        const t = setTimeout(() => r(), ms);
        timers.push(t);
      });

    const run = async () => {
      while (!cancelled) {
        setLines([]);
        setRunning(true);
        for (let i = 0; i < RESPONSE_LINES.length; i++) {
          if (cancelled) return;
          const text = RESPONSE_LINES[i];
          setLines((prev) => [...prev, { text, typed: "" }]);
          // type it out
          const step = text.length > 40 ? 4 : 2;
          for (let j = 0; j <= text.length; j += step) {
            await wait(text.length > 40 ? 12 : 24);
            if (cancelled) return;
            setLines((prev) => {
              const copy = [...prev];
              copy[copy.length - 1] = { text, typed: text.slice(0, j) };
              return copy;
            });
          }
          await wait(text === "" ? 60 : 120);
        }
        setRunning(false);
        await wait(2200);
        if (cancelled) return;
      }
    };
    run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  return (
    <div className={`grid gap-4 lg:grid-cols-2 ${className}`}>
      {/* Request */}
      <div className="glass-strong overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <div className="flex items-center gap-1 rounded-full border border-border bg-surface/50 p-0.5">
            {(Object.keys(SNIPPETS) as Lang[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`rounded-full px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] transition-all duration-200 ${
                  lang === l
                    ? "bg-foreground/90 text-background"
                    : "text-muted-foreground hover:text-foreground/90"
                }`}
              >
                {SNIPPETS[l].label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden font-mono text-[10.5px] text-muted-foreground sm:inline">
              chat.request
            </span>
            <button
              type="button"
              onClick={copy}
              className="rounded-md border border-border bg-surface/60 px-2 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground transition-all hover:border-border-strong hover:text-foreground"
            >
              {copied ? "copied" : "copy"}
            </button>
          </div>
        </div>
        <div className="relative">
          <pre
            key={lang}
            className="animate-orbit-fade-up max-h-[440px] overflow-auto bg-[oklch(0.13_0.008_250)] p-4 font-mono text-[12.5px] leading-relaxed"
          >
            <code
              className="text-foreground/90"
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </pre>
        </div>
      </div>

      {/* Response */}
      <div className="glass-strong overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                running ? "bg-signal animate-orbit-pulse shadow-[0_0_10px] shadow-signal" : "bg-emerald-400/80"
              }`}
            />
            response · {running ? "streaming" : "complete"}
          </div>
          <span className="font-mono text-[10.5px] text-muted-foreground/70">text/event-stream</span>
        </div>
        <div
          ref={scrollRef}
          className="h-[440px] overflow-y-auto bg-[oklch(0.13_0.008_250)] p-4 font-mono text-[13px] leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {lines.map((l, i) => {
            const isMeta = l.text.startsWith("▸");
            const isTyping = i === lines.length - 1 && l.typed.length < l.text.length;
            if (l.text === "") return <div key={i} className="h-3" />;
            return (
              <div
                key={i}
                className={
                  isMeta
                    ? "text-signal/90"
                    : "text-foreground/90"
                }
              >
                {l.typed}
                {isTyping && (
                  <span className="ml-0.5 -mb-0.5 inline-block h-3 w-1.5 animate-orbit-blink bg-signal align-baseline" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
