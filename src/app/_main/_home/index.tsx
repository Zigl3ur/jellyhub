import { createFileRoute } from "@tanstack/react-router";
import { checkServerConn } from "@/functions/jellyfin.functions";

export const Route = createFileRoute("/_main/_home/")({
  loader: async () => {
    console.log(await checkServerConn({ data: { address: "" } }));
  },
  component: Home,
  pendingComponent: LoadingComponent,
  pendingMs: 0,
});

function Home() {
  return <div className="max-w-[2000px] mx-auto"></div>;
}

function LoadingComponent() {
  return <div className="flex flex-col gap-20 max-w-[2000px] mx-auto"></div>;
}
