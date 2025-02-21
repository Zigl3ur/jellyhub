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
    <div>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset className="bg-gradient">
          <main>
            <SidebarTrigger className="m-2" />
            <div className="p-4">{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
