import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ItemCard from "./itemCard";
import { itemJellyfin } from "@/types/jellyfin.types";
import Link from "next/link";
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
          <span>Please add at least one server / Check servers status </span>
          <Link
            href={"/settings"}
            className="hover:underline italic text-cyan-600"
          >
            Add a Server
          </Link>
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
                    href={`/item/${item.item_name.replace(/\s/g, "-")}`}
                    title={item.item_name}
                    serverCount={item.server_url.length}
                    image={item.item_image}
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
