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
import type { ItemTypes } from "@/types";
import type { getServerItems } from "@/functions/jellyfin.functions";

interface ItemCardProps {
  serverUrl: string;
  item: NonNullable<Awaited<ReturnType<typeof getServerItems>>>[number];
}

export default function ItemCard({ serverUrl, item }: ItemCardProps) {
  const detailLabel =
    item.Type === "MusicAlbum"
      ? item.AlbumArtist
        ? item.AlbumArtist
        : "Unknown Artist"
      : item.PremiereDate && parseISO(item.PremiereDate).getFullYear();

  return (
    <Dialog>
      <DialogTrigger className="w-45 space-y-1.5 hover:bg-accent p-1.5 group/item-card transition-colors duration-200 rounded hover:cursor-pointer">
        <div className="overflow-hidden rounded">
          <Image
            src={item.PrimaryImage}
            className="rounded transition-transform duration-250 group-hover/item-card:scale-103"
          />
        </div>
        <div className="space-y-1px mx-1">
          <h3 className="truncate">{item.Name}</h3>
          <p className="opacity-65 text-xs">{detailLabel}</p>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl w-full max-h-160">
        <DialogHeader>
          <div className="flex gap-4 relative">
            {item.BackdropImage && (
              <div
                className="absolute -inset-x-4 -top-4 -bottom-4 bg-cover bg-position-[center_top] -z-1 opacity-25 mask-[linear-gradient(to_bottom,black_0%,transparent_100%)]"
                style={{ backgroundImage: `url(${item.BackdropImage})` }}
              />
            )}

            <Image src={item.PrimaryImage} className="rounded w-42 shrink-0" />
            <div className="flex flex-col gap-2 justify-end">
              <p className="text-sm uppercase opacity-75">
                {displayType(item.Type as ItemTypes)}
              </p>
              <h3 className="font-bold text-2xl">{item.Name}</h3>
              {item.PremiereDate && (
                <p>{format(parseISO(item.PremiereDate), "MMM dd, yyyy")}</p>
              )}
              <p>{item.AlbumArtist}</p>
              <Button className="w-fit">
                <Play className="size-5" fill="black" /> Play
              </Button>
            </div>
          </div>
        </DialogHeader>

        {item.Overview && (
          <div className="space-y-2">
            <h6 className="opacity-75">Overview</h6>
            <ScrollArea className="w-full h-40">{item.Overview}</ScrollArea>
          </div>
        )}

        {item.Type === "Series" ? (
          <ItemSeasons serverUrl={serverUrl} item={item} />
        ) : item.Type === "MusicAlbum" ? (
          <ItemTracks serverUrl={serverUrl} item={item} />
        ) : null}
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
