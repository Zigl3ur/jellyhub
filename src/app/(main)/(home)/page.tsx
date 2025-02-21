import { Metadata } from "next";

import { checkConn, getAllServerItems } from "@/lib/api.jellyfin";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AllItemsType } from "@/types/jellyfin.types";
import ServerStats from "@/components/serversStats";
import { Suspense } from "react";
import ServerStatsLoading from "./loading";
import CardsCaroussel from "@/components/cardsCarroussel";
import Link from "next/link";

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

  const allItems = await getAllServerItems(filteredServers);

  return { serverCount: filteredServers.length, allItems };
}

export default async function Home() {
  const data = (await getAllItemsAction()) ?? {
    serverCount: 0,
    allItems: { movies: [], shows: [], musicAlbum: [] },
  };

  return (
    <div className="flex-col">
      <Suspense fallback={<ServerStatsLoading />}>
        <ServerStats
          isLoading={false}
          count={[
            data.serverCount,
            data.allItems.movies.length,
            data.allItems.shows.length,
            data.allItems.musicAlbum.length,
          ]}
        />
      </Suspense>
      <div className="grid gap-8 mt-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            <Link href={"/movies"} className="hover:underline">
              Movies
            </Link>
          </h2>
          <CardsCaroussel isLoading={false} items={data.allItems.movies} />
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            <Link href={"/shows"} className="hover:underline">
              Shows
            </Link>
          </h2>
          <CardsCaroussel isLoading={false} items={data.allItems.shows} />
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            <Link href={"/music-albums"} className="hover:underline">
              Music
            </Link>
          </h2>
          <CardsCaroussel isLoading={false} items={data.allItems.musicAlbum} />
        </section>
      </div>
    </div>
  );
}
