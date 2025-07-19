import ContentPage from "@/components/content-page";
import { getAllServersAlbums } from "@/server/actions/jellyfin.actions";
import { getUser } from "@/server/utils";

export default async function AlbumsPage() {
  await getUser();

  const list = await getAllServersAlbums();

  const albums = list.data || [];

  return <ContentPage placeholder="Search for Albums" data={albums} />;
}
