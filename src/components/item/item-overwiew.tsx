import Paragraph from "../ui/paragraph";
import type { ServersItems } from "@/functions/jellyfin.functions";

interface ItemOverviewProps {
  item: ServersItems[number];
}

export default function ItemOverview({ item }: ItemOverviewProps) {
  return (
    <div className="space-y-2">
      <h6 className="opacity-75">About</h6>

      {item.Overview ? (
        <Paragraph text={item.Overview} />
      ) : (
        <p className="italic">
          No Details {item.Name && `about "${item.Name}"`}
        </p>
      )}
    </div>
  );
}
