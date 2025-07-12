import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Film, Server, Tv, Music } from "lucide-react";

const cardData = [
  {
    title: "Servers",
    icon: <Server className="h-5 w-5" />,
  },
  {
    title: "Movies",
    icon: <Film className="h-5 w-5" />,
  },
  {
    title: "Series",
    icon: <Tv className="h-5 w-5" />,
  },
  {
    title: "Albums",
    icon: <Music className="h-5 w-5" />,
  },
];

interface StatsProps {
  count: number[];
  isLoading?: boolean;
}

export default function ServerStats({ count, isLoading }: StatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cardData.map((stats, index) => {
        return (
          <Card
            key={index}
            className="flex flex-col justify-between p-6 bg bg-card/50"
          >
            <CardHeader className="p-0">
              <div className="inline-flex items-center gap-3">
                <span className="text-primary">{stats.icon}</span>
                <CardTitle className="text-lg font-semibold">
                  {stats.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 pt-6">
              {isLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <p className="text-4xl font-extrabold">{count[index]}</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
