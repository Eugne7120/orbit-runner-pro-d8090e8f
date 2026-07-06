import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useGuestMode } from "@/lib/guest";
import { motion, AnimatePresence } from "motion/react";
import { CreditsWidget } from "@/components/app/CreditsWidget";
import {
  CreditCard,
  History,
  TrendingUp,
  ArrowUpRight,
  Clock,
  AlertCircle,
  ChevronRight,
  Zap,
  ShieldCheck,
  ZapOff,
} from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { AreaChart } from "@/components/orbit/AreaChart";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/credits")({
  component: CreditsPage,
});

const HISTORY = [
  {
    id: 1,
    amount: -50,
    desc: "0RBIT Core 12 conversations",
    date: "Today, 2:45 PM",
    status: "completed",
  },
  {
    id: 2,
    amount: -120,
    desc: "0RBIT Pro 5 conversations",
    date: "Yesterday, 9:12 AM",
    status: "completed",
  },
  {
    id: 3,
    amount: 500,
    desc: "Monthly credit allocation",
    date: "Jul 1, 2025, 12:00 AM",
    status: "completed",
  },
  {
    id: 4,
    amount: -210,
    desc: "0RBIT Core 38 conversations",
    date: "Jun 30, 2025, 11:30 PM",
    status: "completed",
  },
  {
    id: 5,
    amount: -15,
    desc: "API Request: Image Generation",
    date: "Jun 28, 2025, 4:20 PM",
    status: "completed",
  },
];

const PRICING_PLANS = [
  { name: "Starter", credits: 1000, price: 10, features: ["Standard Models", "Community Support"] },
  {
    name: "Pro",
    credits: 5000,
    price: 45,
    features: ["All Models", "Priority Queue", "Email Support"],
    recommended: true,
  },
  {
    name: "Enterprise",
    credits: 25000,
    price: 200,
    features: ["Custom Models", "Dedicated Support", "SLA"],
  },
];

