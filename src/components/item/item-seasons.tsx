import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "../ui/accordion";
import Skeleton from "../ui/skeleton";
import Image from "../ui/image";
import ItemSelectServer from "./item-select-server";
import type { ServerItems, ServersItems } from "@/functions/jellyfin.functions";
import type { ItemServerData } from "@/types";
import { getServerItems } from "@/functions/jellyfin.functions";
import { ticksToDuration } from "@/utils";

interface ItemSeasonsProps {
  item: ServersItems[number];
}

export default function ItemSeasons({ item }: ItemSeasonsProps) {
  const [selectedServer, setSelectedServer] = useState<ItemServerData>(
    item.Servers[0],
  );

  const { data, isSuccess, isPending, error, isError } = useQuery({
    queryFn: () =>
      getServerItems({
        data: {
          url: selectedServer.url,
          opts: {
            types: ["Season"],
            parentId: selectedServer.itemId,
          },
        },
      }),
    queryKey: [selectedServer, "season"],
  });

  const defaultValue = data && data.length === 1 ? [data[0].Id] : [];

  return (
    <div>
      <div className="flex gap-2 items-center justify-between">
        <h6 className="opacity-75">Seasons</h6>
        {item.Servers.length > 1 && (
          <ItemSelectServer
            defaultValue={item.Servers[0]}
            servers={item.Servers}
            onSelect={(server) => setSelectedServer(server)}
          />
        )}
      </div>

      {isSuccess ? (
        <Accordion defaultValue={defaultValue}>
          {data?.map((i) => (
            <AccordionItem key={i.Id} value={i.Id}>
              <AccordionHeader>
                <AccordionTrigger>{i.Name}</AccordionTrigger>
              </AccordionHeader>
              <ItemSeasonEpisodes item={i} />
            </AccordionItem>
          ))}
        </Accordion>
      ) : isPending ? (
        <LoadingSeasons />
      ) : null}
    </div>
  );
}

function LoadingSeasons() {
  return (
    <Accordion>
      {Array.from({ length: 5 }).map((_, i) => (
        <AccordionItem key={i} disabled>
          <AccordionHeader>
            <AccordionTrigger>
              <Skeleton className="h-4 w-13" />
            </AccordionTrigger>
          </AccordionHeader>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

interface ItemSeasonEpisodesProps {
  item: ServerItems[number];
}

function ItemSeasonEpisodes({ item }: ItemSeasonEpisodesProps) {
  const { data, isPending, isError, error, isSuccess } = useQuery({
    queryFn: () =>
      getServerItems({
        data: {
          url: item.Server.url,
          opts: {
            types: ["Episode"],
            parentId: item.Id,
          },
        },
      }),
    queryKey: ["edpisodes", item.Id],
  });

  return (
    <AccordionPanel>
      {data?.map((e) => (
        <div
          key={e.Id}
          className="flex gap-4 not-first:border-t not-first:border-muted py-4"
        >
          <Image
            src={e.PrimaryImage}
            className="aspect-video w-24 @sm/item-content:w-48 rounded shrink-0 size-fit"
          />
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h5 className="@md/item-content:text-lg text-md">{e.Name}</h5>
              <p>{e.RunTimeTicks ? ticksToDuration(e.RunTimeTicks) : null}</p>
            </div>
            <p className="@md/item-content:text-sm text-xs">{e.Overview}</p>
          </div>
        </div>
      ))}
    </AccordionPanel>
  );
}
