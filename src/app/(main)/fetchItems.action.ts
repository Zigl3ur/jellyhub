"use server";

import { getAllServerItems } from "@/lib/api.jellyfin";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getAllItemsAction() {
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

  if (itemsList?.jellydata.length === 0) return;

  const serverList = itemsList?.jellydata.map((server) => {
    return { address: server.server, token: server.token };
  });

  if (!serverList) return;

  const allItems = await getAllServerItems(serverList);

  return { count: itemsList?.jellydata.length, allItems };
}
