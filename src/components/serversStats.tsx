import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { jellyfinStats } from "@/types/jellyfin.types";
import { Skeleton } from "./ui/skeleton";

export default function ServerStats({ isLoading, globalStats }: jellyfinStats) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {globalStats.map((stats, key) => {
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
              {isLoading ? <Skeleton className="h-10 w-20" /> : stats.count}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
