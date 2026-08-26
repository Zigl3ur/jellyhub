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
import Paragraph from "../ui/paragraph";
import { Alert } from "../ui/alert";
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

  const { data, isSuccess, isPending, error } = useQuery({
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
    <div className="space-y-2">
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
      ) : (
        <Alert
          type="destructive"
          title="Failed to fetch seasons"
          message={error.message}
        />
      )}
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
  const { data, isPending, error, isSuccess } = useQuery({
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
    queryKey: ["episodes", item.Id],
  });

  return (
    <AccordionPanel>
      {isSuccess ? (
        data?.map((e) => (
          <div
            key={e.Id}
            className="flex gap-4 not-first:border-t not-first:border-muted py-4 first:pt-0"
          >
            <Image
              src={e.PrimaryImage}
              className="aspect-video w-24 @sm/item-content:w-48 rounded shrink-0"
            />
            <div className="space-y-2 w-full">
              <div className="flex justify-between items-center">
                <h5 className="text-lg">{e.Name}</h5>
                <p>{e.RunTimeTicks ? ticksToDuration(e.RunTimeTicks) : null}</p>
              </div>
              {e.Overview && (
                <Paragraph
                  lineClamp={5}
                  text={e.Overview}
                  className="@md/item-content:text-sm text-xs"
                />
              )}
            </div>
          </div>
        ))
      ) : isPending ? (
        <LoadingSeasonEpisodes />
      ) : (
        <Alert
          type="destructive"
          title="Failed to fetch season episodes"
          message={error.message}
        />
      )}
    </AccordionPanel>
  );
}

function LoadingSeasonEpisodes() {
  return Array.from({ length: 6 }).map((_, i) => (
    <div
      key={i}
      className="flex gap-4 not-first:border-t not-first:border-muted py-4"
    >
      <Skeleton className="aspect-video w-24 @sm/item-content:w-48 @sm/item-content:h-27 h-13.5 rounded shrink-0" />
      <div className="space-y-2 w-full">
        <div className="flex justify-between items-center">
          <Skeleton className="@md/item-content:w-32 w-24 h-5" />
          <Skeleton className="w-8.75 h-5" />
        </div>
        <div className="flex flex-col gap-1">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-[calc(100%-4rem)]" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-[calc(100%-6rem)]" />
        </div>
      </div>
    </div>
  ));
}
