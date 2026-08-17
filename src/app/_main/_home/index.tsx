import { createFileRoute, Link } from "@tanstack/react-router";
import ItemCard, { ItemCardLoading } from "@/components/item/item-card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { itemsQueryOptions } from "@/queries/servers";
import { Suspense, type ComponentProps, type PropsWithoutRef } from "react";
import { ChevronRight } from "lucide-react";
import { Carousel } from "@/components/ui/caroussel";

export const Route = createFileRoute("/_main/_home/")({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(itemsQueryOptions({ types: ["Movie"] }));
    queryClient.prefetchQuery(itemsQueryOptions({ types: ["Series"] }));
    queryClient.prefetchQuery(itemsQueryOptions({ types: ["MusicAlbum"] }));
  },
  component: RouteComponent,
  pendingComponent: LoadingComponent,
  pendingMs: 0,
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-4">
        <h3 className="font-serif text-5xl">Movies</h3>
        <Suspense fallback={<CarouselSkeleton type="default" />}>
          <Section queryOpt={itemsQueryOptions({ types: ["Movie"] })} />
        </Suspense>
      </div>
      <div className="space-y-4">
        <h3 className="font-serif text-5xl">Series</h3>
        <Suspense fallback={<CarouselSkeleton type="default" />}>
          <Section queryOpt={itemsQueryOptions({ types: ["Series"] })} />
        </Suspense>
      </div>
      <div className="space-y-4">
        <h3 className="font-serif text-5xl">Albums</h3>
        <Suspense fallback={<CarouselSkeleton type="small" />}>
          <Section queryOpt={itemsQueryOptions({ types: ["MusicAlbum"] })} />
        </Suspense>
      </div>
    </div>
  );
}

interface SectionProps {
  queryOpt: ReturnType<typeof itemsQueryOptions>;
}

function Section({ queryOpt }: SectionProps) {
  const { data } = useSuspenseQuery(queryOpt);
  const shuffled = data.sort(() => Math.random() - 0.5);

  return (
    <Carousel>
      {shuffled.map((s) => (
        <ItemCard key={s.Id} item={s} />
      ))}
    </Carousel>
  );
}

interface CarouselSkeleton {
  type: ComponentProps<typeof ItemCardLoading>["type"];
}

function CarouselSkeleton({ type }: CarouselSkeleton) {
  return (
    <div className="flex gap-2 overflow-x-hidden">
      {Array.from({ length: 28 }).map((_, i) => (
        <ItemCardLoading key={i} type={type} />
      ))}
    </div>
  );
}

function LoadingComponent() {
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-4">
        <h3 className="font-serif text-5xl">Movies</h3>
        <CarouselSkeleton type="default" />
      </div>
      <div className="space-y-4">
        <h3 className="font-serif text-5xl">Series</h3>
        <CarouselSkeleton type="default" />
      </div>
      <div className="space-y-4">
        <h3 className="font-serif text-5xl">Albums</h3>
        <CarouselSkeleton type="small" />
      </div>
    </div>
  );
}
