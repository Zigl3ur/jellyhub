import AddServerDialog from "@/components/server/add-server-dialog";
import ServerCard, {
  ServerCardSkeleton,
} from "@/components/server/server-card";
import { getJellyData } from "@/functions/server.functions";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { HardDrive } from "lucide-react";
import { Suspense } from "react";

const jellyDataQuery = queryOptions({
  queryFn: () => getJellyData({ data: { updateStatus: true } }),
  queryKey: ["jellydata"],
});

export const Route = createFileRoute("/_main/_home/settings/servers/")({
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(jellyDataQuery);
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-5xl font-serif">Servers</h3>
        <AddServerDialog />
      </div>
      <Suspense
        fallback={
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-2">
            <ServersContentSkeleton />
          </div>
        }
      >
        <ServersContent />
      </Suspense>
    </div>
  );
}

function ServersContent() {
  const { data, isFetching } = useSuspenseQuery(jellyDataQuery);

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-2">
      {data.servers.length > 0 ? (
        data.servers.map((s) => <ServerCard key={s.serverUrl} server={s} />)
      ) : isFetching ? (
        <ServerCardSkeleton />
      ) : (
        <EmptyServers />
      )}
    </div>
  );
}

function ServersContentSkeleton() {
  return Array.from({ length: 12 }).map((_, a) => (
    <ServerCardSkeleton key={a} />
  ));
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
