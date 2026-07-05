import { PrivyProvider as BasePrivyProvider } from "@privy-io/react-auth";
import type { ReactNode } from "react";

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID ?? "";

export function PrivyProvider({ children }: { children: ReactNode }) {
  return (
    <BasePrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#4db8ff",
          logo: "/favicon.ico",
        },
        loginMethods: ["wallet", "twitter", "google"],
        walletConnectCloudProjectId: undefined,
        embeddedWallets: {
          createOnLogin: "off",
        },
        solanaClusters: [{ name: "mainnet-beta", rpcUrl: "https://api.mainnet-beta.solana.com" }],
      }}
    >
      {children}
    </BasePrivyProvider>
  );
}
