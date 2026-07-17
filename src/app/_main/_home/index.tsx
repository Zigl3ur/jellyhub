import { Link, createFileRoute } from "@tanstack/react-router";
import ServerStats from "@/components/servers-stats";
import ItemsCarousel from "@/components/items-carousel";
import NotFound from "@/components/no-item-found";
import { getUser } from "@/server/utils";
import { getAllServersItems } from "@/server/functions/jellyfin.functions";
import ItemsLoader from "@/components/loader";

export const Route = createFileRoute("/_main/_home/")({
  component: Home,
  pendingComponent: LoadingComponent,
  pendingMs: 0,
});

export default async function Home() {
  await getUser();

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

  return (
    <div className="max-w-[2000px] mx-auto">
      <ServerStats
        count={[
          data.serverCount,
          data.movies.length,
          data.series.length,
          data.albums.length,
        ]}
      />
      {data.movies.length === 0 &&
      data.series.length === 0 &&
      data.albums.length === 0 ? (
        <NotFound />
      ) : (
        <div className="space-y-8">
          {itemsValues.map((value) => (
            <ItemsCarousel key={value.title} items={value.data}>
              <h2 className="text-2xl font-semibold">
                <Link to={value.href} className="hover:underline">
                  {value.title}
                </Link>
              </h2>
            </ItemsCarousel>
          ))}
        </div>
      )}
    </div>
  );
}

function LoadingComponent() {
  return (
    <div className="flex flex-col gap-20 max-w-[2000px] mx-auto">
      <ServerStats isLoading={true} count={[0, 0, 0, 0]} />
      <ItemsLoader />
    </div>
  );
}
