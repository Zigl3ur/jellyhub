import Button from "../ui/button";
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
          <Button
            key={s.url}
            variant="outline"
            className="gap-2"
            render={
              <ExternalLink
                href={`${s.url}/#/details?id=${s.itemId}&serverId=${s.id}`}
                variant="unstyled"
                target="_blank"
              >
                <JellyfinIcon className="size-4 shrink-0" />
                {s.name}
              </ExternalLink>
            }
          />
        ))}
      </div>
    </div>
  );
}
