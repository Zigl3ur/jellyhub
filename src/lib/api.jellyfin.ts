import "@tanstack/react-start/server-only";

import { Jellyfin } from "@jellyfin/sdk";
import {
  getItemsApi,
  getLibraryApi,
  getUserApi,
} from "@jellyfin/sdk/lib/utils/api";
import { BaseItemKind } from "@jellyfin/sdk/lib/generated-client/models";
import { TicksToDuration } from "./utils";
import type { Api } from "@jellyfin/sdk";
import type {
  State,
  callersResponse,
  itemJellyfin,
  itemTypes,
  rawItemJellyfin,
} from "@/types/jellyfin-api.types";
import type { ServerStatus } from "@/types";

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
  return jellyhubClient.createApi(url, token);
}

export async function authJellyfinUser(
  api: Api,
  username: string,
  password: string,
) {
  return await getUserApi(api).authenticateUserByName({
    authenticateUserByName: {
      Username: username,
      Pw: password,
    },
  });
}

export async function checkJellyfinConn(api: Api) {
  const status = await getUserApi(api).getCurrentUser();

  return status.status === 200;
}

export async function getLibraryItems(
  api: Api,
  userId: string,
  itemsType: Array<itemTypes>,
) {
  const itemsToInclude: Array<BaseItemKind> = itemsType.map((item) => {
    switch (item) {
      case "Movie":
        return BaseItemKind.Movie;
      case "Series":
        return BaseItemKind.Series;
      case "MusicAlbum":
        return BaseItemKind.MusicAlbum;
    }
  });

  return await getItemsApi(api).getItems({
    userId,
    recursive: true,
    includeItemTypes: itemsToInclude,
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
