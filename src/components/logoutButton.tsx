"use client";

import { LogOutIcon } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { useRouter } from "next/navigation";

interface LogOutProps {
  onClick: () => Promise<void>;
}

export default function LogOutButton(Props: LogOutProps) {
  const router = useRouter();

  async function handleLogout() {
    Props.onClick().then(() => router.replace("/login"));
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <button onClick={handleLogout}>
          <LogOutIcon />
          <span>Logout</span>
        </button>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
