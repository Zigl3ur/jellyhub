import { format, parseISO } from "date-fns";
import { Star } from "lucide-react";
import ItemProviderLinks from "./item-provider-links";
import type { ServersItems } from "@/functions/jellyfin.functions";
import type { ItemTypes } from "@/types";
import { ticksToDuration } from "@/utils";

interface ItemPresentationProps {
  item: ServersItems[number];
}

export default function ItemPresentation({ item }: ItemPresentationProps) {
  return (
    <div className="flex flex-col gap-0.5 @sm/item-content:gap-2 justify-end w-full">
      <p className="uppercase opacity-75 text-xs @sm/item-content:text-sm">
        {displayType(item.Type as ItemTypes)}
      </p>
      <h3 className="font-bold text-lg @sm/item-content:text-2xl">
        {item.Name}
      </h3>
      {(item.RunTimeTicks || item.PremiereDate) && (
        <div className="flex gap-2">
          {item.RunTimeTicks ? (
            <p>{ticksToDuration(item.RunTimeTicks, true)}</p>
          ) : null}
          {item.PremiereDate && (
            <>
              {item.RunTimeTicks ? <span>•</span> : null}
              <p>{format(parseISO(item.PremiereDate), "MMM dd, yyyy")}</p>
            </>
          )}
        </div>
      )}

      {(item.CommunityRating || item.CriticRating) && (
        <div className="flex gap-3">
          {item.CommunityRating ? (
            <span className="flex items-center gap-1">
              {item.CommunityRating.toFixed(1)}
              <Star
                className="size-4 shrink-0"
                color="#48c1c3"
                fill="#48c1c3"
              />
            </span>
          ) : null}
          {item.CriticRating && (
            <span className="flex items-center gap-1">
              {item.CriticRating} %
              <img
                src={
                  item.CriticRating >= 60
                    ? "/fresh_tomato.webp"
                    : "/rotten_tomato.webp"
                }
                alt="rotten tomatoe rating icon"
                className="shrink-0 size-4"
              />
            </span>
          )}
        </div>
      )}

      {item.AlbumArtist && <p>{item.AlbumArtist}</p>}
      <ItemProviderLinks item={item} />
    </div>
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
