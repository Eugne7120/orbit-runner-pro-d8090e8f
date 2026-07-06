import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState, useMemo } from "react";
import { useGuestMode } from "@/lib/guest";
import { motion, AnimatePresence, type Variants } from "motion/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import type { TooltipProps } from "recharts";
import {
  Activity,
  Zap,
  Clock,
  TrendingUp,
  Cpu,
  Server,
  ShieldCheck,
  ListRestart,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/app/dashboard")({
  component: DashboardPage,
});

// Helper for count-up animation
function CountUp({
  value,
  duration = 2,
  decimals = 0,
}: {
  value: number;
  duration?: number;
  decimals?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      setDisplayValue(progress * value);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);

  return (
    <span>
      {displayValue.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
    </span>
  );
}

const INITIAL_CHART_DATA = [
  { time: "00:00", tokens: 12000, latency: 450 },
  { time: "04:00", tokens: 19000, latency: 480 },
  { time: "08:00", tokens: 9000, latency: 420 },
  { time: "12:00", tokens: 24000, latency: 510 },
  { time: "16:00", tokens: 31000, latency: 540 },
  { time: "20:00", tokens: 18000, latency: 490 },
  { time: "23:59", tokens: 22000, latency: 470 },
];

const MODELS = [
  { name: "Llama 3.1 405B", usage: 45, color: "oklch(0.78 0.14 232)" },
  { name: "Mixtral 8x22B", usage: 30, color: "oklch(0.62 0.12 180)" },
  { name: "Gemma 2 27B", usage: 15, color: "oklch(0.70 0.10 20)" },
  { name: "DeepSeek Coder", usage: 10, color: "oklch(0.55 0.15 280)" },
];

const ACTIVITY = [
  {
    id: 1,
    type: "inference",
    model: "Llama 3.1 405B",
    status: "success",
    time: "2m ago",
    tokens: 842,
  },
  {
    id: 2,
    type: "inference",
    model: "Mixtral 8x22B",
    status: "success",
    time: "5m ago",
    tokens: 1240,
  },
  {
    id: 3,
    type: "fine-tune",
    model: "Gemma 2 27B",
    status: "processing",
    time: "12m ago",
    tokens: 0,
  },
  {
    id: 4,
    type: "inference",
    model: "Llama 3.1 405B",
    status: "success",
    time: "15m ago",
    tokens: 512,
  },
];

function DashboardPage() {
  const { authenticated, ready } = usePrivy();
  const guest = useGuestMode();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    requests: 1248,
    credits: 8420,
    latency: 1.2,
    success: 99.8,
    workers: 42,
    gpu: 76,
  });

  const [dynamicChartData, setDynamicChartData] = useState(INITIAL_CHART_DATA);

  useEffect(() => {
    if (ready && !authenticated && !guest) navigate({ to: "/app/login" });
  }, [ready, authenticated, guest]);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        requests: prev.requests + Math.floor(Math.random() * 3),
        credits: prev.credits + Math.floor(Math.random() * 50),
        latency: Math.max(0.8, Math.min(1.8, prev.latency + (Math.random() - 0.5) * 0.1)),
        gpu: Math.max(40, Math.min(95, prev.gpu + (Math.random() - 0.5) * 5)),
        workers: Math.max(
          38,
          Math.min(45, prev.workers + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0)),
        ),
      }));

      setDynamicChartData((prev) => {
        const newData = [...prev];
        const last = newData[newData.length - 1];
        newData.shift();
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
        newData.push({
          time: timeStr,
          tokens: Math.max(5000, last.tokens + (Math.random() - 0.5) * 2000),
          latency: Math.max(400, last.latency + (Math.random() - 0.5) * 40),
        });
        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!ready || (!authenticated && !guest)) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">System Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1 text-pretty max-w-md">
              Real-time monitoring of your distributed inference nodes and resource consumption.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-signal/5 border-signal/20 text-signal gap-1.5 px-3 py-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
              System Operational
            </Badge>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard
            label="Total Requests"
            value={stats.requests}
            icon={Activity}
            change="+12% this week"
            variants={itemVariants}
          />
          <StatCard
            label="Credits Used"
            value={stats.credits}
            icon={Zap}
            change="+420 today"
            variants={itemVariants}
          />
          <StatCard
            label="Avg Latency"
            value={stats.latency}
            decimals={2}
            suffix="s"
            icon={Clock}
            change="-140ms optimized"
            variants={itemVariants}
          />
          <StatCard
            label="Workers Online"
            value={stats.workers}
            icon={Server}
            change="Across 4 regions"
            variants={itemVariants}
          />
        </motion.div>

        {/* Main Charts & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="show"
            className="lg:col-span-2 rounded-xl border border-border bg-surface/50 backdrop-blur-sm p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Inference Throughput</h3>
                <p className="text-xs text-muted-foreground">Tokens per second across network</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-signal" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                    Tokens
                  </span>
                </div>
              </div>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dynamicChartData}>
                  <defs>
                    <linearGradient id="tokenGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.78 0.14 232)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="oklch(0.78 0.14 232)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "oklch(0.62 0.012 250)", fontSize: 10 }}
                    minTickGap={30}
                  />
                  <YAxis hide domain={["auto", "auto"]} />
                  <Tooltip
                    content={({ active, payload, label }: TooltipProps<number, string>) =>
                      active && payload?.length ? (
                        <div className="rounded-lg border border-border bg-popover/90 backdrop-blur-md px-3 py-2 text-xs shadow-xl">
                          <p className="font-bold text-foreground mb-1">{label}</p>
                          <div className="space-y-1">
                            <p className="text-signal flex items-center justify-between gap-4">
                              <span>Tokens:</span>
                              <span className="font-mono">
                                {Number(payload[0]?.value ?? 0).toLocaleString()}
                              </span>
                            </p>
                            <p className="text-muted-foreground flex items-center justify-between gap-4">
                              <span>Latency:</span>
                              <span className="font-mono">{payload[0]?.payload.latency}ms</span>
                            </p>
                          </div>
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
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="show"
              className="rounded-xl border border-border bg-surface/50 p-6"
            >
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-signal" />
                GPU Cluster Utilization
              </h3>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-muted-foreground">Compute Load</span>
                    <span className="font-mono text-foreground">{Math.round(stats.gpu)}%</span>
                  </div>
                  <Progress value={stats.gpu} className="h-1.5" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-tight">
                      Memory
                    </p>
                    <p className="text-sm font-semibold text-foreground">22.4 / 80 GB</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-tight">
                      Temp
                    </p>
                    <p className="text-sm font-semibold text-foreground">64°C</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="show"
              className="rounded-xl border border-border bg-surface/50 p-6"
            >
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-signal" />
                Global Status
              </h3>
              <div className="space-y-3">
                {[
                  { region: "US-East (Virginia)", status: "Optimal", ping: "12ms" },
                  { region: "EU-West (London)", status: "Optimal", ping: "28ms" },
                  { region: "Asia-East (Tokyo)", status: "Degraded", ping: "142ms" },
                ].map((r) => (
                  <div key={r.region} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{r.region}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px]">{r.ping}</span>
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${r.status === "Optimal" ? "bg-signal" : "bg-yellow-500"}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Model Breakdown */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="show"
            className="rounded-xl border border-border bg-surface/50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-foreground">Model Distribution</h3>
              <Badge variant="secondary" className="text-[10px] h-5">
                Last 24h
              </Badge>
            </div>
            <div className="flex items-end gap-4 h-40">
              {MODELS.map((m) => (
                <div key={m.name} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${m.usage}%` }}
                    className="w-full rounded-t-sm bg-signal/20 border-t-2 border-signal"
                    style={{ backgroundColor: `${m.color}20`, borderColor: m.color }}
                  />
                  <span className="text-[10px] text-muted-foreground rotate-[-45deg] origin-top-left translate-x-1 mt-2 whitespace-nowrap">
                    {m.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="show"
            className="rounded-xl border border-border bg-surface/50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
              <button className="text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <ListRestart className="w-3 h-3" />
                View all
              </button>
            </div>
            <div className="space-y-4">
              {ACTIVITY.map((a) => (
                <div key={a.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-signal/5 border border-signal/10 flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5 text-signal" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">{a.model}</p>
                      <p className="text-[10px] text-muted-foreground capitalize">
                        {a.type} • {a.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-foreground">
                      {a.tokens > 0 ? `${a.tokens} tkn` : "-"}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-0.5">
                      <span
                        className={`w-1 h-1 rounded-full ${a.status === "success" ? "bg-signal" : "bg-yellow-500 animate-pulse"}`}
                      />
                      <span className="text-[9px] uppercase tracking-tighter text-muted-foreground">
                        {a.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {ACTIVITY.length === 0 && (
                <div className="h-32 flex flex-col items-center justify-center text-center">
                  <Activity className="w-8 h-8 text-muted-foreground/20 mb-2" />
                  <p className="text-xs text-muted-foreground">No recent activity detected.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  change: string;
  suffix?: string;
  decimals?: number;
  variants?: Variants;
}

function StatCard({
  label,
  value,
  icon: Icon,
  change,
  suffix = "",
  decimals = 0,
  variants,
}: StatCardProps) {
  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="rounded-xl border border-border bg-surface/50 p-5 hover:bg-surface/80 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-8 h-8 rounded-lg bg-signal/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-signal" />
        </div>
        <span className="text-[10px] font-medium text-signal bg-signal/5 px-2 py-0.5 rounded-full border border-signal/10">
          {change}
        </span>
      </div>
      <div>
        <div className="text-2xl font-bold text-foreground tabular-nums flex items-baseline gap-0.5">
          <CountUp value={value} decimals={decimals} />
          <span className="text-sm font-medium text-muted-foreground">{suffix}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 font-medium">{label}</p>
      </div>
    </motion.div>
  );
}
