import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { HardDrive } from "lucide-react";
import { getJellyData } from "@/functions/server.functions";
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
  head: () => ({ meta: [{ title: "Settings - JellyHub" }] }),
});

function RouteComponent() {
  const { data } = useSuspenseQuery(jellyDataQuery);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-5xl font-serif">Servers</h3>
        {data.servers.length > 0 && <AddServerDialog />}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {data.servers.length > 0 ? (
          data.servers.map((s) => <ServerCard key={s.serverUrl} server={s} />)
        ) : (
          <EmptyServers />
        )}
      </div>
    </div>
  );
}

function EmptyServers() {
  return (
    <div className="bg-accent/45 col-span-full h-75 flex-col gap-4 flex items-center justify-center rounded border border-muted w-full">
      <div className="flex flex-col items-center gap-0.5">
        <div className="size-8 mb-2 flex items-center justify-center p-1.25 rounded bg-accent-foreground border border-muted">
          <HardDrive />
        </div>
        <h5 className="text-lg">No Jellyfin Servers</h5>
        <p className="opacity-50">
          Get Started by adding and configuring a Jellyfin server to Jellyhub
        </p>
      </div>
      <AddServerDialog />
    </div>
  );
}
