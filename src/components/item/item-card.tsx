import { parseISO } from "date-fns";
import { cn } from "@sglara/cn";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import ScrollArea from "../ui/scroll-area";
import Image from "../ui/image";
import Skeleton from "../ui/skeleton";
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
  const isMusicAlbum = item.Type === "MusicAlbum";

  const detailLabel = isMusicAlbum
    ? item.AlbumArtist
      ? item.AlbumArtist
      : "Unknown Artist"
    : item.PremiereDate && parseISO(item.PremiereDate).getFullYear();

  return (
    <Dialog>
      <DialogTrigger className="min-w-45 flex-1 gap-2.5 hover:bg-accent p-1.5 transition-colors duration-200 rounded hover:cursor-pointer flex flex-col justify-between">
        <Image
          src={item.PrimaryImage}
          className={cn(
            "rounded transition-transform duration-100",
            isMusicAlbum ? "aspect-square" : "aspect-2/3",
          )}
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
              className={cn(
                "rounded w-26 @sm/item-content:w-42 shrink-0",
                isMusicAlbum ? "aspect-square" : "aspect-2/3",
              )}
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
    </Dialog>
  );
}

interface ItemCardLoadingProps {
  type: "default" | "small";
}

export function ItemCardLoading({ type }: ItemCardLoadingProps) {
  return (
    <div className="min-w-45 flex-1 gap-2.5 p-1.5 rounded flex flex-col justify-between">
      <Skeleton
        className={cn(
          "w-full",
          type === "default" ? "aspect-2/3" : "aspect-square",
        )}
      />
      <div className="flex flex-col items-center gap-2 mb-1.5 mx-1">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-3 w-22" />
      </div>
    </div>
  );
}
