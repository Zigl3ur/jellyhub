import ItemCard, { ItemCardLoading } from "@/components/item/item-card";
import SearchBar from "@/components/search-bar";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/components/ui/link";
import Skeleton from "@/components/ui/skeleton";
import {
  getServersItems,
  type ServersItems,
} from "@/functions/jellyfin.functions";
import { getJellyData } from "@/functions/server.functions";
import { Await, createFileRoute, notFound } from "@tanstack/react-router";
import { SearchX, ServerOff } from "lucide-react";
import { useState } from "react";

const routesWithType = [
  { param: "movies", type: "Movie", name: "Movies" },
  { param: "tv-shows", type: "Series", name: "TV Shows" },
  { param: "albums", type: "MusicAlbum", name: "Albums" },
] as const;

export const Route = createFileRoute("/_main/_home/$type/")({
  beforeLoad: ({ params }) => {
    const routeData = routesWithType.find((r) => r.param === params.type);

    if (!routeData) throw notFound();
  },
  loader: async ({ params }) => {
    const routeData = routesWithType.find((r) => r.param === params.type);

    if (!routeData) throw notFound();

    const items = getServersItems({
      data: { opts: { types: [routeData.type] } },
    });

    const { servers } = await getJellyData({ data: { updateStatus: false } });

    return {
      routeData,
      items,
      servers,
    };
  },
  component: RouteComponent,
  pendingComponent: LoadingComponent,
  pendingMs: 0,
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.routeData?.name} - JellyHub` }],
  }),
});

function RouteComponent() {
  const { items, servers, routeData } = Route.useLoaderData();
  const [filtered, setFiltered] = useState<ServersItems | null>(null);

  return (
    <Await promise={items} fallback={<LoadingComponent />}>
      {(data) => {
        const albums = filtered ?? data;

        return (
          <div className="space-y-6">
            <div className="flex flex-col xs:flex-row xs:justify-between xs:items-end gap-4">
              <div className="space-y-1">
                <h3 className="font-serif text-5xl">
                  {routeData.name} ({data.length})
                </h3>
                <p className="opacity-75">Accross {servers.length} servers</p>
              </div>
              <SearchBar
                placeholder={`Search for ${routeData.name}`}
                items={data}
                onSearch={setFiltered}
                className="w-full xs:w-70"
              />
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2">
              {servers.length === 0 ? (
                <NoServers itemName={routeData.name} />
              ) : albums.length > 0 ? (
                albums.map((i) => <ItemCard key={i.Id} item={i} />)
              ) : (
                <EmptyItems itemName={routeData.name} />
              )}
            </div>
          </div>
        );
      }}
    </Await>
  );
}

function LoadingComponent() {
  const { type } = Route.useParams();
  const routeData = routesWithType.find((r) => r.param === type);

  return (
    <div className="space-y-6">
      <div className="flex flex-col xs:flex-row xs:justify-between xs:items-end gap-4">
        <div className="space-y-1">
          <h3 className="font-serif text-5xl flex items-center gap-2">
            {routeData?.name}
            <Skeleton className="h-10 w-12 rounded" />
          </h3>
          <div className="opacity-75 flex items-center gap-1">
            Accross <Skeleton className="w-3.5 h-5" /> servers
          </div>
        </div>
        <Input
          disabled
          placeholder={`Search for ${routeData?.name}`}
          className="w-full xs:w-70"
        />
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2">
        {Array.from({ length: 52 }).map((_, i) => (
          <ItemCardLoading
            key={i}
            type={routeData?.type === "MusicAlbum" ? "small" : "default"}
          />
        ))}
      </div>
    </div>
  );
}

interface EmptyItemsProps {
  itemName: string;
}

function EmptyItems({ itemName }: EmptyItemsProps) {
  return (
    <div className="bg-accent/45 col-span-full p-1 flex-col h-75 gap-4 flex items-center justify-center rounded border border-muted w-full">
      <div className="flex flex-col items-center gap-0.5">
        <div className="size-8 mb-2 flex items-center justify-center p-1.25 rounded bg-accent-foreground border border-muted">
          <SearchX />
        </div>
        <h5 className="text-lg">No {itemName} found</h5>
        <p className="opacity-50 text-center">
          No Items found through configured servers.
        </p>
      </div>
    </div>
  );
}

function NoServers({ itemName }: EmptyItemsProps) {
  return (
    <div className="bg-accent/45 col-span-full p-1 flex-col h-75 gap-4 flex items-center justify-center rounded border border-muted w-full">
      <div className="flex flex-col items-center gap-0.5">
        <div className="size-8 mb-2 flex items-center justify-center p-1.25 rounded bg-accent-foreground border border-muted">
          <ServerOff />
        </div>
        <h5 className="text-lg">No Servers configured</h5>
        <p className="opacity-50 text-center">
          Configure Jellyfin Servers to see available {itemName}
        </p>
      </div>
      <Button
        nativeButton={false}
        render={
          <Link to="/settings" variant="unstyled">
            Configure a Server
          </Link>
        }
      />
    </div>
  );
}
