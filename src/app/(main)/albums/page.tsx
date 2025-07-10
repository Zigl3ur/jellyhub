import ItemCard from "@/components/itemCard";
import ItemDialog from "@/components/itemDialog";
import NoItemFound from "@/components/noItemFound";
import SearchBar from "@/components/searchBar";
import { getAllServerItems } from "@/server/actions/jellyfin.actions";
import { getUser } from "@/server/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JellyHub - Albums",
};

export default async function AlbumsPage() {
  await getUser();

  const list = await getAllServerItems();

  const albums = list.data?.musicAlbum || [];

  return (
    <div className="flex flex-col">
      <div className="flex mb-4">
        <SearchBar placeholder="Search for Albums" items={albums} />
      </div>
      {albums.length > 0 ? (
        <div className="flex flex-wrap gap-4 justify-center">
          {albums.map((item) => (
            <ItemCard key={item.item_name} item={item} />
          ))}
        </div>
      ) : (
        <NoItemFound />
      )}
    </div>
  );
}
