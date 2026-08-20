import { Link } from "@/components/ui/link";
import {
  createFileRoute,
  Outlet,
  type LinkProps,
} from "@tanstack/react-router";

export const Route = createFileRoute("/_main/_home/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    session: { user },
  } = Route.useRouteContext();

  const destinations = [
    {
      label: "Servers",
      to: "/settings/servers",
    },
    {
      label: "Profile",
      to: "/settings/profile",
    },
    {
      label: "Users",
      to: "/settings/users",
      enabled: user.role === "admin",
    },
  ] satisfies Array<{
    label: string;
    to: LinkProps["to"];
    enabled?: boolean;
  }>;

  return (
    <div className="space-y-8">
      <div className="flex gap-2 p-1 bg-accent-foreground rounded w-fit border border-muted">
        {destinations
          .filter((d) => d.enabled ?? true)
          .map((d) => (
            <Link key={d.label} to={d.to} variant="outline" className="h-full">
              {d.label}
            </Link>
          ))}
      </div>
      <Outlet />
    </div>
  );
}
