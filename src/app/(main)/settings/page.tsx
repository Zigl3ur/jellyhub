import ResetPasswd from "@/components/settings/resetPasswd";
import { ServerTable, columns } from "@/components/settings/serverTable";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jellyfinServer } from "@/types/jellyfin-api.types";
import { Metadata } from "next";
import CreateUser from "@/components/settings/createUser";

export const metadata: Metadata = {
  title: "JellyHub - Settings",
};

/**
 *  get the list of the jellyfin servers of the logged user.
 * @returns jellyfin server list of the account or nothing if not authenticated
 */
async function getJellyfinServer(): Promise<void | jellyfinServer[]> {
  const auth = await getSession();

  if (!auth) return;

  const serverList = await prisma.accounts.findMany({
    where: {
      username: auth.username as string,
    },
    select: { jellydata: true },
  });

  const returnList: jellyfinServer[] = [];

  serverList[0].jellydata.forEach(
    (server: { server: string; username: string; token: string }) => {
      returnList.push({
        address: server.server,
        username: server.username,
        token: server.token,
        status: "Checking",
      });
    }
  );

  return returnList;
}

/**
 * get the list of user's username
 * @returns the list of the user username
 */
async function getUserList(): Promise<void | { username: string }[]> {
  const auth = await getSession();

  if (!auth) return;

  if (!auth.admin) return;

  const list = await prisma.accounts.findMany({
    select: { username: true },
  });

  return list;
}

export default async function SettingsPage() {
  const data = await getJellyfinServer();
  const isAdmin = (await getSession())?.admin as boolean;
  const userList = (await getUserList()) ?? [];

  return (
    <div className="flex flex-1 flex-col gap-4 pt-0">
      <ServerTable columns={columns} baseData={data as jellyfinServer[]} />
      <div className="flex flex-col lg:flex-row gap-2">
        <ResetPasswd isAdmin={isAdmin} userList={userList} />
        {isAdmin && <CreateUser />}
      </div>
    </div>
  );
}
