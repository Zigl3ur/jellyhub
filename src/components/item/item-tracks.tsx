import { useQuery } from "@tanstack/react-query";
import { getServerItems } from "@/functions/jellyfin.functions";
import { TicksToDuration } from "@/utils";

interface ItemTracksProps {
  serverUrl: string;
  item: NonNullable<Awaited<ReturnType<typeof getServerItems>>>[number];
}

export default function ItemTracks({ serverUrl, item }: ItemTracksProps) {
  const { data, isPending, error, isError } = useQuery({
    queryFn: () =>
      getServerItems({
        data: {
          url: serverUrl,
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

      <ul>
        {data?.map((i) => (
          <li
            key={i.Id}
            className="not-first:border-t border-muted flex justify-between items-center py-2 space-x-4"
          >
            <p className="flex-1/2">{i.Name}</p>
            <p className="flex-1/3">
              {i.Artists && i.Artists.length > 0
                ? i.Artists.join(", ")
                : "Unknown Artist(s)"}
            </p>
            <p className="flex-1 text-end">{TicksToDuration(i.RunTimeTicks)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
