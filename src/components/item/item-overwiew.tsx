import { useEffect, useRef, useState } from "react";
import Button from "../ui/button";
import type { ServersItems } from "@/functions/jellyfin.functions";

interface ItemOverviewProps {
  item: ServersItems[number];
}

export default function ItemOverview({ item }: ItemOverviewProps) {
  const overviewRef = useRef<HTMLParagraphElement>(null);

  const [expand, setExpand] = useState(false);
  const [isOverviewClamped, setIsOverviewClamped] = useState(false);

  useEffect(() => {
    const p = overviewRef.current;
    if (!p) return;

    setIsOverviewClamped(p.scrollHeight > p.clientHeight);
  }, [item.Overview]);

  return (
    <div className="space-y-2">
      <h6 className="opacity-75">About</h6>

      {item.Overview ? (
        <p ref={overviewRef} className={expand ? "" : "line-clamp-6"}>
          {item.Overview}
        </p>
      ) : (
        <p className="italic">
          No Details {item.Name && `about "${item.Name}"`}
        </p>
      )}

      {isOverviewClamped && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpand((prev) => !prev)}
        >
          {expand ? "Show Less" : "Read More"}
        </Button>
      )}
    </div>
  );
}
