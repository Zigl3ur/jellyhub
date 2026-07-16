import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { getCookie } from "@tanstack/react-start/server";

export const Route = createFileRoute("/_main")({
  component: MainLayout,
});

function MainLayout() {
  const cookieStore = getCookie("sidebar_state");
  const defaultOpen = cookieStore === "true" ? true : false;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <main className="py-2 pr-2 pl-2 md:pl-0">
          <Outlet />
        </main>
        <SidebarTrigger className="fixed z-10 ml-2 sm:ml-0 bottom-2 bg-background/50 border" />
      </SidebarInset>
    </SidebarProvider>
  );
}
