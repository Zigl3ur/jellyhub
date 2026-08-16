import { createFileRoute } from "@tanstack/react-router";
import ItemCard from "@/components/item/item-card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { itemsQueryOptions } from "@/queries/servers";
import { Suspense } from "react";

export const Route = createFileRoute("/_main/_home/")({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(itemsQueryOptions(["Movie"]));
    queryClient.prefetchQuery(itemsQueryOptions(["Series"]));
    queryClient.prefetchQuery(itemsQueryOptions(["MusicAlbum"]));
  },
  component: RouteComponent,
  pendingComponent: LoadingComponent,
  pendingMs: 0,
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-2">
      <Suspense fallback={"movies..."}>
        <Section queryOpt={itemsQueryOptions(["Movie"])} />
      </Suspense>
      <Suspense fallback={"series..."}>
        <Section queryOpt={itemsQueryOptions(["Series"])} />
      </Suspense>
      <Suspense fallback={"albums..."}>
        <Section queryOpt={itemsQueryOptions(["MusicAlbum"])} />
      </Suspense>
    </div>
  );
}

interface SectionProps {
  queryOpt: ReturnType<typeof itemsQueryOptions>;
}

function Section({ queryOpt }: SectionProps) {
  const { data } = useSuspenseQuery(queryOpt);
  return data.map((d) => <ItemCard key={d.Id} item={d} />);
}

function LoadingComponent() {
  return <div className="size-50 bg-red-500">Loading aaaa</div>;
}
