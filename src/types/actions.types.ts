import type { State } from "./jellyfin-api.types";
import type { auth } from "@/lib/auth";
import type { Jellydata } from "@/generated/prisma";

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
