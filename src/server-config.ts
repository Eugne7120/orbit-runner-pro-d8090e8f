import { createAPIFileRoute } from "@tanstack/react-start/api";

export const APIRoute = createAPIFileRoute("/api/config")({
  GET: async () => {
    return new Response(
      JSON.stringify({
        privyAppId: process.env.PRIVY_APP_ID ?? "",
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  },
});
