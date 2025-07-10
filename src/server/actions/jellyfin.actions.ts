"use server";

import { itemJellyfin } from "@/types/jellyfin-api.types";
import { prisma } from "../../lib/prisma";
import { getUser } from "../utils";
import { ServerActionReturn } from "@/types/actions.types";
import { getAllItems } from "@/lib/api.jellyfin";
import { decryptToken, filterItems } from "@/lib/utils";

// TODO: arg to choose which type to fetch
export async function getAllServerItems(): Promise<
  ServerActionReturn<{
    serverCount: number;
    movies: Array<itemJellyfin>;
    series: Array<itemJellyfin>;
    musicAlbum: Array<itemJellyfin>;
  }>
> {
  const user = await getUser();

  const list = await prisma.jellydata.findMany({
    where: { userId: user.id },
    select: {
      serverUrl: true,
      serverToken: true,
    },
  });

  const rawItems = await Promise.all(
    list.map(async (jellydata) => {
      return await getAllItems(
        jellydata.serverUrl,
        decryptToken(jellydata.serverToken)
      );
    })
  );

  const items = rawItems.reduce(
    (acc, itemList) => {
      return {
        moviesList: [...acc.moviesList, ...(itemList.data?.movies ?? [])],
        seriesList: [...acc.seriesList, ...(itemList.data?.series ?? [])],
        albumsList: [...acc.albumsList, ...(itemList.data?.musicAlbum ?? [])],
      };
    },
    {
      moviesList: [] as itemJellyfin[],
      seriesList: [] as itemJellyfin[],
      albumsList: [] as itemJellyfin[],
    }
  );

  // TODO: shuffle items

  return {
    success: true,
    data: {
      serverCount: list.length,
      movies: filterItems(items.moviesList),
      series: filterItems(items.seriesList),
      musicAlbum: filterItems(items.albumsList),
    },
  };
}
