import ItemDialog from "@/components/global/itemDialog";
import NotFound from "@/components/global/notFound";
import SearchBar from "@/components/searchBar";
import { checkConn, getAllServerItems } from "@/lib/api.jellyfin";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/server/utils";
import { itemJellyfin } from "@/types/jellyfin.types";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return {
    title: `JellyHub - ${(await params).slug}`,
  };
}

async function getItemsList(
  type: "Movie" | "Series" | "MusicAlbum"
): Promise<void | {
  serverCount: number;
  allItems: itemJellyfin[];
}> {
  "use server";
  const session = await getUser();

  if (!session) return;

  const itemsList = await prisma.account.findFirst({
    where: {
      username: session.username as string,
    },
    select: {
      jellydata: true,
    },
  });

  if (!itemsList) return;

  const serverList = await Promise.all(
    itemsList.jellydata.map(
      async (server: { server: string; token: string }) => {
        const status = await checkConn(server.server, server.token);
        if (status === "Up")
          return { address: server.server, token: server.token };
      }
    )
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

  const data = await getItemsList(slug as "Movie" | "Series" | "MusicAlbum");

  return (
    <div className="flex flex-col">
      <div className="flex mb-4">
        <SearchBar
          type={slug as "Movie" | "Series" | "MusicAlbum"}
          items={data?.allItems || []}
        />
      </div>
      {data && data.allItems.length > 0 ? (
        <div className="flex flex-wrap gap-4 justify-center">
          {data.allItems.map((item) => (
            <ItemDialog
              reduced={slug === "MusicAlbum"}
              type="card"
              item={item}
              key={item.item_name}
            />
          ))}
        </div>
      ) : (
        <NotFound />
      )}
    </div>
  );
}
