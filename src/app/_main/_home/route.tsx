import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { getSession, hasAdminUser } from "@/functions/auth.functions";

export const Route = createFileRoute("/_main/_home")({
  beforeLoad: async () => {
    const session = await getSession();

    if (!session) throw redirect({ to: "/login" });

    return { session };
  },
  component: MainLayout,
});

function MainLayout() {
  return (
    <main className="py-2 pr-2 pl-2 md:pl-0">
      <Outlet />
    </main>
  );
}
