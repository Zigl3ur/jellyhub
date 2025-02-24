import ItemCard from "@/components/itemCard";
import { checkConn, getAllServerItems } from "@/lib/api.jellyfin";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { itemJellyfin } from "@/types/jellyfin.types";
import { notFound } from "next/navigation";

async function getItemsListAction(
  type: "Movie" | "Series" | "MusicAlbum"
): Promise<void | {
  serverCount: number;
  allItems: itemJellyfin[];
}> {
  "use server";
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

  const allItems = (await getAllServerItems(
    filteredServers,
    type
  )) as itemJellyfin[];

  return { serverCount: filteredServers.length, allItems };
}

const allowedSlug = ["Movie", "Series", "MusicAlbum"];

// issue with slug, layout show sidebar when slug is 404
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  if (!allowedSlug.includes(slug)) return notFound();

  const data = await getItemsListAction(
    slug as "Movie" | "Series" | "MusicAlbum"
  );

  return (
    <div className="flex justify-center flex-wrap gap-4">
      {data ? (
        data.allItems.map((item) => (
          <ItemCard
            reduced={slug === "MusicAlbum" && true}
            item={item}
            serverCount={item.server_url.length}
            key={item.item_name}
          />
        ))
      ) : (
        <p>aaa</p>
      )}
    </div>
  );
}
