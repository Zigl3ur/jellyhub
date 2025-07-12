import { Metadata } from "next";

import ServerStats from "@/components/serversStats";
import ItemsCarousel from "@/components/itemsCarousel";
import Link from "next/link";
import NotFound from "@/components/noItemFound";
import { getUser } from "@/server/utils";
import { getAllServersItems } from "@/server/actions/jellyfin.actions";
import { X } from "lucide-react";

export const metadata: Metadata = {
  title: "JellyHub - Home",
};

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
    <div className="max-w-12xl mx-auto">
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
                <Link href={value.href} className="hover:underline">
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