function CreditsPage() {
  const { authenticated, ready } = usePrivy();
  const guest = useGuestMode();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ready && !authenticated && !guest) navigate({ to: "/app/login" });
  }, [ready, authenticated, guest, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (!ready || (!authenticated && !guest)) return null;

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              Credits & Billing
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your usage, balance, and billing history.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-signal/5 border-signal/20 text-signal py-1 px-3">
              <ShieldCheck className="w-3 h-3 mr-1.5" />
              Auto-top up active
            </Badge>
          </div>
        </motion.div>

        {loading ? (
          <CreditsSkeleton />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* Overview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CreditsWidget className="h-full shadow-sm" />

                  <div className="rounded-xl border border-border bg-surface p-5 flex flex-col shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-orbit/15 flex items-center justify-center">
                          <TrendingUp className="w-3.5 h-3.5 text-orbit" />
                        </div>
                        <span className="text-sm font-medium text-foreground">Consumption</span>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                        Last 24h
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col justify-center py-2">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-3xl font-semibold text-foreground tabular-nums">
                          42.5
                        </span>
                        <span className="text-sm text-muted-foreground">credits/hr</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-signal">
                        <ArrowUpRight className="w-3 h-3" />
                        <span>12% from yesterday</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border/50">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Est. remaining time</span>
                        <span className="text-foreground font-medium">~2.8 days</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Usage Chart */}
                <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        Credit Usage Timeline
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {["24h", "7d", "30d"].map((t) => (
                        <button
                          key={t}
                          className={`text-[10px] px-2 py-1 rounded ${t === "24h" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="h-[200px] w-full flex items-end">
                    <AreaChart height={180} base={40} variance={15} color="signal" />
                  </div>
                </div>
              </div>

              {/* Sidebar: Top Up */}
              <div className="space-y-6">
                <div className="rounded-xl border border-border bg-surface p-5 flex flex-col shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-4 h-4 text-signal" />
                    <span className="text-sm font-medium text-foreground">Quick Top Up</span>
                  </div>
                  <div className="space-y-2 flex-1">
                    {[500, 1000, 2500, 5000].map((amt) => (
                      <button
                        key={amt}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-border hover:border-signal/40 hover:bg-signal/[0.04] transition-all text-sm group"
                      >
                        <span className="text-foreground font-medium">
                          {amt.toLocaleString()} Credits
                        </span>
                        <span className="text-muted-foreground group-hover:text-signal transition-colors font-mono">
                          ${(amt * 0.01).toFixed(2)}
                        </span>
                      </button>
                    ))}
                  </div>
                  <Button className="mt-4 w-full bg-signal hover:bg-signal/90 text-white font-medium py-6 rounded-xl">
                    Top Up Now
                  </Button>
                  <p className="text-[10px] text-center text-muted-foreground mt-3">
                    Secure payment powered by Stripe
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Future Billing</span>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-medium text-foreground">Next Cycle</span>
                        <span className="text-[10px] text-muted-foreground">Aug 1, 2025</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Your 500 monthly credits will be automatically added to your balance.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground px-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>Unused credits roll over up to 2,000.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Plans Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-foreground px-1">Subscription Plans</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PRICING_PLANS.map((plan) => (
                  <div
                    key={plan.name}
                    className={`rounded-xl border p-6 flex flex-col relative transition-all hover:shadow-md ${
                      plan.recommended
                        ? "border-signal bg-signal/[0.02] shadow-sm"
                        : "border-border bg-surface"
                    }`}
                  >
                    {plan.recommended && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-signal text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                        Recommended
                      </span>
                    )}
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-semibold">${plan.price}</span>
                        <span className="text-muted-foreground text-sm">/mo</span>
                      </div>
                    </div>
                    <div className="mb-6 flex-1 space-y-3">
                      <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                        <Zap className="w-4 h-4 text-signal" />
                        {plan.credits.toLocaleString()} Credits / mo
                      </div>
                      <ul className="space-y-2">
                        {plan.features.map((f) => (
                          <li
                            key={f}
                            className="flex items-center gap-2 text-xs text-muted-foreground"
                          >
                            <div className="w-1 h-1 rounded-full bg-border" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button
                      variant={plan.recommended ? "default" : "outline"}
                      className={`w-full ${plan.recommended ? "bg-signal hover:bg-signal/90" : ""}`}
                    >
                      {plan.name === "Pro" ? "Current Plan" : "Upgrade"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* History Table */}
            <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-sm">
              <div className="p-5 border-b border-border flex items-center justify-between bg-muted/10">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Transaction History</span>
                </div>
                <Button variant="ghost" size="sm" className="text-xs h-8">
                  Export CSV
                </Button>
              </div>
              <div className="overflow-x-auto">
                {HISTORY.length > 0 ? (
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/5">
                        <th className="px-5 py-3 font-medium text-muted-foreground text-[11px] uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-5 py-3 font-medium text-muted-foreground text-[11px] uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-5 py-3 font-medium text-muted-foreground text-[11px] uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-5 py-3 font-medium text-muted-foreground text-[11px] uppercase tracking-wider text-right">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {HISTORY.map((h) => (
                        <tr key={h.id} className="hover:bg-muted/5 transition-colors group">
                          <td className="px-5 py-4">
                            <div className="font-medium text-foreground">{h.desc}</div>
                          </td>
                          <td className="px-5 py-4 text-muted-foreground text-xs">{h.date}</td>
                          <td className="px-5 py-4">
                            <Badge
                              variant="outline"
                              className="bg-emerald-500/5 text-emerald-500 border-emerald-500/20 text-[10px] font-medium px-2 py-0"
                            >
                              {h.status}
                            </Badge>
                          </td>
                          <td
                            className={`px-5 py-4 text-right font-semibold tabular-nums ${h.amount > 0 ? "text-signal" : "text-foreground"}`}
                          >
                            {h.amount > 0 ? "+" : ""}
                            {h.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                      <ZapOff className="w-6 h-6 text-muted-foreground/40" />
                    </div>
                    <h3 className="text-sm font-medium text-foreground">No transactions yet</h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                      Your transaction history will appear here once you start using credits.
                    </p>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-border flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  View all transactions
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}

function CreditsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-[220px] w-full rounded-xl" />
            <Skeleton className="h-[220px] w-full rounded-xl" />
          </div>
          <Skeleton className="h-[280px] w-full rounded-xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-[340px] w-full rounded-xl" />
          <Skeleton className="h-[160px] w-full rounded-xl" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[300px] rounded-xl" />
          <Skeleton className="h-[300px] rounded-xl" />
          <Skeleton className="h-[300px] rounded-xl" />
        </div>
      </div>
    </div>
  );
}
