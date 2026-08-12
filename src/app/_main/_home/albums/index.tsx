import { createFileRoute } from "@tanstack/react-router";
import { getServersItems } from "@/functions/jellyfin.functions";
import ItemCard from "@/components/item/item-card";

export const Route = createFileRoute("/_main/_home/albums/")({
  loader: async () => {
    const data = await getServersItems({
      data: { opts: { types: ["MusicAlbum"] } },
    });

    return { data };
  },
  component: RouteComponent,
  pendingComponent: LoadingComponent,
  pendingMs: 0,
  head: () => ({ meta: [{ title: "Albums - JellyHub" }] }),
});

function RouteComponent() {
  const { data } = Route.useLoaderData();

  return (
    <>
      <h3 className="font-serif text-4xl">Albums ({data.length})</h3>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {data.map((i) => (
          <ItemCard key={i.Id} item={i} />
        ))}
      </div>
    </>
  );
}

function LoadingComponent() {
  return <div className="size-50 bg-red-500">Loading aaaa</div>;
}
