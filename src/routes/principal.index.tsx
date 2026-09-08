import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/principal/")({
  beforeLoad: () => {
    throw redirect({ to: "/principal/overview" });
  },
});
