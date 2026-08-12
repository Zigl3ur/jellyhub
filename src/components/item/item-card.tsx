import { parseISO } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import ScrollArea from "../ui/scroll-area";
import Image from "../ui/image";
import ItemSeasons from "./item-seasons";
import ItemTracks from "./item-tracks";
import ItemOverview from "./item-overwiew";
import ItemServers from "./item-servers";
import ItemPresentation from "./item-presentation";
import type { ServersItems } from "@/functions/jellyfin.functions";

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
      <DialogTrigger className="w-45 gap-1.5 hover:bg-accent p-1.5 group/item-card transition-colors duration-200 rounded hover:cursor-pointer flex flex-col justify-between">
        <Image
          src={item.PrimaryImage}
          className="rounded transition-transform duration-100 group-hover/item-card:scale-103 h-full"
        />
        <div className="mx-1 mb-1.5 space-y-1">
          <h3 className="truncate">{item.Name}</h3>
          <p className="opacity-65 text-xs">{detailLabel}</p>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[calc(100%-2rem)] sm:max-h-[80vh] grid-rows-[auto_1fr] @container/item-content">
        <DialogHeader>
          <div className="flex gap-4 relative">
            {item.BackdropImage && (
              <div
                className="absolute -inset-x-4 -top-4 -bottom-4 bg-cover bg-position-[center_top] -z-1  h-[calc(100%+4rem)] opacity-25 mask-[linear-gradient(to_bottom,black_0%,transparent_100%)]"
                style={{ backgroundImage: `url(${item.BackdropImage})` }}
              />
            )}

            <Image
              src={item.PrimaryImage}
              className="rounded w-26 @sm/item-content:w-42 shrink-0 size-full"
            />
            <ItemPresentation item={item} />
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

      {/* <DialogContent className="sm:max-w-2xl max-h-[80vh] grid-rows-[auto_1fr] @container/item-content">
        <DialogHeader>
          <div className="flex flex-col @sm/item-content:flex-row gap-4 relative">
            {item.BackdropImage && (
              <div
                className="absolute -inset-x-4 -top-4 -bottom-4 bg-cover bg-position-[center_top] -z-1  h-[calc(100%+4rem)] opacity-25 mask-[linear-gradient(to_bottom,black_0%,transparent_100%)]"
                style={{ backgroundImage: `url(${item.BackdropImage})` }}
              />
            )}

            <Image
              src={item.PrimaryImage}
              className="rounded w-42 shrink-0 size-fit"
            />
            <ItemPresentation item={item} />
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
      </DialogContent> */}
    </Dialog>
  );
}
