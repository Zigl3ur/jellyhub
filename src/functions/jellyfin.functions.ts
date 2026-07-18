import { createServerFn } from "@tanstack/react-start";
import { getUser } from "./auth.functions";
import type { ServerActionReturn } from "@/types/actions.types";
import type { itemJellyfin } from "@/types/jellyfin-api.types";
import { getAllItems, getLibraryItems } from "@/lib/api.jellyfin";
import { filterItems } from "@/lib/utils";
import db from "@/lib/db";

/**
 * action to fetch all items from registered and reachable servers
 * @returns servercount, movies, series and albums list
 */
export const getAllServersItems = createServerFn().handler(
  async (): Promise<
    ServerActionReturn<{
      serverCount: number;
      movies: Array<itemJellyfin>;
      series: Array<itemJellyfin>;
      musicAlbum: Array<itemJellyfin>;
    }>
  > => {
    const user = await getUser();

    const list = await db.query.jellydata.findMany({
      where: { userId: user.id },
      columns: {
        serverUrl: true,
        serverToken: true,
      },
    });

    const rawItems = await Promise.all(
      list.map(async (jellydata) => {
        return await getAllItems(jellydata.serverUrl, jellydata.serverToken);
      }),
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
        moviesList: [] as Array<itemJellyfin>,
        seriesList: [] as Array<itemJellyfin>,
        albumsList: [] as Array<itemJellyfin>,
      },
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
  },
);

/**
 * action to fetch all movies from registered and reachable servers
 * @returns movies list
 */
export const getAllServersMovies = createServerFn().handler(
  async (): Promise<ServerActionReturn<Array<itemJellyfin>>> => {
    const user = await getUser();

    const list = await db.query.jellydata.findMany({
      where: { userId: user.id },
      columns: {
        serverUrl: true,
        serverToken: true,
      },
    });

    const rawItems = await Promise.all(
      list.map(async (jellydata) => {
        return await getLibraryItems(
          jellydata.serverUrl,
          jellydata.serverToken,
          "Movie",
        );
      }),
    );

    const items = rawItems.reduce(
      (acc, itemList) => {
        return {
          moviesList: [...acc.moviesList, ...(itemList.data ?? [])],
        };
      },
      {
        moviesList: [] as Array<itemJellyfin>,
      },
    );

    return {
      success: true,
      data: filterItems(items.moviesList),
    };
  },
);

/**
 * action to fetch all series from registered and reachable servers
 * @returns series list
 */
export const getAllServersSeries = createServerFn().handler(
  async (): Promise<ServerActionReturn<Array<itemJellyfin>>> => {
    const user = await getUser();

    const list = await db.query.jellydata.findMany({
      where: { userId: user.id },
      columns: {
        serverUrl: true,
        serverToken: true,
      },
    });

    const rawItems = await Promise.all(
      list.map(async (jellydata) => {
        return await getLibraryItems(
          jellydata.serverUrl,
          jellydata.serverToken,
          "Series",
        );
      }),
    );

    const items = rawItems.reduce(
      (acc, itemList) => {
        return {
          seriesList: [...acc.seriesList, ...(itemList.data ?? [])],
        };
      },
      {
        seriesList: [] as Array<itemJellyfin>,
      },
    );

    return {
      success: true,
      data: filterItems(items.seriesList),
    };
  },
);

/**
 * action to fetch all albums from registered and reachable servers
 * @returns albums list
 */
export const getAllServersAlbums = createServerFn().handler(
  async (): Promise<ServerActionReturn<Array<itemJellyfin>>> => {
    const user = await getUser();

    const list = await db.query.jellydata.findMany({
      where: { userId: user.id },
      columns: {
        serverUrl: true,
        serverToken: true,
      },
    });

    const rawItems = await Promise.all(
      list.map(async (jellydata) => {
        return await getLibraryItems(
          jellydata.serverUrl,
          jellydata.serverToken,
          "MusicAlbum",
        );
      }),
    );

    const items = rawItems.reduce(
      (acc, itemList) => {
        return {
          albumsList: [...acc.albumsList, ...(itemList.data ?? [])],
        };
      },
      {
        albumsList: [] as Array<itemJellyfin>,
      },
    );

    return {
      success: true,
      data: filterItems(items.albumsList),
    };
  },
);
