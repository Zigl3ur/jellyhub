import { Await, createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { getJellyData } from "@/functions/settings.functions";
import ServerCard from "@/components/server/server-card";
import AddServerDialog from "@/components/server/add-server-dialog";

const jellyDataQuery = queryOptions({
  queryFn: getJellyData,
  queryKey: ["jellydata"],
});

export const Route = createFileRoute("/_main/_home/settings/")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(jellyDataQuery);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSuspenseQuery(jellyDataQuery);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-5xl font-serif">Servers</h3>
        <AddServerDialog />
      </div>
      <div className="flex flex-wrap gap-2">
        {data.servers.map((s) => (
          <ServerCard key={s.serverUrl} server={s} />
        ))}
      </div>
    </div>
  );
}
