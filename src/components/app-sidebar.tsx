import { Home, Settings, Film, Tv, Music } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { logout } from "@/lib/auth";
import LogOutButton from "./logoutButton";

const baseItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Movies",
    url: "/Movie",
    icon: Film,
  },
  {
    title: "Shows",
    url: "/Series",
    icon: Tv,
  },
  {
    title: "Music Albums",
    url: "/MusicAlbum",
    icon: Music,
  },
];

async function logoutAction(): Promise<void> {
  "use server";
  await logout();
}

export async function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image src={"/icon.svg"} alt="icon" width={25} height={25} />
                </div>
                <span className="font-semibold text-xl">JellyHub</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {baseItems.map(async (item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href={"/settings"}>
              <Settings />
              <span>Settings</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <LogOutButton onClick={logoutAction} />
      </SidebarFooter>
    </Sidebar>
  );
}
