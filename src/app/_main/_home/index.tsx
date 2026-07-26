import { createFileRoute } from "@tanstack/react-router";
import { getServerItems } from "@/functions/jellyfin.functions";
import { getJellyData } from "@/functions/settings.functions";
import LoaderIcon from "@/components/ui/loader-icon";

export const Route = createFileRoute("/_main/_home/")({
  loader: async () => {
    const { data } = await getJellyData();
    console.log(data);

    let dataitems;
    try {
      dataitems = await getServerItems({
        data: {
          address: data[0].serverUrl,
          token: data[0].serverToken,
          opts: {
            types: ["Season"],
            parentId: "5710cacf293f8dcf06f83f5ac13e1fbb",
          },
        },
      });
      console.log(dataitems.Items);
    } catch (err) {
      console.log(err);
    }

    return { data: dataitems };
  },
  component: Home,
  pendingComponent: LoadingComponent,
  pendingMs: 0,
});

function Home() {
  const { data } = Route.useLoaderData();

  return (
    <div className="max-w-[2000px] mx-auto">
      <pre>{JSON.stringify(data?.Items, null, 2)}</pre>
      <LoaderIcon />
    </div>
  );
}

function LoadingComponent() {
  return <div className="flex flex-col gap-20 max-w-[2000px] mx-auto"></div>;
}
