import { useRef, type PropsWithChildren } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Carousel({ children }: PropsWithChildren) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group/container">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scroll-smooth scrollbar-none"
      >
        {children}
      </div>

      <button
        onClick={() => scroll("left")}
        className="absolute left-1 top-1/2 -translate-y-1/2 size-7 hover:cursor-pointer opacity-0 group-hover/container:opacity-100 border border-muted transition-opacity bg-accent-foreground shadow-md rounded flex items-center justify-center duration-200"
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-1 top-1/2 -translate-y-1/2 size-7 hover:cursor-pointer opacity-0 group-hover/container:opacity-100 border border-muted transition-opacity bg-accent-foreground shadow-md rounded flex items-center justify-center duration-200"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
