import Loader from "@/components/global/loader";
import ServerStats from "@/components/serversStats";

export default function Loading() {
  return (
    <>
      <ServerStats isLoading={true} count={[0, 0, 0, 0]} />
      <Loader />
    </>
  );
}
