export type tokenJellyfin = {
  server_url: string;
  serverId?: string;
  accountId?: string;
  token?: string;
  error: string | null;
};

export type itemJellyfin = {
  // item and server id to redirect to correct link on server
  server_url: string[];
  item_name: string;
  item_type: string;
  item_duration: string;
  item_premier_date: number;
  item_rating?: string;
  item_artist?: string;
  item_image: string;
};

export type jellyfinServer = {
  address: string;
  username: string;
  token: string;
  status: "Checking" | "Up" | "Down";
};

export type jellyfinServerCredentials = Omit<
  Omit<jellyfinServer, "token">,
  "status"
> & { password: string };

export type ItemList = itemJellyfin[] & { error: string | null };

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
  movies: itemJellyfin[];
  shows: itemJellyfin[];
  musicAlbum: itemJellyfin[];
};
