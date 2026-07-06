import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import { useGuestMode } from "@/lib/guest";
import { motion } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { TooltipProps } from "recharts";
import { Activity, Zap, Clock, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/app/dashboard")({
  component: DashboardPage,
});

const chartData = [
  { day: "Mon", tokens: 12000 },
  { day: "Tue", tokens: 19000 },
  { day: "Wed", tokens: 9000 },
  { day: "Thu", tokens: 24000 },
  { day: "Fri", tokens: 31000 },
  { day: "Sat", tokens: 18000 },
  { day: "Sun", tokens: 22000 },
];
const STATS = [
  { label: "Total Requests", value: "1,248", icon: Activity, change: "+12% this week" },
  { label: "Tokens Used", value: "135K", icon: Zap, change: "+8% this week" },
  { label: "Avg Response", value: "1.2s", icon: Clock, change: "-0.3s this week" },
  { label: "Success Rate", value: "99.8%", icon: TrendingUp, change: "Stable" },
];

function DashboardPage() {
  const { authenticated, ready } = usePrivy();
  const guest = useGuestMode();
  const navigate = useNavigate();
  useEffect(() => {
    if (ready && !authenticated && !guest) navigate({ to: "/app/login" });
  }, [ready, authenticated, guest]);
  if (!ready || (!authenticated && !guest)) return null;

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Your usage overview and analytics.</p>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-center justify-between mb-3">
                <s.icon className="w-4 h-4 text-signal" />
                <span className="text-[11px] text-muted-foreground/60">{s.change}</span>
              </div>
              <p className="text-2xl font-semibold text-foreground tabular-nums">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-foreground">Token Usage</h3>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
            <span className="text-xs font-mono text-signal bg-signal/10 px-2 py-1 rounded-md">
              Live
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="tokenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.78 0.14 232)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="oklch(0.78 0.14 232)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "oklch(0.62 0.012 250)", fontSize: 11 }}
              />
              <YAxis hide />
              <Tooltip
                content={({ active, payload, label }: TooltipProps<number, string>) =>
                  active && payload?.length ? (
                    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs">
                      <p className="font-medium text-foreground">{label}</p>
                      <p className="text-signal">
                        {Number(payload[0]?.value ?? 0).toLocaleString()} tokens
                      </p>
                    </div>
                  ) : null
                }
              />
              <Area
                type="monotone"
                dataKey="tokens"
                stroke="oklch(0.78 0.14 232)"
                strokeWidth={2}
                fill="url(#tokenGrad)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["Model Breakdown", "Recent Requests"].map((title) => (
            <div key={title} className="rounded-xl border border-border bg-surface p-5">
              <h3 className="text-sm font-medium text-foreground mb-3">{title}</h3>
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-2 rounded-full bg-white/[0.06] flex-1" />
                    <div className="w-8 h-2 rounded-full bg-white/[0.04]" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
