import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app-config")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(JSON.stringify({ privyAppId: process.env.PRIVY_APP_ID ?? "" }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
  component: () => null,
});
