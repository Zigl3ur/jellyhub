import ItemCard, { ItemCardLoading } from "@/components/item/item-card";
import SearchBar from "@/components/search-bar";
import { Input } from "@/components/ui/input";
import Skeleton from "@/components/ui/skeleton";
import {
  getServersItems,
  type ServersItems,
} from "@/functions/jellyfin.functions";
import { getJellyData } from "@/functions/server.functions";
import { Await, createFileRoute, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";

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
          <>
            <div className="flex flex-col xs:flex-row xs:justify-between xs:items-end gap-4">
              <div className="space-y-1">
                <h3 className="font-serif text-4xl">
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
              {albums.map((i) => (
                <ItemCard key={i.Id} item={i} />
              ))}
            </div>
          </>
        );
      }}
    </Await>
  );
}

function LoadingComponent() {
  const { type } = Route.useParams();
  const routeData = routesWithType.find((r) => r.param === type);

  return (
    <>
      <div className="flex flex-col xs:flex-row xs:justify-between xs:items-end gap-4">
        <div className="space-y-1">
          <h3 className="font-serif text-4xl flex items-center gap-2">
            {routeData?.name}
            <Skeleton className="h-8 w-10 rounded" />
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
        {Array.from({ length: 25 }).map((_, i) => (
          <ItemCardLoading
            key={i}
            type={routeData?.type === "MusicAlbum" ? "small" : "default"}
          />
        ))}
      </div>
    </>
  );
}
