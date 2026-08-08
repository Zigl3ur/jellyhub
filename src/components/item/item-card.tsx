import { format, parseISO } from "date-fns";
import { Play } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import ScrollArea from "../ui/scroll-area";
import Button from "../ui/button";
import Image from "../ui/image";
import ItemSeasons from "./item-seasons";
import ItemTracks from "./item-tracks";
import ItemOverview from "./item-overwiew";
import ItemProviderLinks from "./item-provider-links";
import ItemServers from "./item-servers";
import type { ItemTypes } from "@/types";
import type { ServersItems } from "@/functions/jellyfin.functions";
import { ticksToDuration } from "@/utils";

interface ItemCardProps {
  item: ServersItems[number];
}

export default function ItemCard({ item }: ItemCardProps) {
  const detailLabel =
    item.Type === "MusicAlbum"
      ? item.AlbumArtist
        ? item.AlbumArtist
        : "Unknown Artist"
      : item.PremiereDate && parseISO(item.PremiereDate).getFullYear();

  return (
    <Dialog>
      <DialogTrigger className="w-45 space-y-1.5 hover:bg-accent p-1.5 group/item-card transition-colors duration-200 rounded hover:cursor-pointer h-fit">
        <div className="overflow-hidden rounded">
          <Image
            src={item.PrimaryImage}
            className="rounded transition-transform duration-250 group-hover/item-card:scale-103"
          />
        </div>
        <div className="mx-1 mb-1.5 space-y-1">
          <h3 className="truncate">{item.Name}</h3>
          <p className="opacity-65 text-xs">{detailLabel}</p>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl h-[70vh]">
        <DialogHeader>
          <div className="flex gap-4 relative">
            {item.BackdropImage && (
              <div
                className="absolute -inset-x-4 -top-4 -bottom-4 bg-cover bg-position-[center_top] -z-1  h-[calc(100%+4rem)] opacity-25 mask-[linear-gradient(to_bottom,black_0%,transparent_100%)]"
                style={{ backgroundImage: `url(${item.BackdropImage})` }}
              />
            )}

            <Image src={item.PrimaryImage} className="rounded w-42 shrink-0" />
            <div className="flex flex-col gap-2 justify-end w-full">
              <p className="text-sm uppercase opacity-75">
                {displayType(item.Type as ItemTypes)}
              </p>
              <h3 className="font-bold text-2xl">{item.Name}</h3>
              <div className="flex gap-2">
                {item.RunTimeTicks && (
                  <p>{ticksToDuration(item.RunTimeTicks, true)}</p>
                )}
                {item.PremiereDate && (
                  <>
                    <span>•</span>
                    <p>{format(parseISO(item.PremiereDate), "MMM dd, yyyy")}</p>
                  </>
                )}
              </div>
              {item.AlbumArtist && <p>{item.AlbumArtist}</p>}
              <div className="flex justify-between items-center">
                <Button className="w-fit">
                  <Play className="size-5" fill="black" /> Play
                </Button>
                <ItemProviderLinks item={item} />
              </div>
            </div>
          </div>
        </DialogHeader>
        <ScrollArea className="pr-2.5">
          <div className="space-y-4">
            <ItemServers item={item} />
            <ItemOverview item={item} />

            {item.Type === "Series" ? (
              <ItemSeasons item={item} />
            ) : item.Type === "MusicAlbum" ? (
              <ItemTracks item={item} />
            ) : null}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function displayType(type: ItemTypes) {
  switch (type) {
    case "Series":
      return "TV Show";
    case "MusicAlbum":
      return "Album";
    case "Audio":
      return "Track";
    default:
      return type;
  }
}
