import ItemDialog from "@/components/itemDialog";
import NoItemFound from "@/components/noItemFound";
import SearchBar from "@/components/searchBar";
import { getAllServerItems } from "@/server/actions/jellyfin.actions";
import { getUser } from "@/server/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JellyHub - Movies",
};

export default async function AlbumsPage() {
  await getUser();

  const list = await getAllServerItems();

  const movies = list.data?.movies || [];

  return (
    <div className="flex flex-col">
      <div className="flex mb-4">
        <SearchBar
          placeholder="Search for Albums"
          items={list.data?.musicAlbum || []}
        />
      </div>
      {movies.length > 0 ? (
        <div className="flex flex-wrap gap-4 justify-center">
          {movies.map((item) => (
            <ItemDialog key={item.item_name} item={item} />
          ))}
        </div>
      ) : (
        <NoItemFound />
      )}
    </div>
  );
}
