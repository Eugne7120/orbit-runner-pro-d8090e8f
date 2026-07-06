import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import { motion } from "motion/react";
import {
  MessageSquare,
  LayoutDashboard,
  CreditCard,
  ArrowRight,
  Activity,
  Globe,
  Clock,
} from "lucide-react";
import { CreditsWidget } from "@/components/app/CreditsWidget";
import { UserProfile } from "@/components/app/UserProfile";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/app/")({
  component: AppHome,
});

const QUICK_ACTIONS = [
  {
    label: "Start chatting",
    desc: "Talk to 0RBIT AI",
    icon: MessageSquare,
    to: "/app/chat",
    accent: true,
  },
  { label: "Dashboard", desc: "Usage & metrics", icon: LayoutDashboard, to: "/app/dashboard" },
  { label: "Credits", desc: "Manage balance", icon: CreditCard, to: "/app/credits" },
];

const NETWORK_METRICS = [
  { label: "Workers Online", value: "214", icon: Globe, trend: "+12%" },
  { label: "Avg Latency", value: "41ms", icon: Clock, trend: "-3ms" },
  { label: "Tokens / Day", value: "1.2B", icon: Activity, trend: "+8%" },
];

function Placeholder({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <h4 className="text-sm font-medium text-foreground mb-1">{title}</h4>
      <p className="text-xs text-muted-foreground">{desc}</p>
      <div className="mt-4 space-y-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-2 rounded-full bg-white/[0.05]"
            style={{ width: `${70 - i * 15}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function AppHome() {
  const { authenticated, ready, user } = usePrivy();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !authenticated) navigate({ to: "/app/login" });
  }, [ready, authenticated]);

  if (!ready || !authenticated) return null;

  const name = user?.twitter?.name ?? user?.google?.name ?? "there";

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
            <span className="text-xs text-muted-foreground font-mono">NETWORK LIVE</span>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">
            Good to see you, {name.split(" ")[0]}.
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            The 0RBIT network is online and ready.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {QUICK_ACTIONS.map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all group ${a.accent ? "bg-signal/10 border-signal/25 hover:bg-signal/20 hover:border-signal/40" : "bg-white/[0.03] border-border hover:bg-white/[0.07] hover:border-border-strong"}`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${a.accent ? "bg-signal/20" : "bg-white/[0.06]"}`}
                >
                  <a.icon
                    className={`w-4 h-4 ${a.accent ? "text-signal" : "text-muted-foreground"}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{a.label}</p>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            Network Status
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {NETWORK_METRICS.map((m) => (
              <div
                key={m.label}
                className="rounded-xl border border-border bg-surface p-4 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                  <m.icon className="w-4 h-4 text-signal" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground tabular-nums">{m.value}</p>
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                </div>
                <span className="ml-auto text-xs text-signal font-mono">{m.trend}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Overview
              </h2>
              <Placeholder
                title="Recent Activity"
                desc="Your latest conversations and requests will appear here."
              />
              <Placeholder
                title="Usage Summary"
                desc="Token consumption and model usage metrics."
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Profile
              </h2>
              <UserProfile />
              <CreditsWidget />
            </div>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
