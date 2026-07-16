"use client";

import { LogOutIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { authClient } from "@/lib/auth-client";

export default function LogOutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Success", {
            description: "Successfully logged out",
          });
          router.navigate({ to: "/login", replace: true });
        },
        onError: (ctx) => {
          toast.error("Error", {
            description: ctx.error.message || "Failed to logout",
          });
        },
      },
    });
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <button onClick={handleLogout} className="hover:cursor-pointer">
          <LogOutIcon />
          <span>Logout</span>
        </button>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
