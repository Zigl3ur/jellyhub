import ContentPage from "@/components/contentPage";
import { getAllServersSeries } from "@/server/actions/jellyfin.actions";
import { getUser } from "@/server/utils";

export default async function AlbumsPage() {
  await getUser();

  const list = await getAllServersSeries();

  const series = list.data || [];

  return <ContentPage placeholder="Search for Series" data={series} />;
}
