import { useEffect, useState } from "react";

/**
 * Staking dashboard preview UI only, no wallet connection.
 * Stake / unstake move a local demo balance; rewards accrue slowly
 * over time and can be "claimed" back into the available balance.
 */

const APR = 14.2;

export function StakingPreview() {
  const [available, setAvailable] = useState(4820);
  const [staked, setStaked] = useState(12500);
  const [pending, setPending] = useState(38.42);
  const [amount, setAmount] = useState(500);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => {
      setPending((p) => p + (staked * (APR / 100)) / (365 * 24 * 60));
    }, 1000);
    return () => clearInterval(t);
  }, [staked]);

  const flashMsg = (msg: string) => {
    setFlash(msg);
    setTimeout(() => setFlash(null), 1600);
  };

  const stake = () => {
    const v = Math.min(amount, available);
    if (v <= 0) return;
    setAvailable((a) => a - v);
    setStaked((s) => s + v);
    flashMsg(`Staked ${v.toLocaleString()} $0RBIT`);
  };

  const unstake = () => {
    const v = Math.min(amount, staked);
    if (v <= 0) return;
    setStaked((s) => s - v);
    setAvailable((a) => a + v);
    flashMsg(`Unstaked ${v.toLocaleString()} $0RBIT`);
  };

  const claim = () => {
    if (pending < 0.01) return;
    setAvailable((a) => a + pending);
    flashMsg(`Claimed ${pending.toFixed(2)} USDC`);
    setPending(0);
  };

  return (
    <div className="glass-strong overflow-hidden rounded-3xl shadow-elegant">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
          / staking · demo
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-muted-foreground">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-full bg-signal/60 animate-orbit-ping" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-signal" />
          </span>
          rewards accruing
        </div>
      </div>

      <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-4">
        <StatBlock
          label="Available balance"
          value={`${available.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          unit="$0RBIT"
        />
        <StatBlock
          label="Staked balance"
          value={`${staked.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          unit="$0RBIT"
          accent
        />
        <StatBlock label="Pending rewards" value={pending.toFixed(2)} unit="USDC" pulse />
        <StatBlock label="Estimated APR" value={APR.toFixed(1)} unit="%" />
      </div>

      <div className="p-6 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <label className="flex-1" htmlFor="stake-amount-range">
            <div className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
              Amount · {amount.toLocaleString()} $0RBIT
            </div>
            <input
              id="stake-amount-range"
              type="range"
              min={0}
              max={Math.max(available, staked, 1000)}
              step={10}
              value={amount}
              onChange={(e) => setAmount(+e.target.value)}
              aria-label="Amount of $0RBIT to stake or unstake"
              className="w-full accent-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button
              onClick={stake}
              disabled={amount <= 0 || available <= 0}
              aria-label={`Stake ${Math.min(amount, available).toLocaleString()} $0RBIT`}
              className="btn-sheen inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-[13px] font-medium text-background transition-all hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-foreground"
            >
              Stake
            </button>
            <button
              onClick={unstake}
              disabled={amount <= 0 || staked <= 0}
              aria-label={`Unstake ${Math.min(amount, staked).toLocaleString()} $0RBIT`}
              className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-border-strong bg-surface px-5 py-2.5 text-[13px] font-medium text-foreground transition-all hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface"
            >
              Unstake
            </button>
            <button
              onClick={claim}
              disabled={pending < 0.01}
              aria-label={`Claim ${pending.toFixed(2)} USDC in pending rewards`}
              className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-signal/40 bg-signal/10 px-5 py-2.5 text-[13px] font-medium text-signal transition-all hover:bg-signal/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-signal/10"
            >
              Claim rewards
            </button>
          </div>
        </div>
        <div
          className="mt-4 h-5 font-mono text-[12px] text-signal transition-opacity duration-300"
          style={{ opacity: flash ? 1 : 0 }}
        >
          {flash ?? ""}
        </div>
      </div>
    </div>
  );
}

function StatBlock({
  label,
  value,
  unit,
  accent = false,
  pulse = false,
}: {
  label: string;
  value: string;
  unit: string;
  accent?: boolean;
  pulse?: boolean;
}) {
  return (
    <div className="bg-surface/60 p-6">
      <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
      <div
        className={`mt-2 flex items-baseline gap-1.5 font-display text-2xl font-medium tabular-nums tracking-tight md:text-[28px] ${accent ? "text-signal" : "text-foreground"}`}
      >
        {pulse && <span className="h-1.5 w-1.5 rounded-full bg-signal animate-orbit-pulse" />}
        {value}
        <span className="font-mono text-[11px] font-normal text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}
