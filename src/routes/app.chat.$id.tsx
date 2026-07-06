import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { z } from "zod";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { RuntimePipeline } from "@/components/chat/RuntimePipeline";
import { ModelSelector } from "@/components/app/ModelSelector";
import { chatStore, type Message } from "@/lib/chat-store";
import { resolveModel, type OrbitModelId } from "@/lib/openai";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/app/chat/$id")({
  validateSearch: z.object({ q: z.string().optional() }),
  component: ChatView,
});

const FIRST_TOKEN_TIMEOUT_MS = 30_000;

async function streamChat(
  messages: { role: string; content: string }[],
  model: string,
  onDelta: (d: string) => void,
  signal: AbortSignal,
  onFirstToken?: () => void,
) {
  const res = await fetch("/app-chat-api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, model }),
    signal,
  });
  if (!res.ok || !res.body) throw new Error("Stream failed");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let gotFirstToken = false;

  // The free/rate-limited OpenRouter models occasionally hang without ever
  // producing a token. Bail out with a clear error instead of leaving the
  // UI looking frozen indefinitely.
  const timeoutId = setTimeout(() => {
    if (!gotFirstToken) reader.cancel().catch(() => {});
  }, FIRST_TOKEN_TIMEOUT_MS);

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        try {
          const parsed = JSON.parse(line.slice(6));
          if (parsed.content) {
            if (!gotFirstToken) {
              gotFirstToken = true;
              clearTimeout(timeoutId);
              onFirstToken?.();
            }
            onDelta(parsed.content);
          }
          if (parsed.done) return;
          if (parsed.error) throw new Error(parsed.error);
        } catch {
          /* ignore malformed SSE chunk */
        }
      }
    }
    if (!gotFirstToken) {
      throw new Error("The model didn't respond in time. Please try again.");
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

function ChatView() {
  const { id } = Route.useParams();
  const { q } = Route.useSearch();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [model, setModel] = useState<OrbitModelId>("0rbit-core");
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [waitingFirstToken, setWaitingFirstToken] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  // Stores the conversation id whose q-prompt has already been sent,
  // so remounts (React strict-mode, HMR) never trigger a second send.
  const didInitQ = useRef<string | null>(null);

  useEffect(() => {
    const conv = chatStore.get(id);
    if (!conv) {
      navigate({ to: "/app/chat" });
      return;
    }
    setMessages(conv.messages);
    setModel((conv.model as OrbitModelId) ?? "0rbit-core");
    // deliberately NOT touching didInitQ here — the q-effect owns it
  }, [id]);

  useEffect(() => {
    if (q && didInitQ.current !== id) {
      const conv = chatStore.get(id);
      if (conv && conv.messages.length === 0) {
        didInitQ.current = id; // mark before async work to block any re-run
        sendMessage(q);
      }
    }
  }, [q, id]);

  useEffect(() => {
    if (autoScroll) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, autoScroll]);

  // Cancel any in-flight stream when leaving the conversation (e.g. switching
  // chats or navigating away) so stale responses can't land later and
  // confuse a different conversation's state.
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, [id]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setAutoScroll(el.scrollHeight - el.scrollTop - el.clientHeight < 80);
  };

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || streaming) return;
      setInput("");
      setAutoScroll(true);

      const userMsg = chatStore.addMessage(id, { role: "user", content: text });
      setMessages((prev) => [...prev, userMsg]);

      const assistantMsg = chatStore.addMessage(id, { role: "assistant", content: "" });
      setMessages((prev) => [...prev, assistantMsg]);

      setStreaming(true);
      setWaitingFirstToken(true);
      abortRef.current = new AbortController();

      try {
        const conv = chatStore.get(id);
        const history = (conv?.messages ?? [])
          .slice(0, -1)
          .map((m) => ({ role: m.role, content: m.content }));

        let full = "";
        await streamChat(
          history,
          resolveModel(model),
          (delta) => {
            full += delta;
            chatStore.updateLastMessage(id, full);
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { ...updated[updated.length - 1], content: full };
              return updated;
            });
          },
          abortRef.current.signal,
          () => setWaitingFirstToken(false),
        );
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          const errMsg =
            err.message === "The model didn't respond in time. Please try again."
              ? err.message
              : "Something went wrong. Please try again.";
          chatStore.updateLastMessage(id, errMsg);
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { ...updated[updated.length - 1], content: errMsg };
            return updated;
          });
        }
      } finally {
        setStreaming(false);
        setWaitingFirstToken(false);
        abortRef.current = null;
      }
    },
    [id, model, streaming],
  );

  const handleStop = () => {
    abortRef.current?.abort();
    setStreaming(false);
    setWaitingFirstToken(false);
  };

  const handleRegenerate = useCallback(async () => {
    const conv = chatStore.get(id);
    if (!conv || conv.messages.length < 2) return;
    const lastUser = [...conv.messages].reverse().find((m) => m.role === "user");
    if (lastUser) sendMessage(lastUser.content);
  }, [id, sendMessage]);

  const handleModelChange = (m: OrbitModelId) => {
    setModel(m);
    chatStore.setModel(id, m);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat topbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/80 backdrop-blur-md flex-shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <ModelSelector value={model} onChange={handleModelChange} compact />
          <div className="hidden sm:flex items-center gap-2 px-2 py-1 rounded-md bg-signal/5 border border-signal/10">
            <div className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
            <span className="text-[10px] font-bold text-signal uppercase tracking-tighter">
              Live
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const c = chatStore.create(model);
              navigate({ to: "/app/chat/$id", params: { id: c.id } });
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-foreground bg-white/[0.05] border border-border hover:bg-white/[0.1] hover:border-border-strong transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New chat
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto py-8 scroll-smooth"
      >
        <div className="max-w-3xl mx-auto w-full">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => {
              const isLast = i === messages.length - 1;
              if (waitingFirstToken && isLast && msg.role === "assistant" && !msg.content) {
                return null;
              }
              return (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  isStreaming={streaming && isLast && msg.role === "assistant"}
                  onRegenerate={
                    !streaming && msg.role === "assistant" && isLast ? handleRegenerate : undefined
                  }
                />
              );
            })}
            {waitingFirstToken && <RuntimePipeline waiting={true} />}
          </AnimatePresence>
          <div ref={bottomRef} className="h-4" />
        </div>
      </div>

      {/* Composer */}
      <div className="flex-shrink-0 px-4 pb-6 pt-2 border-t border-border bg-background/50 backdrop-blur-md z-10">
        <div className="max-w-3xl mx-auto">
          <ChatComposer
            value={input}
            onChange={setInput}
            onSubmit={() => sendMessage(input)}
            onStop={handleStop}
            isStreaming={streaming}
            isEmpty={messages.length === 0}
            model={model}
          />
        </div>
      </div>
    </div>
  );
}
