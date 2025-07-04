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
  isLoading: boolean;
  isReduced: boolean;
  items: itemJellyfin[];
}

export default function CardsCaroussel(Props: CarouselProps) {
  return (
    <div className="relative px-10">
      {Props.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <X />
          <span>No items found.</span>
        </div>
      ) : (
        <div className="relative px-2">
          <Carousel className="grid relative">
            <CarouselContent className="flex items-center">
              {Props.items.map((item, key) => (
                <CarouselItem
                  key={key}
                  className="basis-auto flex justify-center"
                >
                  <ItemDialog
                    key={item.item_name}
                    type="card"
                    item={item}
                    reduced={Props.isReduced}
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
