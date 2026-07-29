import { Await, createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { getJellyData } from "@/functions/settings.functions";
import ServerCard from "@/components/server/server-card";
import Button from "@/components/ui/button";

export const Route = createFileRoute("/_main/_home/settings/")({
  loader: () => ({ servers: getJellyData() }),
  component: RouteComponent,
});

function RouteComponent() {
  const { servers } = Route.useLoaderData();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-5xl  font-serif">Servers</h3>
        <Button>
          <Plus /> Add Server
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Await promise={servers} fallback={"Loading..."}>
          {({ data }) =>
            data.map((s) => <ServerCard key={s.serverUrl} server={s} />)
          }
        </Await>
      </div>
    </div>
  );
}
