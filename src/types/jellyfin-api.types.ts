/**
 * the return type of jellyfin api callers
 * @params Take a type as arg for the data returned
 */
export type callersResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

/** type of an item fetched from a jellyfin server */
export type itemTypes = "Movie" | "Series" | "MusicAlbum";

/** type of the connection state to a jellyfin server */
export type State = "Up" | "Down" | "Checking";

/** type of the data returned after authenticated at the jellyfin server */
export type tokenData = {
  server_url: string;
  server_id: string;
  server_username: string;
  token: string;
};

/** type of jellyfin item fetched from the api (only properties i keep) */
export type rawItemJellyfin = {
  ServerId: string;
  Name: string;
  Type: string;
  Id: string;
  RunTimeTicks: number;
  ProductionYear: number;
  OfficialRating?: string;
  AlbumArtist?: string;
  ImageTags: { Primary?: string };
};

/** type of a jellyfin item retrieved and filtered from the api */
export type itemJellyfin = {
  item_location: Array<{
    server_url: string;
    server_id: string;
    item_id: string;
  }>;
  item_name: string;
  item_type: string;
  item_duration: string;
  item_premier_date: number;
  item_rating?: string;
  item_artist?: string;
  item_image: string;
};
