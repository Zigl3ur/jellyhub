import { createFileRoute } from "@tanstack/react-router";
import ItemCard, { ItemCardLoading } from "@/components/item/item-card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { itemsQueryOptions } from "@/queries/servers";
import { Suspense, type ComponentProps } from "react";
import { Carousel } from "@/components/ui/caroussel";
import { SearchX, ServerOff } from "lucide-react";
import type { ItemTypes } from "@/types";
import { cn } from "@sglara/cn";
import { getJellyData } from "@/functions/server.functions";
import { Link } from "@/components/ui/link";
import Button from "@/components/ui/button";

export const Route = createFileRoute("/_main/_home/")({
  loader: async ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(itemsQueryOptions({ types: ["Movie"] }));
    queryClient.prefetchQuery(itemsQueryOptions({ types: ["Series"] }));
    queryClient.prefetchQuery(itemsQueryOptions({ types: ["MusicAlbum"] }));

    const { servers } = await getJellyData({ data: { updateStatus: false } });

    return { servers };
  },
  component: RouteComponent,
  pendingComponent: LoadingComponent,
  pendingMs: 0,
});

function RouteComponent() {
  const { servers } = Route.useLoaderData();

  return servers.length > 0 ? (
    <div className="flex flex-col gap-8">
      <div className="space-y-4">
        <h3 className="font-serif text-5xl">Movies</h3>
        <Suspense fallback={<CarouselSkeleton type="default" />}>
          <Section queryOpt={itemsQueryOptions({ types: ["Movie"] })} />
        </Suspense>
      </div>
      <div className="space-y-4">
        <h3 className="font-serif text-5xl">TV Shows</h3>
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
  ) : (
    <EmptyItems />
  );
}

interface SectionProps {
  queryOpt: ReturnType<typeof itemsQueryOptions>;
}

function Section({ queryOpt }: SectionProps) {
  const { data } = useSuspenseQuery(queryOpt);

  return data.length > 0 ? (
    <Carousel>
      {data.map((i) => (
        <ItemCard className="w-45" key={i.Id} item={i} />
      ))}
    </Carousel>
  ) : (
    <NoItems type={queryOpt.queryKey[1][0] as ItemTypes} />
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
        <h3 className="font-serif text-5xl">TV Shows</h3>
        <CarouselSkeleton type="default" />
      </div>
      <div className="space-y-4">
        <h3 className="font-serif text-5xl">Albums</h3>
        <CarouselSkeleton type="small" />
      </div>
    </div>
  );
}

interface NoItemsProps {
  type: ItemTypes;
}

function NoItems({ type }: NoItemsProps) {
  const typeDisplay =
    type === "Movie" ? "Movies" : type === "Series" ? "TV Shows" : "Albums";

  return (
    <div
      className={cn(
        "bg-accent/45 p-1 flex-col h-81 gap-4 flex items-center justify-center rounded border border-muted w-full",
        type === "MusicAlbum" ? "h-60" : "h-81",
      )}
    >
      <div className="flex flex-col items-center gap-0.5">
        <div className="size-8 mb-2 flex items-center justify-center p-1.25 rounded bg-accent-foreground border border-muted">
          <SearchX />
        </div>
        <h5 className="text-lg">No {typeDisplay} found</h5>
        <p className="opacity-50 text-center">
          No Items found through configured servers.
        </p>
      </div>
    </div>
  );
}

function EmptyItems() {
  return (
    <div className="bg-accent/45 p-1 flex-col h-85 gap-4 flex items-center justify-center rounded border border-muted w-full">
      <div className="flex flex-col items-center gap-0.5">
        <div className="size-8 mb-2 flex items-center justify-center p-1.25 rounded bg-accent-foreground border border-muted">
          <ServerOff />
        </div>
        <h5 className="text-lg">No Servers configured</h5>
        <p className="opacity-50 text-center">
          Configure Jellyfin Servers to see available items
        </p>
      </div>
      <Button
        nativeButton={false}
        render={
          <Link to="/settings" variant="unstyled">
            Configure a Server
          </Link>
        }
      />
    </div>
  );
}
