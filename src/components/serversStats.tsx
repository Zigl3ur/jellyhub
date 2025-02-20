import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Film, Server, Tv, Music } from "lucide-react";

const cardBaseData = [
  {
    title: "Servers",
    icon: <Server className="h-5 w-5" />,
  },
  {
    title: "Movies",
    icon: <Film className="h-5 w-5" />,
  },
  {
    title: "Shows",
    icon: <Tv className="h-5 w-5" />,
  },
  {
    title: "Music Albums",
    icon: <Music className="h-5 w-5" />,
  },
];

export default function ServerStats(statsProps: {
  isLoading: boolean;
  count: number[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cardBaseData.map((stats, key) => {
        return (
          <Card
            key={key}
            className="flex flex-col justify-between p-6 bg-black/30 backdrop-blur-lg"
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
              {statsProps.isLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <p className="text-4xl font-extrabold">
                  {statsProps.count[key]}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
