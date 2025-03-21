import {
  tokenJellyfin,
  itemJellyfin,
  jellyfinServer,
  AllItemsType,
  ItemList,
} from "@/types/jellyfin.types";

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
): Promise<tokenJellyfin> {
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
          'MediaBrowser Client="jellyhub", Device="client", DeviceId="id87990ughfi", Version="1.0.0"',
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      return {
        server_url: server_url,
        serverId: data.ServerId,
        accountId: data.Id,
        token: data.AccessToken,
        error: null,
      };
    } else if (response.status === 401) {
      return {
        server_url: server_url,
        error: "Authentication failed, check your credentials",
      };
    } else {
      return {
        server_url: server_url,
        error: "An Error Occured, check the URL / credentials",
      };
    }
  } catch {
    return {
      server_url: server_url,
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
): Promise<"Up" | "Down"> {
  try {
    const response = await fetch(`${server_url}/Users/Me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Emby-Authorization": `MediaBrowser Token=${token}`,
      },
    });
    return response.status === 200 ? "Up" : "Down";
  } catch {
    return "Down";
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
  itemsType: string
): Promise<ItemList> {
  const response: Response = await fetch(
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

    const listItems: ItemList = Object.assign([], {
      error: null,
    });

    data.Items.forEach(
      (item: {
        ServerId: string;
        Name: string;
        Type: string;
        Id: string;
        RunTimeTicks: number;
        ProductionYear: number;
        OfficialRating?: string;
        AlbumArtist?: string;
        ImageTags: { Primary?: string };
      }) => {
        listItems.push({
          server_data: [[server_url], [item.ServerId], [item.Id]],
          item_name: item.Name,
          item_type: item.Type,
          item_duration: TicksToDuration(item.RunTimeTicks),
          item_premier_date: item.ProductionYear,
          item_rating: item.OfficialRating ?? "None",
          item_artist: item.AlbumArtist ?? "None",
          item_image:
            item.ImageTags.Primary === undefined
              ? "/default.svg"
              : `${server_url}/Items/${item.Id}/Images/Primary?tag=${item.ImageTags.Primary}`,
        });
      }
    );

    return listItems;
  } else if (response.status === 401) {
    return Object.assign([], {
      error: "Token is Invalid",
    });
  }
  return Object.assign([], {
    error: "An Error Occured",
  });
}

/**
 * Function to get all items of a server (Movie, Series and MusicAlbum)
 * @param server_url the server to query
 * @param token the auth token
 * @returns an error or an object with an array for each types
 */
async function getAllItems(
  server_url: string,
  token: string
): Promise<AllItemsType> {
  const [movies, shows, musicAlbums] = await Promise.all([
    getLibraryItems(server_url, token, "Movie"),
    getLibraryItems(server_url, token, "Series"),
    getLibraryItems(server_url, token, "MusicAlbum"),
  ]);

  const list = {
    movies: movies,
    shows: shows,
    musicAlbum: musicAlbums,
  };

  return list;
}

/**
 * Function to remove duplicate item on the given list and add server url of the deleted one to the original one
 * @param list list of item to remove duplicate and add server url to original one item
 * @returns the list with no more duplicate
 */
function reduceArray(list: itemJellyfin[]): itemJellyfin[] {
  const uniqueList = list.reduce(
    (acc: itemJellyfin[], current: itemJellyfin) => {
      const existingItem = acc.find(
        (item) => item.item_name === current.item_name
      );
      if (existingItem) {
        existingItem.server_data[0] = [
          ...existingItem.server_data[0],
          ...current.server_data[0],
        ];
        existingItem.server_data[1] = [
          ...existingItem.server_data[1],
          ...current.server_data[1],
        ];
        existingItem.server_data[2] = [
          ...existingItem.server_data[2],
          ...current.server_data[2],
        ];
        return acc;
      }
      return [...acc, current];
    },
    []
  );
  return uniqueList;
}

/**
 * Function to remove duplicate items throught different items from servers
 * @param list list of items from different server
 * @returns all items ordered by category with no duplicate
 */
function filterDuplicateItems(list: AllItemsType[]): AllItemsType {
  const allMovies = list.flatMap((server) => server.movies as itemJellyfin[]);
  const allShows = list.flatMap((server) => server.shows as itemJellyfin[]);
  const allMusic = list.flatMap(
    (server) => server.musicAlbum as itemJellyfin[]
  );

  const filteredList: AllItemsType = {
    movies: reduceArray(allMovies),
    shows: reduceArray(allShows),
    musicAlbum: reduceArray(allMusic),
  };

  return filteredList;
}

/**
 *  Function to get all items (or specified type) from given servers
 * @param serverList the list of the servers to get items from
 * @returns an object with 3 arrays of all type (Movie, Series, MusicAlbum)
 */
export async function getAllServerItems(
  serverList: Array<Omit<Omit<jellyfinServer, "status">, "username">>,
  type?: "Movie" | "Series" | "MusicAlbum"
) {
  if (type) {
    const listAll = await Promise.all(
      serverList.map(async (server) => {
        return await getLibraryItems(server.address, server.token, type);
      })
    );

    return reduceArray(listAll.flatMap((item) => item as itemJellyfin[]));
  }
  const listAll = await Promise.all(
    serverList.map(async (server) => {
      return await getAllItems(server.address, server.token);
    })
  );

  return filterDuplicateItems(listAll);
}

/**
 * Function to get ticks to readable duration
 * @param ticks ticks to convert
 * @returns date from the given ticks
 */
export function TicksToDuration(ticks: number): string {
  const ticksPerSecond = 10000000;
  const seconds = ticks / ticksPerSecond;

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}
