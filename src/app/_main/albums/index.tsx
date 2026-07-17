import { createFileRoute } from "@tanstack/react-router";
import { Loader, X } from "lucide-react";
import ContentPage from "@/components/content-page";
import { Input } from "@/components/ui/input";
import { getAllServersAlbums } from "@/server/jellyfin.functions";
import { getUser } from "@/server/utils";

export const Route = createFileRoute("/_main/albums/")({
  component: AlbumsPage,
  pendingComponent: LoadingComponent,
  pendingMs: 0,
});

async function AlbumsPage() {
  await getUser();

  const list = await getAllServersAlbums();

  const albums = list.data || [];

  return <ContentPage placeholder="Search for Albums" data={albums} />;
}

function LoadingComponent() {
  return (
    <div className="flex flex-col gap-20 max-w-[2000px] mx-auto px-4">
      <div className="w-full max-w-xs xs:max-w-sm md:max-w-xl self-center sticky top-2 z-10">
        <div className="relative">
          <Input
            className="bg-background"
            disabled={true}
            placeholder="Search for Albums"
          />
          <div className="absolute bg-secondary rounded-full right-2 top-1/2 -translate-y-1/2 p-1">
            <X className="h-4 w-4" />
          </div>
        </div>
      </div>
      <Loader />
    </div>
  );
}
