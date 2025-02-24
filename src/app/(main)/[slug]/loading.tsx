import Loader from "@/components/loader";
import SearchBar from "@/components/searchBar";

export default function Loading() {
  return (
    <div>
      <SearchBar serverCount={0} items={[]} type="..." />
      <Loader />
    </div>
  );
}
