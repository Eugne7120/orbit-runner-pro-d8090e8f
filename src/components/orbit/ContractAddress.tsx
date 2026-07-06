import { useState } from "react";

const CONTRACT_ADDRESS = "62nQfaF8Pmri8gthC4BSNnQFpHxhhPw2NXKWG1zMt2BU";

function truncate(address: string) {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

/**
 * Placeholder token contract address card with one-click copy.
 * Sits under the hero stats line on the homepage.
 */
export function ContractAddress({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* no-op */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      style={style}
      className={`group inline-flex items-center gap-2.5 rounded-full border border-border bg-surface/50 px-4 py-2 font-mono text-[11px] text-muted-foreground backdrop-blur transition-all hover:border-border-strong hover:bg-surface hover:text-foreground ${className}`}
      title={CONTRACT_ADDRESS}
    >
      <span className="uppercase tracking-[0.14em] text-muted-foreground/70">CA</span>
      <span className="h-1 w-1 rounded-full bg-border-strong" />
      <span className="tracking-tight">{truncate(CONTRACT_ADDRESS)}</span>
      <span className="flex items-center justify-center text-foreground/70 transition-colors group-hover:text-foreground">
        {copied ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M20 6L9 17l-5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect
              x="9"
              y="9"
              width="12"
              height="12"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"
              stroke="currentColor"
              strokeWidth="1.8"
            />
          </svg>
        )}
      </span>
      <span className="sr-only" role="status">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}
