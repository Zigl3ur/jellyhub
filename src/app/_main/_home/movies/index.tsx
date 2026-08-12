import { Await, createFileRoute } from "@tanstack/react-router";
import { getServersItems } from "@/functions/jellyfin.functions";
import ItemCard, { ItemCardLoading } from "@/components/item/item-card";
import Skeleton from "@/components/ui/skeleton";

export const Route = createFileRoute("/_main/_home/movies/")({
  loader: () => ({
    items: getServersItems({
      data: { opts: { types: ["Movie"] } },
    }),
  }),
  component: RouteComponent,
  pendingComponent: LoadingComponent,
  pendingMs: 0,
  head: () => ({ meta: [{ title: "Movies - JellyHub" }] }),
});

function RouteComponent() {
  const { items } = Route.useLoaderData();

  return (
    <Await promise={items} fallback={LoadingComponent()}>
      {(data) => (
        <>
          <h3 className="font-serif text-4xl">Movies ({data.length})</h3>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {data.map((i) => (
              <ItemCard key={i.Id} item={i} />
            ))}
          </div>
        </>
      )}
    </Await>
  );
}

function LoadingComponent() {
  return (
    <>
      <h3 className="font-serif text-4xl flex items-center gap-2">
        Movies
        <Skeleton className="h-8 w-10 rounded" />
      </h3>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {Array.from({ length: 25 }).map((_, i) => (
          <ItemCardLoading key={i} type="default" />
        ))}
      </div>
    </>
  );
}
