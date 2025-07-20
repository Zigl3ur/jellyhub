import ItemsLoader from "@/components/loader";
import ServerStats from "@/components/servers-stats";

export default function Loading() {
  return (
    <div className="flex flex-col gap-20 max-w-[2000px] mx-auto">
      <ServerStats isLoading={true} count={[0, 0, 0, 0]} />
      <ItemsLoader />
    </div>
  );
}
