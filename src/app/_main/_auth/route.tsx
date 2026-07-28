import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "@/functions/auth.functions";
import Logo from "@/components/logo";

export const Route = createFileRoute("/_main/_auth")({
  beforeLoad: async () => {
    const session = await getSession();

    if (session) throw redirect({ to: "/" });

    return { session };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex items-center flex-col justify-center min-h-svh gap-8 p-4">
      <Logo />
      <Outlet />
    </div>
  );
}
