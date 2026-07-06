import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import { motion } from "motion/react";
import { Wallet, Twitter, Chrome } from "lucide-react";
import orbitLogoIcon from "@/assets/orbit-logo-icon.png";

export const Route = createFileRoute("/app/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login, authenticated, ready } = usePrivy();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && authenticated) {
      navigate({ to: "/app" });
    }
  }, [ready, authenticated, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-signal/[0.04] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[300px] bg-orbit/[0.03] rounded-full blur-3xl" />
      </div>
      <div className="absolute inset-0 grid-lines opacity-30 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
        className="relative w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-14 h-14 mb-4">
            <div
              className="absolute inset-0 rounded-full bg-signal/10 animate-pulse"
              style={{ animationDuration: "3s" }}
            />
            <div className="absolute inset-2 rounded-full bg-signal/20" />
            <div className="absolute inset-3.5 rounded-full bg-background border border-signal/40" />
            <img
              src={orbitLogoIcon}
              alt="0RBIT"
              className="absolute inset-0 m-auto w-5 h-5 object-contain"
            />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">0RBIT</h1>
          <p className="text-sm text-muted-foreground mt-1">AI Infrastructure for Everyone</p>
          <p className="text-xs text-muted-foreground/70 mt-2 text-center max-w-xs">
            Sign in to access the decentralized AI network.
          </p>
        </div>

        {/* Login box */}
        <div className="glass rounded-2xl border border-border p-6 space-y-3">
          <button
            onClick={() => login({ loginMethods: ["wallet"] })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-signal/10 border border-signal/25 text-foreground hover:bg-signal/20 hover:border-signal/40 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-signal/15 flex items-center justify-center flex-shrink-0">
              <Wallet className="w-4 h-4 text-signal" />
            </div>
            <div className="text-left flex-1">
              <span className="text-sm font-medium">Continue with Wallet</span>
              <p className="text-xs text-muted-foreground">Phantom, Backpack, Solflare & more</p>
            </div>
          </button>

          <button
            onClick={() => login({ loginMethods: ["twitter"] })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-border text-foreground hover:bg-white/[0.08] hover:border-border-strong transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0">
              <Twitter className="w-4 h-4 text-foreground" />
            </div>
            <span className="text-sm font-medium">Continue with X</span>
          </button>

          <button
            onClick={() => login({ loginMethods: ["google"] })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-border text-foreground hover:bg-white/[0.08] hover:border-border-strong transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0">
              <Chrome className="w-4 h-4 text-foreground" />
            </div>
            <span className="text-sm font-medium">Continue with Google</span>
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground/50 mt-6">
          Powered by Privy · Secured by decentralized infrastructure
        </p>
      </motion.div>
    </div>
  );
}
