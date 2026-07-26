import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/_home/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_main/_home/settings/"!</div>;
}
