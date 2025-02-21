import ServerStats from "@/components/serversStats";

export default function ServerStatsLoading() {
  return <ServerStats isLoading={true} count={[0, 0, 0, 0]} />;
}

// export function CarrousselLoading() {
//   return <CardsCaroussel isLoading={true} />;
// }
