import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PrivyProvider } from "@/components/app/PrivyProvider";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <PrivyProvider>
      <Outlet />
    </PrivyProvider>
  );
}
