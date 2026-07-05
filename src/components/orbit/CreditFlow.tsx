/**
 * Pricing architecture: Credits → Runtime → Workers → Settlement.
 * Horizontal token stream with continuously moving credits.
 */
export function CreditFlow() {
  const cols = [
    { key: "buy", top: "You buy", bottom: "credits", note: "USD → CR" },
    { key: "runtime", top: "Runtime", bottom: "meters usage", note: "per 1M tokens" },
    { key: "workers", top: "Workers", bottom: "earn credits", note: "per tokens served" },
    { key: "settle", top: "Solana", bottom: "settles nightly", note: "signed receipts" },
  ];

  return (
    <div className="glass-strong rounded-2xl p-6 md:p-8">
      <svg viewBox="0 0 1000 260" className="h-auto w-full" role="img" aria-label="Credit flow">
        <defs>
          <linearGradient id="cf-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.78 0.14 232)" stopOpacity="0" />
            <stop offset="50%" stopColor="oklch(0.78 0.14 232)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="oklch(0.78 0.14 232)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* trunk line */}
        <line x1="60" y1="130" x2="940" y2="130" stroke="url(#cf-line)" strokeWidth="1" />

        {/* moving credits */}
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={i}>
            <rect x="-6" y="126" width="10" height="8" rx="1.5" fill="oklch(0.78 0.14 232)">
              <animate
                attributeName="x"
                from="60"
                to="930"
                dur={`${4 + (i % 3)}s`}
                begin={`${i * 0.55}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.1;0.9;1"
                dur={`${4 + (i % 3)}s`}
                begin={`${i * 0.55}s`}
                repeatCount="indefinite"
              />
            </rect>
          </g>
        ))}

        {/* nodes */}
        {cols.map((c, i) => {
          const x = 60 + (i / (cols.length - 1)) * 880;
          return (
            <g key={c.key}>
              <circle cx={x} cy={130} r="26" fill="oklch(0.19 0.011 250)" stroke="oklch(0.78 0.14 232 / 0.4)" strokeWidth="1" />
              <circle cx={x} cy={130} r="3" fill="oklch(0.9 0.14 232)" />
              <text x={x} y={80} textAnchor="middle" fill="oklch(0.62 0.012 250)" fontSize="10" fontFamily="JetBrains Mono, monospace" letterSpacing="0.14em">
                {String(i + 1).padStart(2, "0")}
              </text>
              <text x={x} y={190} textAnchor="middle" fill="oklch(0.95 0.004 250)" fontSize="14" fontFamily="Inter Tight, sans-serif" fontWeight="500">
                {c.top}
              </text>
              <text x={x} y={208} textAnchor="middle" fill="oklch(0.62 0.012 250)" fontSize="12" fontFamily="Inter Tight, sans-serif">
                {c.bottom}
              </text>
              <text x={x} y={228} textAnchor="middle" fill="oklch(0.45 0.008 250)" fontSize="9.5" fontFamily="JetBrains Mono, monospace" letterSpacing="0.1em">
                {c.note}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
