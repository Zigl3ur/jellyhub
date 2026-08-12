import { Await, createFileRoute } from "@tanstack/react-router";
import { getServersItems } from "@/functions/jellyfin.functions";
import ItemCard, { ItemCardLoading } from "@/components/item/item-card";
import Skeleton from "@/components/ui/skeleton";
import { getJellyData } from "@/functions/server.functions";

export const Route = createFileRoute("/_main/_home/movies/")({
  loader: async () => {
    const items = getServersItems({
      data: { opts: { types: ["Movie"] } },
    });

    const { servers } = await getJellyData({ data: { updateStatus: false } });

    return {
      items,
      servers,
    };
  },
  component: RouteComponent,
  pendingComponent: LoadingComponent,
  pendingMs: 0,
  head: () => ({ meta: [{ title: "Movies - JellyHub" }] }),
});

function RouteComponent() {
  const { items, servers } = Route.useLoaderData();

  return (
    <Await promise={items} fallback={LoadingComponent()}>
      {(data) => (
        <>
          <div className="space-y-1">
            <h3 className="font-serif text-4xl">Movies ({data.length})</h3>
            <p className="opacity-75">Accross {servers.length} servers</p>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {data.map((i) => (
              <ItemCard key={i.Id} item={i} />
            ))}
          </div>
        </>
      )}
    </Await>
  );
}

function LoadingComponent() {
  return (
    <>
      <div className="space-y-1">
        <h3 className="font-serif text-4xl flex items-center gap-2">
          Movies
          <Skeleton className="h-8 w-10 rounded" />
        </h3>
        <p className="opacity-75 flex items-center gap-1">
          Accross <Skeleton className="w-3.5 h-5" /> servers
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {Array.from({ length: 25 }).map((_, i) => (
          <ItemCardLoading key={i} type="default" />
        ))}
      </div>
    </>
  );
}
