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
          <Carousel
            className="grid relative"
            opts={{
              align: "center",
              loop: true,
            }}
          >
            <CarouselContent className="flex items-center">
              {Props.items.map((item, key) => (
                <CarouselItem
                  key={key}
                  className="basis-auto flex justify-center"
                >
                  <ItemCard
                    key={item.item_name}
                    item={item}
                    serverCount={item.server_url.length}
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
