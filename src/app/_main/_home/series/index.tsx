import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { getAllServersSeries } from "@/functions/jellyfin.functions";

export const Route = createFileRoute("/_main/_home/series/")({
  component: SeriesPage,
  pendingComponent: LoadingComponent,
  pendingMs: 0,
});

async function SeriesPage() {
  const list = await getAllServersSeries();

  const series = list.data || [];

  return null;
}

export default function LoadingComponent() {
  return (
    <div className="flex flex-col gap-20 max-w-[2000px] mx-auto px-4">
      <div className="w-full max-w-xs xs:max-w-sm md:max-w-xl self-center sticky top-2 z-10">
        <div className="relative">
          <Input />
          <div className="absolute bg-secondary rounded-full right-2 top-1/2 -translate-y-1/2 p-1"></div>
        </div>
      </div>
    </div>
  );
}
