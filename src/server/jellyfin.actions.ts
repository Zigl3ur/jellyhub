"use server";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";
import { prisma } from "../lib/prisma";
import { getAllItems, getToken } from "../lib/api.jellyfin";
import { getUser } from "./utils";
import { decryptToken, encryptToken } from "@/lib/utils";
import { itemJellyfin } from "@/types/jellyfin-api.types";

type ServerActionReturn<T = null> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
};

/**
 * Server action to add a jellyfin server of the logged user.
 * @returns jellyfin server list of the account or nothing if not authenticated
 */
export async function AddServerAction(
  server_url: string,
  username: string,
  password: string
): Promise<ServerActionReturn> {
  const user = await getUser();

  const token = await getToken(server_url, username, password);

  if (!token.success || !token.data) {
    return {
      success: false,
      error: token.error || "An Error Occured, check the URL / credentials",
    };
  }

  try {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        jellydata: {
          create: {
            serverUrl: token.data.server_url,
            serverToken: encryptToken(token.data.token),
          },
        },
      },
    });

    revalidatePath("/settings");
    return { success: true, message: "Successfully added jellyfin server !" };
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError)
      return {
        success: false,
        error: err.code === "P2002" ? "Server already registered" : err.message,
      };
    else if (err instanceof Error)
      return {
        success: false,
        error: err.message,
      };
    return {
      success: false,
      error: "An Unknow Error Occured",
    };
  }
}

/**
 * Server action to delete one or more jellyfin servers of the logged user.
 * @returns jellyfin server list of the account or nothing if not authenticated
 */
export async function DeleteServerAction(
  servers: Array<string>
): Promise<ServerActionReturn> {
  const user = await getUser();

  try {
    await prisma.jellydata.deleteMany({
      where: {
        AND: {
          userId: user.id,
          serverUrl: {
            in: servers,
          },
        },
      },
    });
    revalidatePath("/settings");
    return {
      success: true,
      message: `Succesfully delteted server${servers.length > 1 && "s"}`,
    };
  } catch (err) {
    if (err instanceof Error)
      return {
        success: false,
        error: err.message,
      };
    return {
      success: false,
      error: "An Unknow Error Occured",
    };
  }
}

export async function getAllServerItems(): Promise<
  ServerActionReturn<{
    movies: Array<itemJellyfin>;
    series: Array<itemJellyfin>;
    musicAlbum: Array<itemJellyfin>;
  }>
> {
  const user = await getUser();

  const list = await prisma.jellydata.findMany({
    where: { userId: user.id },
  });

  const items = await Promise.all(
    list.map(async (jellydata) => {
      return await getAllItems(
        jellydata.serverUrl,
        decryptToken(jellydata.serverToken)
      );
    })
  );

  return {
    success: true,
    data: undefined,
  };
}
