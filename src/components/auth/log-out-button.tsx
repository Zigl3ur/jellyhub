"use client";

import { authClient } from "@/lib/auth-client";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

export default function LogOutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Success", {
            description: "Successfully logged out",
          });
          router.push("/login");
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
