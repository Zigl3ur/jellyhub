import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "../ui/accordion";
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
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

  const artists = useCallback(
    (artists: BaseItemDto["Artists"]) =>
      artists && artists.length > 0 ? artists.join(", ") : "Unknown Artist(s)",
    [],
  );

  return (
    <div className="space-y-2">
      <h6 className="opacity-75">Tracks</h6>

      <ul className="">
        {data?.map((i) => (
          <li className="not-first:border-t border-muted flex justify-between items-center py-2 space-x-4">
            <p className="flex-1/2">{i.Name}</p>
            <p className="flex-1/3">{artists(i.Artists)}</p>
            <p className="flex-1 text-end">{TicksToDuration(i.RunTimeTicks)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
