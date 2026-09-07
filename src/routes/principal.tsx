import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/principal")({
  component: PrincipalLayout,
});

function PrincipalLayout() {
  return (
    <AppShell role="principal">
      <Outlet />
    </AppShell>
  );
}
