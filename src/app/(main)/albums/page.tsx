import ContentPage from "@/components/contentPage";
import { getAllServersAlbums } from "@/server/actions/jellyfin.actions";
import { getUser } from "@/server/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Albums",
};

export default async function AlbumsPage() {
  await getUser();

  const list = await getAllServersAlbums();

  const albums = list.data || [];

  return <ContentPage placeholder="Search for Albums" data={albums} />;
}
