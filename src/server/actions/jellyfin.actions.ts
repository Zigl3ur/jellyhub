"use server";

import { itemJellyfin } from "@/types/jellyfin-api.types";
import { prisma } from "../../lib/prisma";
import { getUser } from "../utils";
import { ServerActionReturn } from "@/types/actions.types";
import { getAllItems, getLibraryItems } from "@/lib/api.jellyfin";
import { decryptToken, filterItems } from "@/lib/utils";

export async function getAllServersItems(): Promise<
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

export async function getAllServersMovies(): Promise<
  ServerActionReturn<itemJellyfin[]>
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
      return await getLibraryItems(
        jellydata.serverUrl,
        decryptToken(jellydata.serverToken),
        "Movie"
      );
    })
  );

  const items = rawItems.reduce(
    (acc, itemList) => {
      return {
        moviesList: [...acc.moviesList, ...(itemList.data ?? [])],
      };
    },
    {
      moviesList: [] as itemJellyfin[],
    }
  );

  return {
    success: true,
    data: filterItems(items.moviesList),
  };
}

export async function getAllServersSeries(): Promise<
  ServerActionReturn<itemJellyfin[]>
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
      return await getLibraryItems(
        jellydata.serverUrl,
        decryptToken(jellydata.serverToken),
        "Series"
      );
    })
  );

  const items = rawItems.reduce(
    (acc, itemList) => {
      return {
        seriesList: [...acc.seriesList, ...(itemList.data ?? [])],
      };
    },
    {
      seriesList: [] as itemJellyfin[],
    }
  );

  return {
    success: true,
    data: filterItems(items.seriesList),
  };
}

export async function getAllServersAlbums(): Promise<
  ServerActionReturn<itemJellyfin[]>
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
      return await getLibraryItems(
        jellydata.serverUrl,
        decryptToken(jellydata.serverToken),
        "MusicAlbum"
      );
    })
  );

  const items = rawItems.reduce(
    (acc, itemList) => {
      return {
        albumsList: [...acc.albumsList, ...(itemList.data ?? [])],
      };
    },
    {
      albumsList: [] as itemJellyfin[],
    }
  );

  return {
    success: true,
    data: filterItems(items.albumsList),
  };
}
