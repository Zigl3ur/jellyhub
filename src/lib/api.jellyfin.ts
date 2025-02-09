import {
  errorJellyfin,
  tokenJellyfin,
  itemJellyfin,
} from "@/types/api.jellyfin";

export async function getToken(
  server_url: string,
  username: string,
  password: string
): Promise<tokenJellyfin | errorJellyfin> {
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
      token: data.AccessToken,
    };
  } else if (response.status === 401) {
    return {
      server_url: server_url,
      error: "Authentication failed",
    };
  }
  return {
    server_url: server_url,
    error: "An Error Occured",
  };
}

export async function getLibraryItems(
  server_url: string,
  token: string,
  itemsType: string
): Promise<itemJellyfin[] | errorJellyfin> {
  const response = await fetch(
    `${server_url}/Items?IncludeItemTypes=${itemsType}&Recursive=true`, // item types => { Movie, Series, MusicAlbum}
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `MediaBrowser Token=${token}`,
      },
    }
  );

  if (response.status === 200) {
    const data = await response.json();

    const listItems: itemJellyfin[] = [];

    data.Items.forEach((item: any) => {
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
