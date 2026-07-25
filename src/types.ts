export type ServerStatus = "checking" | "up" | "down";

export type ItemTypes = "Movie" | "Series" | "MusicAlbum" | "Season" | "Audio";

export type ItemsOpts = {
  types: Array<ItemTypes>;
  parentId?: string;
  artists?: Array<string>;
  genres?: Array<string>;
  person?: string;
  studios?: Array<string>;
  years?: Array<number>;
};
