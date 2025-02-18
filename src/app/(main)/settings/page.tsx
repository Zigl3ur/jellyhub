import { ServerTable, columns } from "@/components/serverTable";
import { getToken } from "@/lib/api.jellyfin";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  errorJellyfin,
  jellyfinServer,
  jellyfinServerCredentials,
} from "@/types/jellyfin.types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Metadata } from "next";
import { revalidatePath } from "next/cache";

export const metadata: Metadata = {
  title: "JellyHub - Settings",
};

async function refreshData() {
  "use server";
  revalidatePath("/settings");
}

/**
 *  Server action to get the list of the jellyfin servers of the logged user.
 * @returns jellyfin server list of the account or nothing if not authenticated
 */
async function jellyfinServerListAction(): Promise<void | jellyfinServer[]> {
  "use server";
  const auth = await getSession();

  if (!auth) return;

  const serverList = await prisma.accounts.findMany({
    where: {
      username: auth.username as string,
    },
    select: { jellydata: true },
  });

  const returnList: jellyfinServer[] = [];

  serverList[0].jellydata.forEach((server) => {
    returnList.push({
      address: server.server,
      username: server.username,
      token: server.token,
      status: "Checking",
    });
  });

  return returnList;
}

/**
 *  Server action to add a jellyfin server of the logged user.
 * @returns jellyfin server list of the account or nothing if not authenticated
 */
async function jellyfinServerAddAction(
  data: jellyfinServerCredentials
): Promise<errorJellyfin | boolean> {
  "use server";
  const auth = await getSession();

  if (!auth) return false;

  const creds = await getToken(data.address, data.username, data.password);

  if ("error" in creds) {
    return creds;
  }

  try {
    await prisma.accounts.update({
      where: {
        username: auth.username as string,
      },
      data: {
        jellydata: {
          create: {
            username: data.username,
            server: creds.server_url,
            token: creds.token,
          },
        },
      },
    });

    await refreshData();
    return true;
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError)
      return {
        server_url: data.address,
        error: err.code === "P2002" ? "Server already registered" : err.message,
      };
    else if (err instanceof Error)
      return {
        server_url: data.address,
        error: err.message,
      };
    return {
      server_url: data.address,
      error: "An Unknow Error Occured",
    };
  }
}

/**
 *  Server action to delete one or more jellyfin servers of the logged user.
 * @returns jellyfin server list of the account or nothing if not authenticated
 */
async function jellyfinServerDeleteAction(
  data: {
    address: string;
    username: string;
  }[]
): Promise<errorJellyfin | boolean> {
  "use server";
  const auth = await getSession();

  if (!auth) return false;

  try {
    await prisma.accounts.update({
      where: {
        username: auth.username as string,
      },
      data: {
        jellydata: {
          deleteMany: {
            OR: data.map((server) => ({
              AND: {
                server: server.address,
                username: server.username,
              },
            })),
          },
        },
      },
    });
    await refreshData();
    return true;
  } catch (err) {
    if (err instanceof Error)
      return {
        server_url: "none",
        error: err.message,
      };
    return {
      server_url: "none",
      error: "An Unknow Error Occured",
    };
  }
}

export default async function SettingsPage() {
  const data = await jellyfinServerListAction();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <ServerTable
        columns={columns}
        baseData={data as jellyfinServer[]}
        addAction={jellyfinServerAddAction}
        deleteAction={jellyfinServerDeleteAction}
      />
    </div>
  );
}
