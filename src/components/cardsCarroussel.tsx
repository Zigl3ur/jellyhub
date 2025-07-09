import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { itemJellyfin } from "@/types/jellyfin-api.types";
import { X } from "lucide-react";
import ItemDialog from "./global/itemDialog";

interface CarouselProps {
  isReduced: boolean;
  children: React.ReactNode;
  items: itemJellyfin[];
}

export default function CardsCaroussel({
  isReduced,
  children,
  items,
}: CarouselProps) {
  return (
    <div className="px-10">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <X />
          <span>No items found.</span>
        </div>
      ) : (
        <div className="relative px-2">
          <Carousel className="grid relative space-y-4">
            {children}
            <CarouselContent className="flex items-center">
              {items.map((item, key) => (
                <CarouselItem key={key} className="basis-auto">
                  <ItemDialog
                    key={item.item_name}
                    item={item}
                    reduced={isReduced}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}
    </div>
  );
}
