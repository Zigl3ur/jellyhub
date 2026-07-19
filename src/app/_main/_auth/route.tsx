import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "@/functions/auth.functions";
import Logo from "@/components/logo";

export const Route = createFileRoute("/_main/_auth")({
  beforeLoad: async () => {
    const session = await getSession();

    if (session) throw redirect({ to: "/" });

    return { session };
  },
  component: () => (
    <div className="flex items-center flex-col justify-center h-dvh gap-8">
      <Logo />
      <Outlet />
    </div>
  ),
});
