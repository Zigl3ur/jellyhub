import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ItemCard from "./itemCard";
import { itemJellyfin } from "@/types/jellyfin.types";
import { X } from "lucide-react";

export default function CardsCaroussel(carousselProps: {
  isLoading: boolean;
  isReduced: boolean;
  items: itemJellyfin[];
}) {
  return (
    <div className="relative px-10">
      {carousselProps.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <X />
          <span>No items found.</span>
        </div>
      ) : (
        <div className="relative px-2">
          <Carousel
            className="grid relative"
            opts={{
              align: "center",
              loop: true,
            }}
          >
            <CarouselContent className="flex items-center">
              {carousselProps.items.map((item, key) => (
                <CarouselItem
                  key={key}
                  className="basis-auto flex justify-center"
                >
                  <ItemCard
                    key={item.item_name}
                    item={item}
                    serverCount={item.server_url.length}
                    reduced={carousselProps.isReduced}
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
