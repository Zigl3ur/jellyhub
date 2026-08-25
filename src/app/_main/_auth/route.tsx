import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "@/functions/auth.functions";

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
      <div className="flex flex-col xs:flex-row gap-2 text-center justify-center items-center">
        <img src={"/icon.png"} alt="jellyhub icon" width={60} height={60} />
        <h1 className="pl-2 font-semibold text-4xl">JellyHub</h1>
      </div>
      <Outlet />
    </div>
  );
}
