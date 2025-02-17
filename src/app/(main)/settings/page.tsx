import { ServerTable, columns } from "@/components/serverTable";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { jellyfinServer } from "@/types/jellyfin.types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JellyHub - Settings",
};

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
      status: true,
    });
  });

  return returnList;
}

export default async function SettingsPage() {
  const data = await jellyfinServerListAction();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <ServerTable columns={columns} data={data as jellyfinServer[]} />
    </div>
  );
}
