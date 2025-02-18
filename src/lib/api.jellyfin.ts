import {
  errorJellyfin,
  tokenJellyfin,
  itemJellyfin,
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
        server_url: server_url,
        item_id: item.Id,
        item_name: item.Name,
        item_type: item.Type,
        item_image:
          item.ImageTags.Primary === undefined
            ? "/icon.png"
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
