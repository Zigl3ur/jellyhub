import { cn } from "@sglara/cn";
import { useEffect, useRef, useState } from "react";
import Skeleton from "./skeleton";
import type { ImgHTMLAttributes } from "react";

export default function Image({
  className,
  src,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) setImgLoaded(true);
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img
        {...props}
        ref={imgRef}
        src={src}
        onLoad={() => setImgLoaded(true)}
        className={cn(
          "transition-opacity duration-200",
          imgLoaded ? "opacity-100" : "opacity-0",
        )}
      />
      {!imgLoaded && <Skeleton className="absolute inset-0 h-full w-full" />}
    </div>
  );
}
