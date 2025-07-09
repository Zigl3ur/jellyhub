import { Metadata } from "next";

import ServerStats from "@/components/serversStats";
import CardsCaroussel from "@/components/cardsCarroussel";
import Link from "next/link";
import NotFound from "@/components/global/noItemFound";
import { getUser } from "@/server/utils";
import { getAllServerItems } from "@/server/actions/jellyfin.actions";

export const metadata: Metadata = {
  title: "JellyHub - Home",
};

export default async function Home() {
  await getUser();

  const list = await getAllServerItems();

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
      reduced: false,
    },
    {
      href: "/series",
      title: "Series",
      data: data.series,
      reduced: false,
    },
    {
      href: "/albums",
      title: "Albums",
      data: data.albums,
      reduced: true,
    },
  ];

  return (
    <div className="flex-col">
      <ServerStats
        count={[
          data.serverCount,
          data.movies.length,
          data.series.length,
          data.albums.length,
        ]}
      />
      {data.serverCount !== 0 ? (
        <div className="grid gap-8 mt-8">
          {itemsValues.map((value) => {
            return value.data.length > 0 ? (
              <CardsCaroussel
                key={value.title}
                items={value.data}
                isReduced={value.reduced}
              >
                <h2 className="text-2xl font-semibold">
                  <Link href={value.href} className="hover:underline">
                    {value.title}
                  </Link>
                </h2>
              </CardsCaroussel>
            ) : null;
          })}
        </div>
      ) : (
        <NotFound />
      )}
    </div>
  );
}
