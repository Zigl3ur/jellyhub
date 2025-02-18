import ItemCard from "@/components/itemCard";
import ServerStats from "@/components/serversStats";
import { jellyfinStats } from "@/types/jellyfin.types";
import { Film, Music, Server, Tv } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JellyHub - Home",
};

export default function Home() {
  const data: jellyfinStats = {
    isLoading: true,
    globalStats: [
      {
        title: "Servers",
        count: 5,
        icon: <Server className="h-5 w-5" />,
      },
      {
        title: "Movies",
        count: 102,
        icon: <Film className="h-5 w-5" />,
      },
      {
        title: "Shows",
        count: 13,
        icon: <Tv className="h-5 w-5" />,
      },
      {
        title: "Music Albums",
        count: 8,
        icon: <Music className="h-5 w-5" />,
      },
    ],
  };

  return (
    <div className="p-4">
      <ServerStats isLoading={data.isLoading} globalStats={data.globalStats} />
      <div className="flex justify-center flex-wrap gap-4">
        <ItemCard isLoading={true} href={"#"} />
        <ItemCard isLoading={true} href={"#"} />
        <ItemCard isLoading={true} href={"#"} />
        <ItemCard isLoading={true} href={"#"} />
        <ItemCard isLoading={true} href={"#"} />
        <ItemCard isLoading={true} href={"#"} />
        <ItemCard isLoading={true} href={"#"} />
        <ItemCard isLoading={true} href={"#"} />
        <ItemCard isLoading={true} href={"#"} />
        <ItemCard isLoading={true} href={"#"} />
        <ItemCard isLoading={true} href={"#"} />
        <ItemCard isLoading={true} href={"#"} />
        <ItemCard isLoading={true} href={"#"} />
        <ItemCard isLoading={true} href={"#"} />
        <ItemCard isLoading={true} href={"#"} />
        <ItemCard isLoading={true} href={"#"} />
        <ItemCard isLoading={true} href={"#"} />
        <ItemCard isLoading={true} href={"#"} />
        <ItemCard isLoading={true} href={"#"} />
        <ItemCard isLoading={true} href={"#"} />
      </div>
    </div>
  );
}
