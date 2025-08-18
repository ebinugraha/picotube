"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { MainSection } from "./main-section";
import Link from "next/link";
import { LogOutIcon, Video } from "lucide-react";
import { usePathname } from "next/navigation";
import { StudioSidebarHeader } from "./sidebar-header";

export const StudioSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar className="pt-16 z-30" collapsible="icon">
      <SidebarContent className="bg-background">
        <StudioSidebarHeader />
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname === "/studio"}
                asChild
                tooltip={"Content"}
              >
                <Link href={"/studio"} className="gap-4">
                  <Video className="size-5" />
                  <span className="text-sm">Content</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={"Exit studio"}>
                <Link href={"/"} className="gap-4">
                  <LogOutIcon className="size-5" />
                  <span className="text-sm">Exit studio</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
