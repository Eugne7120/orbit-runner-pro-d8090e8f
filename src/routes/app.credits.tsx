import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import { useGuestMode } from "@/lib/guest";
import { motion } from "motion/react";
import { CreditsWidget } from "@/components/app/CreditsWidget";
import { CreditCard, History } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/app/credits")({
  component: CreditsPage,
});

const HISTORY = [
  { amount: -50, desc: "0RBIT Core 12 conversations", date: "Today" },
  { amount: -120, desc: "0RBIT Pro 5 conversations", date: "Yesterday" },
  { amount: 500, desc: "Monthly credit allocation", date: "Jul 1, 2025" },
  { amount: -210, desc: "0RBIT Core 38 conversations", date: "Jun 30, 2025" },
];

function CreditsPage() {
  const { authenticated, ready } = usePrivy();
  const guest = useGuestMode();
  const navigate = useNavigate();
  useEffect(() => {
    if (ready && !authenticated && !guest) navigate({ to: "/app/login" });
  }, [ready, authenticated, guest]);
  if (!ready || (!authenticated && !guest)) return null;

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-xl font-semibold text-foreground">Credits</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your 0RBIT credit balance.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CreditsWidget />
          <div className="rounded-xl border border-border bg-surface p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-4 h-4 text-signal" />
              <span className="text-sm font-medium text-foreground">Top Up</span>
            </div>
            <div className="space-y-2 flex-1">
              {[100, 500, 1000, 2500].map((amt) => (
                <button
                  key={amt}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-border hover:border-signal/40 hover:bg-signal/[0.04] transition-all text-sm group"
                >
                  <span className="text-foreground font-medium">{amt} Credits</span>
                  <span className="text-muted-foreground group-hover:text-signal transition-colors">
                    ${(amt * 0.01).toFixed(2)}
                  </span>
                </button>
              ))}
            </div>
            <button className="mt-4 w-full py-2.5 rounded-xl bg-signal/15 border border-signal/25 text-signal text-sm font-medium opacity-60 cursor-not-allowed">
              Coming soon
            </button>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Transaction History</span>
          </div>
          {HISTORY.map((h, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2.5 border-b border-border last:border-0"
            >
              <div>
                <p className="text-xs font-medium text-foreground">{h.desc}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{h.date}</p>
              </div>
              <span
                className={`text-sm font-semibold tabular-nums ${h.amount > 0 ? "text-signal" : "text-muted-foreground"}`}
              >
                {h.amount > 0 ? "+" : ""}
                {h.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
