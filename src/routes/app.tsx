import { createFileRoute, Outlet } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { PrivyProvider } from "@/components/app/PrivyProvider";

const getPrivyAppId = createServerFn({ method: "GET" }).handler(async () => {
  return { privyAppId: process.env.PRIVY_APP_ID ?? "" };
});

export const Route = createFileRoute("/app")({
  loader: () => getPrivyAppId(),
  component: AppLayout,
});

function AppLayout() {
  const { privyAppId } = Route.useLoaderData();
  return (
    <PrivyProvider appId={privyAppId}>
      <Outlet />
    </PrivyProvider>
  );
}
