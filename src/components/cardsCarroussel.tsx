import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ItemCard from "./itemCard";
import { itemJellyfin } from "@/types/jellyfin.types";

export default function CardsCaroussel(carousselProps: {
  isLoading: boolean;
  items: itemJellyfin[];
}) {
  return (
    <div className="relative px-10">
      <Carousel
        className="grid relative"
        opts={{
          align: "center",
          loop: true,
        }}
      >
        <CarouselContent className="flex items-center">
          {carousselProps.items.map((item, key) => (
            <CarouselItem key={key} className="basis-auto flex justify-center">
              <ItemCard
                key={item.item_name}
                href={`/item/${item.item_name.replace(/\s/g, "-")}`}
                title={item.item_name}
                serverCount={item.server_url.length}
                image={item.item_image}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
