"use server";

import {
  itemJellyfin,
  callersResponse,
  tokenData,
  rawItemJellyfin,
  itemTypes,
  State,
} from "@/types/jellyfin-api.types";
import { TicksToDuration } from "./utils";

/**
 * Function to get the auth token from a jellyfin server
 * @param server_url the server to query
 * @param username the account username to login
 * @param password the account password to login
 * @returns an error or the object with associated data
 */
export async function getToken(
  server_url: string,
  username: string,
  password: string
): Promise<callersResponse<tokenData>> {
  try {
    const response = await fetch(`${server_url}/Users/AuthenticateByName`, {
      method: "POST",
      body: JSON.stringify({
        Username: username,
        Pw: password,
      }),
      headers: {
        "Content-type": "application/json",
        "X-Emby-Authorization":
          'MediaBrowser Client="jellyhub", Device="client", DeviceId="d3101fc0-291b-41a5-89b1-59136286c2d0", Version="1.0.0"',
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      return {
        success: true,
        data: {
          server_url: server_url,
          server_id: data.ServerId,
          server_username: data.User.Name,
          token: data.AccessToken,
        },
      };
    } else if (response.status === 401) {
      return {
        success: false,
        error: "Authentication failed, check your credentials",
      };
    } else {
      return {
        success: false,
        error: "An Error Occured, check the URL / credentials",
      };
    }
  } catch {
    return {
      success: false,
      error: "An Error Occured, check the URL",
    };
  }
}

/**
 * Function to check if the given token is still valid
 * @param server_url the server to query
 * @param token token to check
 * @returns "Up" if token is still valid or "Down" if response is not 200
 */
export async function checkConn(
  server_url: string,
  token: string
): Promise<callersResponse<State>> {
  try {
    const response = await fetch(`${server_url}/Users/Me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Emby-Authorization": `MediaBrowser Token=${token}`,
      },
    });
    return response.status === 200
      ? { success: true, data: "Up" }
      : { success: false, data: "Down" };
  } catch {
    return {
      success: false,
      data: "Down",
    };
  }
}

/**
 * Function to get specific items types (Movie, Series, MusicAlbum) from a server
 * @param server_url the server to query
 * @param token the auth token
 * @param itemsType the type of items to retrive (Movie, Series, MusicAlbum)
 * @returns an error or an array of the items
 */
export async function getLibraryItems(
  server_url: string,
  token: string,
  itemsType: itemTypes
): Promise<callersResponse<Array<itemJellyfin>>> {
  try {
    const response = await fetch(
      `${server_url}/Items?IncludeItemTypes=${itemsType}&Recursive=true`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "X-Emby-Authorization": `MediaBrowser Token=${token}`,
        },
      }
    );

    if (response.status === 200) {
      const data = await response.json();

      const listItems: Array<itemJellyfin> = data.Items.map(
        (item: rawItemJellyfin) => {
          return {
            item_location: [
              {
                server_url: server_url,
                server_id: item.ServerId,
                item_id: item.Id,
              },
            ],
            item_name: item.Name,
            item_type: item.Type,
            item_duration: TicksToDuration(item.RunTimeTicks),
            item_premier_date: item.ProductionYear,
            item_artist: item.AlbumArtist ?? "None",
            item_image:
              item.ImageTags.Primary === undefined
                ? "/default.svg"
                : `${server_url}/Items/${item.Id}/Images/Primary?tag=${item.ImageTags.Primary}`,
          };
        }
      );

      return { success: true, data: listItems };
    } else if (response.status === 401) {
      return {
        success: false,
        error: "Token is invalid",
      };
    }
    return {
      success: false,
      error: "An unknown error occured",
    };
  } catch {
    return {
      success: false,
      error: "Failed to reach server",
    };
  }
}

/**
 * Function to get all items of a server (Movie, Series and MusicAlbum)
 * @param server_url the server to query
 * @param token the auth token
 * @returns an error or an object with an array for each types
 */
export async function getAllItems(
  server_url: string,
  token: string
): Promise<
  callersResponse<{
    movies: Array<itemJellyfin>;
    series: Array<itemJellyfin>;
    musicAlbum: Array<itemJellyfin>;
  }>
> {
  try {
    const items = await Promise.all([
      getLibraryItems(server_url, token, "Movie"),
      getLibraryItems(server_url, token, "Series"),
      getLibraryItems(server_url, token, "MusicAlbum"),
    ]);

    if (items[0].success && items[1].success && items[2].success) {
      return {
        success: true,
        data: {
          // data will always be defined since success is true
          movies: items[0].data as Array<itemJellyfin>,
          series: items[1].data as Array<itemJellyfin>,
          musicAlbum: items[2].data as Array<itemJellyfin>,
        },
      };
    }
    return {
      success: false,
      error: `Failed to retrieves items from ${server_url}`,
    };
  } catch {
    return {
      success: false,
      error: "Failed to reach server",
    };
  }
}
