import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, RefreshCw, ThumbsUp, ThumbsDown, Zap } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { Message } from "@/lib/chat-store";

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className={cn(
        "flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors",
        className,
      )}
    >
      {copied ? <Check className="w-3 h-3 text-signal" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function CodeBlock({ children, className }: { children: string; className?: string }) {
  const match = /language-(\w+)/.exec(className || "");
  const lang = match?.[1] ?? "";
  return (
    <div className="relative group/code rounded-xl overflow-hidden border border-border my-3">
      <div className="flex items-center justify-between px-4 py-2 bg-white/[0.04] border-b border-border">
        <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
          {lang || "code"}
        </span>
        <CopyButton text={children} />
      </div>
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          style={oneDark}
          language={lang}
          PreTag="div"
          customStyle={{
            margin: 0,
            background: "transparent",
            padding: "1rem",
            fontSize: "0.8125rem",
          }}
          codeTagProps={{ style: { fontFamily: "var(--font-mono)" } }}
        >
          {children}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
  onRegenerate?: () => void;
}

export function ChatMessage({ message, isStreaming, onRegenerate }: ChatMessageProps) {
  const isUser = message.role === "user";
  const [liked, setLiked] = useState<"up" | "down" | null>(null);
  const [msgCopied, setMsgCopied] = useState(false);

  const copyMsg = () => {
    navigator.clipboard.writeText(message.content);
    setMsgCopied(true);
    setTimeout(() => setMsgCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
      className={cn("group flex gap-3 px-4 py-3", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-signal/15 border border-signal/25 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Zap className="w-3.5 h-3.5 text-signal" />
        </div>
      )}

      <div className={cn("max-w-[85%] md:max-w-[75%] min-w-0", isUser && "max-w-[80%]")}>
        {isUser ? (
          <div className="rounded-2xl rounded-tr-sm bg-signal/15 border border-signal/20 px-4 py-2.5 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
        ) : (
          <div className="text-sm text-foreground leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, className, children, ...props }) {
                  const inline = !className;
                  if (inline) {
                    return (
                      <code
                        className="px-1.5 py-0.5 rounded-md bg-white/[0.08] border border-border font-mono text-[0.8em] text-signal"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                  return (
                    <CodeBlock className={className}>
                      {String(children).replace(/\n$/, "")}
                    </CodeBlock>
                  );
                },
                p({ children }) {
                  return <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>;
                },
                h1({ children }) {
                  return (
                    <h1 className="text-lg font-semibold mt-4 mb-2 text-foreground">{children}</h1>
                  );
                },
                h2({ children }) {
                  return (
                    <h2 className="text-base font-semibold mt-4 mb-2 text-foreground">
                      {children}
                    </h2>
                  );
                },
                h3({ children }) {
                  return (
                    <h3 className="text-sm font-semibold mt-3 mb-1.5 text-foreground">
                      {children}
                    </h3>
                  );
                },
                ul({ children }) {
                  return (
                    <ul className="mb-3 ml-4 space-y-1 list-disc marker:text-signal/60">
                      {children}
                    </ul>
                  );
                },
                ol({ children }) {
                  return (
                    <ol className="mb-3 ml-4 space-y-1 list-decimal marker:text-muted-foreground">
                      {children}
                    </ol>
                  );
                },
                li({ children }) {
                  return <li className="text-sm leading-relaxed">{children}</li>;
                },
                blockquote({ children }) {
                  return (
                    <blockquote className="border-l-2 border-signal/40 pl-4 my-3 text-muted-foreground italic">
                      {children}
                    </blockquote>
                  );
                },
                table({ children }) {
                  return (
                    <div className="overflow-x-auto my-3">
                      <table className="w-full border-collapse text-xs">{children}</table>
                    </div>
                  );
                },
                th({ children }) {
                  return (
                    <th className="px-3 py-2 border border-border bg-white/[0.05] text-left font-medium text-foreground">
                      {children}
                    </th>
                  );
                },
                td({ children }) {
                  return (
                    <td className="px-3 py-2 border border-border text-muted-foreground">
                      {children}
                    </td>
                  );
                },
                a({ href, children }) {
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-signal underline underline-offset-2 hover:text-signal/80 transition-colors"
                    >
                      {children}
                    </a>
                  );
                },
                hr() {
                  return <hr className="my-4 border-border" />;
                },
                strong({ children }) {
                  return <strong className="font-semibold text-foreground">{children}</strong>;
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
            {isStreaming && (
              <span className="inline-block w-1.5 h-4 bg-signal/60 animate-pulse ml-0.5 rounded-sm align-text-bottom" />
            )}
          </div>
        )}

        {/* Actions — assistant only */}
        {!isUser && !isStreaming && (
          <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 opacity-100 md:opacity-0">
            <button
              onClick={copyMsg}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-colors"
            >
              {msgCopied ? <Check className="w-3 h-3 text-signal" /> : <Copy className="w-3 h-3" />}
              <span className="hidden sm:inline">{msgCopied ? "Copied" : "Copy"}</span>
            </button>
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span className="hidden sm:inline">Regenerate</span>
              </button>
            )}
            <button
              onClick={() => setLiked(liked === "up" ? null : "up")}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                liked === "up"
                  ? "text-signal"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.05]",
              )}
            >
              <ThumbsUp className="w-3 h-3" />
            </button>
            <button
              onClick={() => setLiked(liked === "down" ? null : "down")}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                liked === "down"
                  ? "text-destructive"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.05]",
              )}
            >
              <ThumbsDown className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-7 h-7 rounded-full bg-white/[0.08] border border-border flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-semibold text-foreground">
          U
        </div>
      )}
    </motion.div>
  );
}
