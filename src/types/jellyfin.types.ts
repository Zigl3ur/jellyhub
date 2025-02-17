export type tokenJellyfin = {
  server_url: string;
  serverId: string;
  token: string;
};

export type errorJellyfin = {
  server_url: string;
  error: string;
};

export type itemJellyfin = {
  server_url: string;
  item_id: string;
  item_name: string;
  item_type: string;
  item_image: string;
};

export type jellyfinServer = {
  address: string;
  username: string;
  status: boolean;
};
