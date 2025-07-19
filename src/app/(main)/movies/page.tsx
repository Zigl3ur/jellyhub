import ContentPage from "@/components/content-page";
import { getAllServersMovies } from "@/server/actions/jellyfin.actions";
import { getUser } from "@/server/utils";

export default async function MoviesPages() {
  await getUser();

  const list = await getAllServersMovies();

  const movies = list.data || [];

  return <ContentPage placeholder="Search for Movies" data={movies} />;
}
