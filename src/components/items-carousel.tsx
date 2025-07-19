import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { itemJellyfin } from "@/types/jellyfin-api.types";
import ItemDialog from "./item-dialog";

interface CarouselProps {
  children: React.ReactNode;
  items: itemJellyfin[];
}

export default function ItemsCarousel({ children, items }: CarouselProps) {
  return (
    items.length !== 0 && (
      <div className="px-12">
        <Carousel className="grid space-y-4">
          {children}
          <CarouselContent className="flex items-center">
            {items.map((item, incex) => (
              <CarouselItem key={incex} className="basis-auto">
                <ItemDialog key={item.item_name} item={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    )
  );
}
