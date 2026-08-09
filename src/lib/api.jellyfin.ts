import "@tanstack/react-start/server-only";

import { Jellyfin } from "@jellyfin/sdk";
import {
  getImageApi,
  getItemsApi,
  getSessionApi,
  getSystemApi,
  getUserApi,
} from "@jellyfin/sdk/lib/utils/api";
import {
  BaseItemKind,
  ItemFields,
} from "@jellyfin/sdk/lib/generated-client/models";
import axios, { AxiosError } from "axios";
import type {
  BaseItemDto,
  ImageType,
} from "@jellyfin/sdk/lib/generated-client/models";
import type { Api } from "@jellyfin/sdk";
import type { ItemsOpts } from "@/types";

const jellyhubClient = new Jellyfin({
  clientInfo: {
    name: "jellyhub-client",
    version: Bun.env.npm_package_version as string,
  },
  deviceInfo: {
    name: "jellyhub",
    id: "935496e7-847a-4376-a71c-7bdf2615d21d",
  },
});

export function getJellyfinApiClient(url: string, token?: string) {
  const instance = axios.create({ timeout: 6_000 });
  return jellyhubClient.createApi(url, token, instance);
}

export async function getJellyfinPublicInfo(api: Api) {
  const info = await getSystemApi(api).getPublicSystemInfo();

  return info.data;
}

export async function authJellyfinUser(
  api: Api,
  username: string,
  password: string,
) {
  try {
    const auth = await getUserApi(api).authenticateUserByName({
      authenticateUserByName: {
        Username: username,
        Pw: password,
      },
    });

    return auth.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      throw new Error("Invalid credentials");
    }

    throw new Error("Failed to authenticate user");
  }
}

export async function logoutJellyfinUser(api: Api) {
  try {
    await getSessionApi(api).reportSessionEnded();
  } catch {
    throw new Error("Failed to logout user");
  }
}

export async function checkJellyfinConn(api: Api) {
  try {
    const status = await getUserApi(api).getCurrentUser({ timeout: 2_000 });

    return status.status === 200;
  } catch {
    return false;
  }
}

export async function getLibraryItems(api: Api, opts: ItemsOpts) {
  const { types, parentId, artists, genres, person, studios, years } = opts;

  const typesToInclude: Array<BaseItemKind> = types.map((type) => {
    switch (type) {
      case "Movie":
        return BaseItemKind.Movie;
      case "Series":
        return BaseItemKind.Series;
      case "Season":
        return BaseItemKind.Season;
      case "MusicAlbum":
        return BaseItemKind.MusicAlbum;
      case "Audio":
        return BaseItemKind.Audio;
      case "Episode":
        return BaseItemKind.Episode;
    }
  });

  return await getItemsApi(api).getItems({
    recursive: true,
    includeItemTypes: typesToInclude,
    parentId,
    fields: [
      ItemFields.Overview,
      ItemFields.Overview,
      ItemFields.People,
      ItemFields.SeriesStudio,
      ItemFields.Studios,
      ItemFields.ProviderIds,
    ],
    artists,
    genres,
    person,
    studios,
    years,
  });
}

export function getItemImages(api: Api, item: BaseItemDto, type: ImageType) {
  const imageApi = getImageApi(api);

  const artistId =
    item.AlbumArtists && item.AlbumArtists.length > 0
      ? item.AlbumArtists[0].Id
      : undefined;

  const id =
    item.Type === BaseItemKind.MusicAlbum && type === "Backdrop"
      ? artistId
      : item.Id;

  const image = imageApi.getItemImageUrl({ Id: id }, type);

  return image ? image : "/default.svg";
}
