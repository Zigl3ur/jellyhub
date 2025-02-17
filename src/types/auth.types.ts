export type payloadType = {
  username: string;
  admin: boolean;
  expires: Date;
};

export type loginActionType = { state: boolean; desc: string; href: string };
