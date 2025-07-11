import ContentPage from "@/components/contentPage";
import { getAllServersMovies } from "@/server/actions/jellyfin.actions";
import { getUser } from "@/server/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JellyHub - Movies",
};

export default async function AlbumsPage() {
  await getUser();

  const list = await getAllServersMovies();

  const movies = list.data || [];

  return <ContentPage placeholder="Search for Movies" data={movies} />;
}
