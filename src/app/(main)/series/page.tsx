import ContentPage from "@/components/contentPage";
import { getAllServersSeries } from "@/server/actions/jellyfin.actions";
import { getUser } from "@/server/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JellyHub - Series",
};

export default async function AlbumsPage() {
  await getUser();

  const list = await getAllServersSeries();

  const series = list.data || [];

  return <ContentPage placeholder="Search for Series" data={series} />;
}
