import { cn } from "@sglara/cn";
import { useEffect, useRef, useState } from "react";
import Button from "./button";
import type { CSSProperties } from "react";

interface ParagraphProps {
  className?: string;
  text: string;
  lineClamp?: number;
}

export default function Paragraph({
  className,
  text,
  lineClamp = 6,
}: ParagraphProps) {
  const pRef = useRef<HTMLParagraphElement>(null);

  const [expand, setExpand] = useState(false);
  const [isClamped, setIsClamped] = useState(false);

  useEffect(() => {
    const p = pRef.current;
    if (!p) return;

    setIsClamped(p.scrollHeight > p.clientHeight);
  }, [text]);

  return (
    <div className="space-y-1">
      <p
        ref={pRef}
        style={{ "--line-clamp": lineClamp } as CSSProperties}
        className={cn(
          className,
          expand ? "line-clamp-none" : "line-clamp-(--line-clamp)",
        )}
      >
        {text}
      </p>
      {isClamped && (
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
