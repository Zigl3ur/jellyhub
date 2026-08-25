import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/_home/settings/")({
  beforeLoad: () => {
    throw redirect({ to: "/settings/servers" });
  },
});
