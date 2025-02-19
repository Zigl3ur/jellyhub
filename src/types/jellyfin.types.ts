export type tokenJellyfin = {
  server_url: string;
  serverId: string;
  accountId: string;
  token: string;
};

export type errorJellyfin = {
  server_url: string;
  error: string;
};

export type itemJellyfin = {
  server_url: string[];
  item_name: string;
  item_type: string;
  item_image: string;
};

export type jellyfinServer = {
  address: string;
  username: string;
  token: string;
  status: "Checking" | "Up" | "Down";
};

export type jellyfinServerCredentials = {
  address: string;
  username: string;
  password: string;
};

type Stats = {
  title: string;
  count: number;
  icon: React.ReactNode;
};

export type jellyfinStats = {
  isLoading: boolean;
  globalStats: Stats[];
};

export type AllItemsType = {
  movies: errorJellyfin | itemJellyfin[];
  shows: errorJellyfin | itemJellyfin[];
  musicAlbum: errorJellyfin | itemJellyfin[];
};
