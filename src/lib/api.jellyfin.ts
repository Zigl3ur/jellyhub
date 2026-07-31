import "@tanstack/react-start/server-only";

import { Jellyfin } from "@jellyfin/sdk";
import {
  getItemsApi,
  getSessionApi,
  getUserApi,
} from "@jellyfin/sdk/lib/utils/api";
import {
  BaseItemKind,
  ItemFields,
} from "@jellyfin/sdk/lib/generated-client/models";
import axios, { AxiosError } from "axios";
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
  const instance = axios.create({ timeout: 5_000 });
  return jellyhubClient.createApi(url, token, instance);
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
      throw new Error("Invalid username or password");
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
    const status = await getUserApi(api).getCurrentUser({ timeout: 3000 });

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
    ],
    artists,
    genres,
    person,
    studios,
    years,
  });
}

// /**
//  * Function to get all items of a server (Movie, Series and MusicAlbum)
//  * @param server_url the server to query
//  * @param token the auth token
//  * @returns an error or an object with an array for each types
//  */
// export async function getAllItems(
//   server_url: string,
//   token: string,
// ): Promise<
//   callersResponse<{
//     movies: Array<itemJellyfin>;
//     series: Array<itemJellyfin>;
//     musicAlbum: Array<itemJellyfin>;
//   }>
// > {
//   try {
//     const items = await Promise.all([
//       getLibraryItems(server_url, token, "Movie"),
//       getLibraryItems(server_url, token, "Series"),
//       getLibraryItems(server_url, token, "MusicAlbum"),
//     ]);

//     if (items[0].success && items[1].success && items[2].success) {
//       return {
//         success: true,
//         data: {
//           // data will always be defined since success is true
//           movies: items[0].data as Array<itemJellyfin>,
//           series: items[1].data as Array<itemJellyfin>,
//           musicAlbum: items[2].data as Array<itemJellyfin>,
//         },
//       };
//     }
//     return {
//       success: false,
//       error: `Failed to retrieves items from ${server_url}`,
//     };
//   } catch {
//     return {
//       success: false,
//       error: "Failed to reach server",
//     };
//   }
// }

function BuildImageUrl(serverUrl: string, itemId: string, imageTag?: string) {
  return imageTag
    ? `${serverUrl}/Items/${itemId}/Images/Primary?tag=${imageTag}`
    : "/default.svg";
}
