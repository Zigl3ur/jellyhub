import { createFileRoute } from "@tanstack/react-router";
import { getServersItems } from "@/functions/jellyfin.functions";
import ItemCard from "@/components/item/item-card";

export const Route = createFileRoute("/_main/_home/")({
  loader: async () => {
    const data = await getServersItems({
      data: { opts: { types: ["MusicAlbum", "Movie", "Series"] } },
    });

    return { data };
  },
  component: RouteComponent,
  pendingComponent: LoadingComponent,
  pendingMs: 0,
});

function RouteComponent() {
  const { data } = Route.useLoaderData();

  return (
    <div className="flex flex-wrap gap-1.5 justify-center">
      {data.map((i) => (
        <ItemCard key={i.Id} item={i} />
      ))}
    </div>
  );
}

function LoadingComponent() {
  return <div className="size-50 bg-red-500">Loading aaaa</div>;
}
