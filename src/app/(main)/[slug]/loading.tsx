import Loader from "@/components/loader";
import SearchBar from "@/components/searchBar";

export default function Loading() {
  return (
    <div>
      <SearchBar items={[]} type="..." />
      <Loader />
    </div>
  );
}
