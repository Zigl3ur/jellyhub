import { useQuery } from "@tanstack/react-query";
import { cn } from "@sglara/cn";
import { useState } from "react";
import Skeleton from "../ui/skeleton";
import { Alert } from "../ui/alert";
import ItemSelectServer from "./item-select-server";
import type { ServersItems } from "@/functions/jellyfin.functions";
import type { ItemServerData } from "@/types";
import { getServerItems } from "@/functions/jellyfin.functions";
import { ticksToDuration } from "@/utils";

interface ItemTracksProps {
  item: ServersItems[number];
}

export default function ItemTracks({ item }: ItemTracksProps) {
  const [selectedServer, setSelectedServer] = useState<ItemServerData>(
    item.Servers[0],
  );

  const { data, isSuccess, isPending, error } = useQuery({
    queryFn: () =>
      getServerItems({
        data: {
          url: selectedServer.url,
          opts: {
            types: ["Audio"],
            parentId: selectedServer.itemId,
          },
        },
      }),
    queryKey: [selectedServer, "tracks"],
  });

  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center justify-between">
        <h6 className="opacity-75">Tracks</h6>
        {item.Servers.length > 1 && (
          <ItemSelectServer
            defaultValue={item.Servers[0]}
            servers={item.Servers}
            onSelect={(server) => setSelectedServer(server)}
          />
        )}
      </div>
      {isSuccess ? (
        <ul>
          {data?.map((i) => (
            <li
              key={i.Id}
              className="not-first:border-t border-muted flex justify-between items-center py-2 space-x-4"
            >
              <p className="flex-1/2">{i.Name}</p>
              <p className="flex-1/3 hidden @md/item-content:inline-flex">
                {i.Artists && i.Artists.length > 0
                  ? i.Artists.join(", ")
                  : "Unknown Artist(s)"}
              </p>
              {i.RunTimeTicks && (
                <p className="flex-1 text-end">
                  {ticksToDuration(i.RunTimeTicks)}
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : isPending ? (
        <LoadingTracks />
      ) : (
        <Alert
          type="destructive"
          title="Failed to fetch tracks"
          message={error.message}
        />
      )}
    </div>
  );
}

const TITLE_WIDTHS = ["w-45", "w-52", "w-26", "w-16", "w-37", "w-47", "w-18"];
const ARTIST_NAME_WIDTHS = ["w-22", "w-18", "w-24", "w-26", "w-29"];

function LoadingTracks() {
  return (
    <ul>
      {Array.from({ length: 12 }).map((_, i) => (
        <li
          key={i}
          className="not-first:border-t border-muted flex justify-between items-center py-2 space-x-4"
        >
          <div className="flex-1/2">
            <Skeleton
              className={cn("h-4.5", TITLE_WIDTHS[i % TITLE_WIDTHS.length])}
            />
          </div>
          <div className="flex-1/3 @md/item-content:inline-flex">
            <Skeleton
              className={cn(
                "h-4.5",
                ARTIST_NAME_WIDTHS[i % ARTIST_NAME_WIDTHS.length],
              )}
            />
          </div>
          <div className="flex-1 pl-auto">
            <Skeleton className="h-4.5 w-8.75" />
          </div>
        </li>
      ))}
    </ul>
  );
}
