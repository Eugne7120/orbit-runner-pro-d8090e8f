import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useGuestMode, exitGuestMode } from "@/lib/guest";
import { motion } from "motion/react";
import { UserProfile } from "@/components/app/UserProfile";
import { User, Palette, Globe, Wallet, Link2, Shield, Bell, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
});

const SECTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "language", label: "Language", icon: Globe },
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "accounts", label: "Accounts", icon: Link2 },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
];

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(!on)}
      className={cn(
        "w-9 h-5 rounded-full transition-colors relative",
        on ? "bg-signal" : "bg-white/[0.12]",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm",
          on && "translate-x-4",
        )}
      />
    </button>
  );
}

function Row({
  label,
  value,
  action,
}: {
  label: string;
  value?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <p className="text-sm text-foreground">{label}</p>
        {value && <p className="text-xs text-muted-foreground mt-0.5">{value}</p>}
      </div>
      {action}
    </div>
  );
}

function SettingsPage() {
  const { authenticated, ready, user, logout } = usePrivy();
  const guest = useGuestMode();
  const { wallets } = useWallets();
  const navigate = useNavigate();
  const [section, setSection] = useState("profile");

  useEffect(() => {
    if (ready && !authenticated && !guest) navigate({ to: "/app/login" });
  }, [ready, authenticated, guest]);
  if (!ready || (!authenticated && !guest)) return null;

  const wallet = wallets[0];

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-xl font-semibold text-foreground mb-6">Settings</h1>
        </motion.div>
        <div className="flex gap-6">
          <nav className="w-44 flex-shrink-0 space-y-0.5 hidden sm:block">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left",
                  section === s.id
                    ? "bg-white/[0.07] text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]",
                )}
              >
                <s.icon className={cn("w-3.5 h-3.5", section === s.id && "text-signal")} />
                {s.label}
              </button>
            ))}
          </nav>
          <div className="sm:hidden flex overflow-x-auto gap-2 pb-2 mb-4 w-full">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={cn(
                  "flex-shrink-0 px-3 py-1.5 rounded-lg text-xs transition-all",
                  section === s.id
                    ? "bg-signal/15 text-signal border border-signal/25"
                    : "bg-white/[0.04] text-muted-foreground border border-border",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 min-w-0"
          >
            {section === "profile" && (
              <div className="space-y-4">
                <UserProfile />
                <div className="rounded-xl border border-border bg-surface p-5">
                  <h3 className="text-sm font-medium text-foreground mb-3">Display Name</h3>
                  <input
                    defaultValue={user?.twitter?.name ?? user?.google?.name ?? ""}
                    className="w-full bg-white/[0.04] border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-signal/40 focus:ring-1 focus:ring-signal/20 transition-all"
                    placeholder="Your display name"
                  />
                  <button className="mt-3 px-4 py-2 rounded-lg bg-signal/15 border border-signal/25 text-signal hover:bg-signal/25 transition-colors text-sm font-medium">
                    Save changes
                  </button>
                </div>
              </div>
            )}
            {section === "appearance" && (
              <div className="rounded-xl border border-border bg-surface p-5">
                <h3 className="text-sm font-medium text-foreground mb-4">Theme</h3>
                <div className="grid grid-cols-2 gap-3">
                  {["Dark", "System"].map((t) => (
                    <button
                      key={t}
                      className={cn(
                        "flex items-center gap-2 px-4 py-3 rounded-xl border text-sm transition-all",
                        t === "Dark"
                          ? "border-signal/40 bg-signal/10 text-signal"
                          : "border-border bg-white/[0.03] text-muted-foreground",
                      )}
                    >
                      {t === "Dark" && <Check className="w-3.5 h-3.5" />}
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {section === "language" && (
              <div className="rounded-xl border border-border bg-surface p-5">
                <h3 className="text-sm font-medium text-foreground mb-4">Language</h3>
                <select className="w-full bg-white/[0.04] border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-signal/40 transition-all">
                  <option>English (US)</option>
                  <option>English (UK)</option>
                </select>
              </div>
            )}
            {section === "wallet" && (
              <div className="rounded-xl border border-border bg-surface p-5">
                <h3 className="text-sm font-medium text-foreground mb-4">Connected Wallet</h3>
                {wallet ? (
                  <div>
                    <Row label="Address" value={wallet.address} />
                    <Row label="Type" value={wallet.walletClientType ?? "Unknown"} />
                    <Row label="Chain" value="Solana Mainnet" />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No wallet connected.</p>
                )}
              </div>
            )}
            {section === "accounts" && (
              <div className="rounded-xl border border-border bg-surface p-5">
                <h3 className="text-sm font-medium text-foreground mb-4">Connected Accounts</h3>
                <Row
                  label="X (Twitter)"
                  value={user?.twitter ? `@${user.twitter.username}` : "Not connected"}
                />
                <Row label="Google" value={user?.google?.email ?? "Not connected"} />
              </div>
            )}
            {section === "security" && (
              <div className="rounded-xl border border-border bg-surface p-5">
                <h3 className="text-sm font-medium text-foreground mb-4">Security</h3>
                <Row label="Authentication" value="Privy" />
                <Row label="Session active" value="Yes" />
                <div className="pt-3">
                  <button
                    onClick={() => {
                      exitGuestMode();
                      if (guest) navigate({ to: "/app/login" });
                      else logout().then(() => navigate({ to: "/app/login" }));
                    }}
                    className="px-4 py-2 rounded-lg bg-destructive/15 border border-destructive/25 text-destructive hover:bg-destructive/25 transition-colors text-sm font-medium"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
            {section === "notifications" && (
              <div className="rounded-xl border border-border bg-surface p-5">
                <h3 className="text-sm font-medium text-foreground mb-4">
                  Notification Preferences
                </h3>
                <Row
                  label="Network updates"
                  value="Major announcements"
                  action={<Toggle defaultOn />}
                />
                <Row
                  label="Credit alerts"
                  value="Low balance warnings"
                  action={<Toggle defaultOn />}
                />
                <Row label="Product updates" value="New features" action={<Toggle />} />
                <Row label="Marketing emails" value="Tips and promotions" action={<Toggle />} />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
