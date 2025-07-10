import ItemDialog from "@/components/itemDialog";
import NoItemFound from "@/components/noItemFound";
import SearchBar from "@/components/searchBar";
import { getAllServerItems } from "@/server/actions/jellyfin.actions";
import { getUser } from "@/server/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JellyHub - Series",
};

export default async function AlbumsPage() {
  await getUser();

  const list = await getAllServerItems();

  const series = list.data?.series || [];

  return (
    <div className="flex flex-col">
      <div className="flex mb-4">
        <SearchBar placeholder="Search for Series" items={series} />
      </div>
      {series.length > 0 ? (
        <div className="flex flex-wrap gap-4 justify-center">
          {series.map((item) => (
            <ItemDialog key={item.item_name} item={item} />
          ))}
        </div>
      ) : (
        <NoItemFound />
      )}
    </div>
  );
}
