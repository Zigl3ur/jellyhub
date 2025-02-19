import {
  errorJellyfin,
  tokenJellyfin,
  itemJellyfin,
  jellyfinServer,
} from "@/types/jellyfin.types";

export async function getToken(
  server_url: string,
  username: string,
  password: string
): Promise<tokenJellyfin | errorJellyfin> {
  const response = await fetch(`${server_url}/Users/AuthenticateByName`, {
    // set timeout / race to wait less when server not reachable
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
    };
  } else if (response.status === 401) {
    return {
      server_url: server_url,
      error: "Authentication failed, check your credentials",
    };
  } else {
    return {
      server_url: server_url,
      error: "An Error Occured, check your URL / credentials",
    };
  }
}

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

export async function getLibraryItems(
  server_url: string,
  token: string,
  itemsType: string
): Promise<itemJellyfin[] | errorJellyfin> {
  const response: Response = await fetch(
    `${server_url}/Items?IncludeItemTypes=${itemsType}&Recursive=true`, // item types => { Movie, Series, MusicAlbum}
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

    const listItems: itemJellyfin[] = [];

    data.Items.forEach((item) => {
      listItems.push({
        server_url: [server_url],
        item_id: item.Id,
        item_name: item.Name,
        item_type: item.Type,
        item_image:
          item.ImageTags.Primary === undefined
            ? "/default.png"
            : `${server_url}/Items/${item.Id}/Images/Primary?tag=${item.ImageTags.Primary}`,
      });
    });

    return listItems;
  } else if (response.status === 401) {
    return {
      server_url: server_url,
      error: "Token is invalid",
    };
  }
  return {
    server_url: server_url,
    error: "An Error Occured",
  };
}

async function getAllItems(
  server_url: string,
  token: string
): Promise<{
  movies: errorJellyfin | itemJellyfin[];
  shows: errorJellyfin | itemJellyfin[];
  musicAlbum: errorJellyfin | itemJellyfin[];
}> {
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

export async function getAllServerItems(
  serverList: Omit<Omit<jellyfinServer, "status">, "username">[]
) {
  const listAll = await Promise.all(
    serverList.map(async (server) => {
      return await getAllItems(server.address, server.token);
    })
  );

  const returnList = {
    movies: listAll.reduce((acc, server) => {
      if (!Array.isArray(server.movies)) return acc;
      server.movies.forEach((movie) => {
        const existing = acc.find((item) => item.item_id === movie.item_id);
        if (existing) {
          existing.server_url.push(movie.server_url[0]);
        } else {
          acc.push(movie);
        }
      });
      return acc;
    }, [] as itemJellyfin[]),

    shows: listAll.reduce((acc, server) => {
      if (!Array.isArray(server.shows)) return acc;
      server.shows.forEach((show) => {
        const existing = acc.find((item) => item.item_id === show.item_id);
        if (existing) {
          existing.server_url.push(show.server_url[0]);
        } else {
          acc.push(show);
        }
      });
      return acc;
    }, [] as itemJellyfin[]),

    musicAlbum: listAll.reduce((acc, server) => {
      if (!Array.isArray(server.musicAlbum)) return acc;
      server.musicAlbum.forEach((album) => {
        const existing = acc.find((item) => item.item_id === album.item_id);
        if (existing) {
          existing.server_url.push(album.server_url[0]);
        } else {
          acc.push(album);
        }
      });
      return acc;
    }, [] as itemJellyfin[]),
  };

  return returnList;
}
