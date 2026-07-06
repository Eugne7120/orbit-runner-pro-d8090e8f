import { PrivyProvider as BasePrivyProvider } from "@privy-io/react-auth";
import { useState, useEffect, type ReactNode } from "react";

export function PrivyProvider({ children }: { children: ReactNode }) {
  const [appId, setAppId] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/app-config")
      .then((r) => r.json())
      .then((data) => setAppId(data.privyAppId || null))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">
          Failed to load configuration. Please refresh.
        </p>
      </div>
    );
  }

  if (appId === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-signal border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!appId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-sm text-center space-y-3">
          <p className="text-sm font-medium text-foreground">Configuration missing</p>
          <p className="text-xs text-muted-foreground">
            <code className="font-mono bg-white/[0.06] px-1 rounded">PRIVY_APP_ID</code> is not set.
            Add it in your Replit Secrets.
          </p>
        </div>
      </div>
    );
  }

  return (
    <BasePrivyProvider
      appId={appId}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#4db8ff",
          logo: "/apple-touch-icon.png",
        },
        loginMethods: ["wallet", "twitter", "google"],
        embeddedWallets: {
          ethereum: { createOnLogin: "off" },
          solana: { createOnLogin: "off" },
        },
      }}
    >
      {children}
    </BasePrivyProvider>
  );
}
