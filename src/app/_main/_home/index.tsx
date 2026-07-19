import { createFileRoute } from "@tanstack/react-router";
import { getAllServersItems } from "@/functions/jellyfin.functions";

export const Route = createFileRoute("/_main/_home/")({
  component: Home,
  pendingComponent: LoadingComponent,
  pendingMs: 0,
});

async function Home() {
  const list = await getAllServersItems();

  // easier to mess with undefined property
  const data = {
    serverCount: list.data?.serverCount || 0,
    movies: list.data?.movies || [],
    series: list.data?.series || [],
    albums: list.data?.musicAlbum || [],
  };

  const itemsValues = [
    {
      href: "/movies",
      title: "Movies",
      data: data.movies,
    },
    {
      href: "/series",
      title: "Series",
      data: data.series,
    },
    {
      href: "/albums",
      title: "Albums",
      data: data.albums,
    },
  ];

  return <div className="max-w-[2000px] mx-auto"></div>;
}

function LoadingComponent() {
  return <div className="flex flex-col gap-20 max-w-[2000px] mx-auto"></div>;
}
