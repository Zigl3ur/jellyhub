import Badge from "../ui/badge";
import { JellyfinIcon } from "../ui/jellyfin-icon";
import { ExternalLink } from "../ui/link";
import type { ServersItems } from "@/functions/jellyfin.functions";

interface ItemServersProps {
  item: ServersItems[number];
}

export default function ItemServers({ item }: ItemServersProps) {
  return (
    <div className="space-y-2">
      <h6 className="opacity-75">Servers</h6>

      <div className="flex gap-2">
        {item.Servers.map((s) => (
          <Badge className="gap-2">
            <JellyfinIcon className="size-4 shrink-0" />
            <ExternalLink href={s.url}>{s.name}</ExternalLink>
          </Badge>
        ))}
      </div>
    </div>
  );
}
