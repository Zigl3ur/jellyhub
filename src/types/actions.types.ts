import { Jellydata } from "@/generated/prisma";
import { State } from "./jellyfin-api.types";
import { auth } from "@/lib/auth";

export type ServerActionReturn<T = null> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
};

export type jellydataDisplayed = Pick<
  Jellydata,
  "serverUrl" | "serverUsername"
> & { status?: State };

export type userDataType = Awaited<ReturnType<typeof auth.api.listUsers>>;
