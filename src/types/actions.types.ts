import { jellydata } from "@prisma/client";
import { State } from "./jellyfin-api.types";

export type ServerActionReturn<T = null> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
};

export type jellydataDisplayed = Pick<
  jellydata,
  "serverUrl" | "serverUsername"
> & { status?: State };
