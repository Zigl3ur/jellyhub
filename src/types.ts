import type { getJellyData } from "./functions/server.functions";

export type ServerStatus = "checking" | "up" | "down";

export type ItemTypes =
  "Movie" | "Series" | "MusicAlbum" | "Season" | "Audio" | "Episode";

export type ItemsOpts = {
  types: Array<ItemTypes>;
  parentId?: string;
  artists?: Array<string>;
  genres?: Array<string>;
  person?: string;
  studios?: Array<string>;
  years?: Array<number>;
};

export type JellyfinServer = Awaited<
  ReturnType<typeof getJellyData>
>["servers"][number];

export type ItemServerData = {
  itemId: string;
  id: string;
  url: string;
  name: string;
};
