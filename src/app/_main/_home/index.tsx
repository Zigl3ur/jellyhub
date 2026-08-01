import { createFileRoute } from "@tanstack/react-router";
import { getServerItems } from "@/functions/jellyfin.functions";
import { getJellyData } from "@/functions/server.functions";

export const Route = createFileRoute("/_main/_home/")({
  loader: async () => {
    const { servers } = await getJellyData();

    let dataitems;
    try {
      dataitems = await getServerItems({
        data: {
          url: servers[1].serverUrl,
          opts: {
            types: ["MusicAlbum"],
          },
        },
      });
      console.log(dataitems.Items);
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

  return null;
}

function LoadingComponent() {
  return <div className="flex flex-col gap-20 max-w-[2000px] mx-auto"></div>;
}
