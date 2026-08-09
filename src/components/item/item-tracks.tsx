import { useQuery } from "@tanstack/react-query";
import { cn } from "@sglara/cn";
import Skeleton from "../ui/skeleton";
import type { ServersItems } from "@/functions/jellyfin.functions";
import { getServerItems } from "@/functions/jellyfin.functions";
import { ticksToDuration } from "@/utils";

interface ItemTracksProps {
  item: ServersItems[number];
}

export default function ItemTracks({ item }: ItemTracksProps) {
  const { data, isSuccess, isPending, error, isError } = useQuery({
    queryFn: () =>
      getServerItems({
        data: {
          url: item.Servers[0].url,
          opts: {
            types: ["Audio"],
            parentId: item.Id,
          },
        },
      }),
    queryKey: ["tracks", item.Id],
  });

  return (
    <div>
      <h6 className="opacity-75">Tracks</h6>

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
      ) : isError ? (
        <></>
      ) : null}
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
