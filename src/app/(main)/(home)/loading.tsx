import ServerStats from "@/components/serversStats";
import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <>
      <ServerStats isLoading={true} count={[0, 0, 0, 0]} />
      <div className="flex flex-col flex-wrap justify-center items-center text-center min-h-[50vh]">
        <LoaderCircle className="animate-spin" />
        <span>Fetching Data, please wait.</span>
      </div>
    </>
  );
}
