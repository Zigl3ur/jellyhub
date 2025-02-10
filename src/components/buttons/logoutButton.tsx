"use client";

import { LogOutIcon } from "lucide-react";
import { SidebarMenuButton } from "../ui/sidebar";
import { useToast } from "@/hooks/use-toast";

export default function LogoutButton() {
  const { toast } = useToast();

  async function logOut() {
    const res = await fetch("/api/auth/logout", { method: "GET" });

    if (res.status === 200) window.location.href = "/login";
    else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error while loggin out",
        duration: 2500,
      });
    }
  }

  return (
    <SidebarMenuButton asChild onClick={() => logOut()}>
      <button>
        <LogOutIcon />
        <span>Logout</span>
      </button>
    </SidebarMenuButton>
  );
}
