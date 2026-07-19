import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { hasAdminUser } from "@/functions/auth.functions";

export const Route = createFileRoute("/_main")({
  beforeLoad: async () => {
    const alreadyHasAdmin = await hasAdminUser();

    if (!alreadyHasAdmin) throw redirect({ to: "/get-started" });
  },
  component: Outlet,
});
