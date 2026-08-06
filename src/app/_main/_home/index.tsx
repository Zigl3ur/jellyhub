import { createFileRoute } from "@tanstack/react-router";
import { getServerItems } from "@/functions/jellyfin.functions";
import { getJellyData } from "@/functions/server.functions";
import ItemCard from "@/components/item/item-card";

export const Route = createFileRoute("/_main/_home/")({
  loader: async () => {
    const { servers } = await getJellyData();

    let dataitems;
    try {
      dataitems = await getServerItems({
        data: {
          url: servers[0].serverUrl,
          opts: {
            types: ["MusicAlbum"],
          },
        },
      });
    } catch (err) {
      console.log(err);
    }

    return { data: dataitems };
  },
  component: RouteComponent,
  pendingComponent: LoadingComponent,
  pendingMs: 0,
});

function RouteComponent() {
  const { data } = Route.useLoaderData();

  return (
    <div className="flex flex-wrap gap-1.5 justify-center">
      {data?.map((i) => (
        <ItemCard key={i.Id} serverUrl={""} item={i} />
      ))}
    </div>
  );
}

function LoadingComponent() {
  return <div className="size-50 bg-red-500">Loading aaaa</div>;
}
