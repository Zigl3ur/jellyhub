import { useEffect, useRef, useState } from "react";
import Button from "../ui/button";
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";

interface ItemOverviewProps {
  name: BaseItemDto["Name"];
  overview: BaseItemDto["Overview"];
}

export default function ItemOverview({ name, overview }: ItemOverviewProps) {
  const overviewRef = useRef<HTMLParagraphElement>(null);

  const [expand, setExpand] = useState(false);
  const [isOverviewClamped, setIsOverviewClamped] = useState(false);

  useEffect(() => {
    const p = overviewRef.current;
    if (!p) return;

    setIsOverviewClamped(p.scrollHeight > p.clientHeight);
  }, [overview]);

  return (
    <div className="space-y-2">
      <h6 className="opacity-75">About</h6>

      {overview ? (
        <p ref={overviewRef} className={expand ? "" : "line-clamp-6"}>
          {overview}
        </p>
      ) : (
        <p className="italic">No Details {name && `about "${name}"`}</p>
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
