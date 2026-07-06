import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChatMessage } from "./ChatMessage";
import type { Message } from "@/lib/chat-store";
import { X } from "lucide-react";

const DEMO_STEPS = [
  {
    role: "user" as const,
    content: "How does 0RBIT handle distributed inference across multiple GPU nodes?",
    delay: 1000,
  },
  {
    role: "assistant" as const,
    content:
      "0RBIT utilizes a decentralized orchestration layer to split model weights and execution across our global network of GPU workers. \n\nKey features include:\n- **Dynamic Load Balancing**: Requests are routed to the nearest available node with the required VRAM.\n- **Quantized Streaming**: We use 4-bit and 8-bit quantization to minimize latency during inter-node communication.\n- **Fault Tolerance**: If a node goes offline, the task is instantly re-routed without losing state.\n\nHere is a simple example of how our SDK initializes a distributed session:",
    delay: 2000,
    stream: true,
  },
  {
    role: "assistant" as const,
    content:
      "```typescript\nimport { Orbit } from '@0rbit/sdk';\n\nconst client = new Orbit({\n  apiKey: process.env.ORBIT_API_KEY,\n  strategy: 'low-latency'\n});\n\n// Initialize distributed inference\nconst result = await client.chat.completions.create({\n  model: '0rbit-core',\n  messages: [{ role: 'user', content: 'Ping' }],\n  distributed: true\n});\n```",
    delay: 1000,
    stream: true,
  },
];

interface ChatDemoProps {
  onClose: () => void;
}

export function ChatDemo({ onClose }: ChatDemoProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [streamedContent, setStreamedContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const runDemo = async () => {
      if (stepIndex >= DEMO_STEPS.length) {
        // Wait and restart
        timeout = setTimeout(() => {
          setMessages([]);
          setStepIndex(0);
          setStreamedContent("");
        }, 5000);
        return;
      }

      const step = DEMO_STEPS[stepIndex];

      if (step.role === "user") {
        timeout = setTimeout(() => {
          const userMsg: Message = {
            id: `demo-user-${stepIndex}`,
            role: "user",
            content: step.content,
            createdAt: new Date(),
          };
          setMessages((prev) => [...prev, userMsg]);
          setIsThinking(true);
          setStepIndex(stepIndex + 1);
        }, step.delay);
      } else {
        // Assistant
        timeout = setTimeout(async () => {
          setIsThinking(false);
          const assistantMsgId = `demo-assistant-${stepIndex}`;

          if (step.stream) {
            let current = "";
            const words = step.content.split(" ");

            for (let i = 0; i < words.length; i++) {
              current += words[i] + (i === words.length - 1 ? "" : " ");
              setStreamedContent(current);

              setMessages((prev) => {
                const filtered = prev.filter((m) => m.id !== assistantMsgId);
                return [
                  ...filtered,
                  {
                    id: assistantMsgId,
                    role: "assistant",
                    content: current,
                    createdAt: new Date(),
                  },
                ];
              });

              await new Promise((r) => setTimeout(r, 40 + Math.random() * 30));
            }
          } else {
            setMessages((prev) => [
              ...prev,
              {
                id: assistantMsgId,
                role: "assistant",
                content: step.content,
                createdAt: new Date(),
              },
            ]);
          }

          setStepIndex(stepIndex + 1);
        }, step.delay);
      }
    };

    runDemo();

    return () => clearTimeout(timeout);
  }, [stepIndex]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamedContent, isThinking]);

  return (
    <div className="flex flex-col h-full relative bg-background/50 backdrop-blur-md border border-signal/20 rounded-2xl overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/80">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-signal animate-pulse" />
          <span className="text-xs font-medium text-foreground uppercase tracking-widest">
            Live Demo · 0RBIT Core
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-white/10 text-muted-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3 px-4 py-2"
            >
              <div className="w-7 h-7 rounded-full bg-signal/10 border border-signal/20 flex items-center justify-center animate-pulse">
                <div className="w-1.5 h-1.5 rounded-full bg-signal" />
              </div>
              <div className="flex gap-1.5 items-center pt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-signal/40 animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-signal/40 animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-signal/40 animate-bounce" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 border-t border-border bg-background/80">
        <div className="h-10 rounded-xl bg-white/[0.03] border border-border flex items-center px-4">
          <span className="text-xs text-muted-foreground animate-pulse italic">
            Demo playback in progress...
          </span>
        </div>
      </div>
    </div>
  );
}
