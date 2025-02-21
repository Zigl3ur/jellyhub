"use server";

import { checkConn, getAllServerItems } from "@/lib/api.jellyfin";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AllItemsType } from "@/types/jellyfin.types";

export async function getAllItemsAction(): Promise<void | {
  serverCount: number;
  allItems: AllItemsType;
}> {
  const session = await getSession();

  if (!session) return;

  const itemsList = await prisma.accounts.findFirst({
    where: {
      username: session.username as string,
    },
    select: {
      jellydata: true,
    },
  });

  if (!itemsList) return;

  const serverList = await Promise.all(
    itemsList.jellydata.map(async (server) => {
      const status = await checkConn(server.server, server.token);
      if (status === "Up")
        return { address: server.server, token: server.token };
    })
  );

  const filteredServers = serverList.filter((server) => server !== undefined);

  const allItems = await getAllServerItems(filteredServers);

  return { serverCount: filteredServers.length, allItems };
}
