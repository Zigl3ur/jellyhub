import { ExternalLink } from "../ui/link";
import type { PropsWithChildren } from "react";
import type { ServersItems } from "@/functions/jellyfin.functions";

interface ItemProviderLinksProps {
  item: ServersItems[number];
}

export default function ItemProviderLinks({ item }: ItemProviderLinksProps) {
  switch (item.Type) {
    case "MusicAlbum":
      return <MusicProviderLink item={item} />;
    case "Series":
      return <TVProviderLink item={item} />;
    case "Movie":
      return <TVProviderLink item={item} />;
    default:
      return null;
  }
}

function TVProviderLink({ item }: ItemProviderLinksProps) {
  return (
    <div className="flex gap-2 -ml-1">
      {item.ProviderIds?.["Imdb"] && (
        <ProviderLink
          href={`https://www.imdb.com/title/${item.ProviderIds["Imdb"]}`}
        >
          <img src="/imdb.webp" alt="imdb icon" className="h-5.5 shrink-0" />
        </ProviderLink>
      )}
      {item.ProviderIds?.["Tmdb"] && (
        <ProviderLink
          href={`https://www.themoviedb.org/tv/${item.ProviderIds["Tmdb"]}`}
        >
          <img src="/tmdb.webp" alt="tmdb icon" className="h-5.5 shrink-0" />
        </ProviderLink>
      )}
    </div>
  );
}

function MusicProviderLink({ item }: ItemProviderLinksProps) {
  return (
    <div className="flex gap-2 -ml-1">
      {item.AlbumArtist && item.Name && (
        <ProviderLink
          href={`https://www.last.fm/music/${item.AlbumArtist}/${item.Name}`}
        >
          <img
            src="/lastfm.webp"
            alt="lastfm icon"
            className="rounded size-5.5"
          />
        </ProviderLink>
      )}
      {item.ProviderIds?.["MusicBrainzAlbum"] && (
        <ProviderLink
          href={`https://musicbrainz.org/release/${item.ProviderIds["MusicBrainzAlbum"]}`}
        >
          <img
            src="/musicbrainz.webp"
            alt="musicbrainz icon"
            className="size-5.5"
          />
        </ProviderLink>
      )}
      {item.Name && (
        <ProviderLink href={`https://open.spotify.com/search/${item.Name}`}>
          <img src="/spotify.webp" alt="spotify icon" className="size-5.5" />
        </ProviderLink>
      )}
    </div>
  );
}

interface ProviderLinkProps extends PropsWithChildren {
  href: string;
}

function ProviderLink({ children, href }: ProviderLinkProps) {
  return (
    <ExternalLink
      variant="unstyled"
      href={href}
      target="_blank"
      className="p-1 hover:cursor-pointer select-none shrink-0 hover:bg-accent/60 rounded transition-colors duration-200"
    >
      {children}
    </ExternalLink>
  );
}
