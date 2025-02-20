"use server";

import { getAllServerItems } from "@/lib/api.jellyfin";
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

  const serverList = itemsList.jellydata.map((server) => {
    return { address: server.server, token: server.token };
  });

  if (!serverList) return;

  const allItems = await getAllServerItems(serverList);

  return { serverCount: itemsList.jellydata.length, allItems };
}
