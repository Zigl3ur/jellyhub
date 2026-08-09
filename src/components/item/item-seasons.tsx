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
import type { ServerItems, ServersItems } from "@/functions/jellyfin.functions";
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { getServerItems } from "@/functions/jellyfin.functions";
import { ticksToDuration } from "@/utils";

interface ItemSeasonsProps {
  item: ServersItems[number];
}

export default function ItemSeasons({ item }: ItemSeasonsProps) {
  const { data, isPending, isError, error, isSuccess } = useQuery({
    queryFn: () =>
      getServerItems({
        data: {
          url: item.Servers[0].url,
          opts: {
            types: ["Season"],
            parentId: item.Id,
          },
        },
      }),
    queryKey: ["seasons", item.Id],
  });

  const defaultValue = data && data.length === 1 ? [data[0].Id] : [];

  return (
    <div className="space-y-1">
      <h6 className="opacity-75">Seasons</h6>

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
    <AccordionPanel className="space-y-2">
      {data?.map((e) => (
        <div className="flex gap-2">
          <Image
            src={e.PrimaryImage}
            className="aspect-video w-48 rounded shrink-0"
          />
          <div className="space-y-px">
            <h5>{e.Name}</h5>
            <p>{e.Overview}</p>
          </div>
          {e.RunTimeTicks ? ticksToDuration(e.RunTimeTicks) : null}
        </div>
      ))}
    </AccordionPanel>
  );
}
