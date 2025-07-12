import { cookies } from "next/headers";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <main className="py-2 pr-2 pl-2 md:pl-0">{children}</main>
        <SidebarTrigger className="fixed z-10 ml-2 sm:ml-0 bottom-2 bg-background/50 border" />
      </SidebarInset>
    </SidebarProvider>
  );
}
