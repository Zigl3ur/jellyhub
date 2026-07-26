import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "@/functions/auth.functions";
import Header from "@/components/header";

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
    <main className="p-2">
      <Header />
      <Outlet />
    </main>
  );
}
