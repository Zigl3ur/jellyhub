import { ServerTable, columns } from "@/components/serverTable";
import { getToken } from "@/lib/api.jellyfin";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  jellyfinServer,
  jellyfinServerCredentials,
} from "@/types/jellyfin.types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JellyHub - Settings",
};

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
      status: Math.random() ? true : false,
    });
  });

  return returnList;
}

/**
 *  Server action to add a jellyfin servers of the logged user.
 * @returns jellyfin server list of the account or nothing if not authenticated
 */
async function jellyfinServerAddAction(
  data: jellyfinServerCredentials
): Promise<boolean> {
  "use server";
  const auth = await getSession();

  if (!auth) return false;

  const creds = await getToken(data.address, data.username, data.password);

  if ("error" in creds) return false;

  await prisma.accounts.update({
    where: {
      username: auth.username as string,
    },
    data: {
      jellydata: {
        create: {
          username: data.username,
          server: data.address,
          token: creds.token,
        },
      },
    },
  });

  return true;
}

/**
 *  Server action to delete one or more jellyfin servers of the logged user.
 * @returns jellyfin server list of the account or nothing if not authenticated
 */
async function jellyfinServerDeleteAction(): Promise<boolean> {
  "use server";
  const auth = await getSession();

  if (!auth) return false;
}

export default async function SettingsPage() {
  const data = await jellyfinServerListAction();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <ServerTable
        columns={columns}
        data={data as jellyfinServer[]}
        addAction={jellyfinServerAddAction}
        deleteAction={jellyfinServerDeleteAction}
      />
    </div>
  );
}
