import { Metadata } from "next";

import { checkConn, getAllServerItems } from "@/lib/api.jellyfin";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AllItemsType } from "@/types/jellyfin.types";
import ServerStats from "@/components/serversStats";
import CardsCaroussel from "@/components/cardsCarroussel";
import Link from "next/link";
import NotFound from "@/components/notFound";

export const metadata: Metadata = {
  title: "JellyHub - Home",
};

async function getAllItemsAction(): Promise<void | {
  serverCount: number;
  allItems: AllItemsType;
}> {
  "use server";
  const session = await getSession();

  if (!session) return;

  const itemsList = await prisma.accounts.findFirst({
    where: {
      username: session.username as string,
    },
    select: {
      jellydata: true,
    },
  });

  if (!itemsList) return;

  const serverList = await Promise.all(
    itemsList.jellydata.map(async (server) => {
      const status = await checkConn(server.server, server.token);
      if (status === "Up")
        return { address: server.server, token: server.token };
    })
  );

  const filteredServers = serverList.filter((server) => server !== undefined);

  const allItems = (await getAllServerItems(filteredServers)) as AllItemsType;

  return { serverCount: filteredServers.length, allItems };
}

export default async function Home() {
  const data = (await getAllItemsAction()) ?? {
    serverCount: 0,
    allItems: { movies: [], shows: [], musicAlbum: [] },
  };

  const itemsValues = [
    {
      href: "/Movie",
      title: "Movies",
      data: data.allItems.movies,
      reduced: false,
    },
    {
      href: "/Series",
      title: "Series",
      data: data.allItems.shows,
      reduced: false,
    },
    {
      href: "/MusicAlbum",
      title: "Music Albums",
      data: data.allItems.musicAlbum,
      reduced: true,
    },
  ];

  return (
    <div className="flex-col">
      <ServerStats
        isLoading={false}
        count={[
          data.serverCount,
          data.allItems.movies.length,
          data.allItems.shows.length,
          data.allItems.musicAlbum.length,
        ]}
      />
      {data.serverCount !== 0 ? (
        <div className="grid gap-8 mt-8">
          {itemsValues.map((value) => {
            return value.data.length > 0 ? (
              <section key={value.href}>
                <h2 className="text-2xl font-semibold mb-4 pl-14">
                  <Link href={value.href} className="hover:underline">
                    {value.title}
                  </Link>
                </h2>
                <CardsCaroussel
                  isLoading={false}
                  items={value.data}
                  isReduced={value.reduced}
                />
              </section>
            ) : null;
          })}
        </div>
      ) : (
        <NotFound />
      )}
    </div>
  );
}
