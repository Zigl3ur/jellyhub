import { Home, Settings, LogOutIcon, Film, Tv, Music } from "lucide-react";

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
import { redirect } from "next/navigation";

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

const footerItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Logout",
    url: "#",
    icon: LogOutIcon,
  },
];

async function logoutAction(): Promise<void> {
  "use server";
  await logout();
  redirect("/login"); // throw error but works ok ?
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
        {footerItems.map(async (item) => {
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                {item.title === "Logout" ? (
                  <Link href={item.url} onClick={logoutAction}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                ) : (
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarFooter>
    </Sidebar>
  );
}
