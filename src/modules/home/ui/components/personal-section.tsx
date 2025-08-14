"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { History, ListVideo, ThumbsUp } from "lucide-react";
import Link from "next/link";

const items = [
  {
    title: "History",
    url: "/playlist/history",
    icon: History,
    auth: true,
  },
  {
    title: "Liked videos",
    url: "/playlist/liked",
    icon: ThumbsUp,
    auth: true,
  },
  {
    title: "All playlist",
    url: "/feed",
    icon: ListVideo,
    auth: true,
  },
];

export const PersonalSection = () => {
  const { data } = authClient.useSession();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>You</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={false}
                onClick={(e) => {
                  if (item.auth && !data) {
                    e.preventDefault();
                    window.location.href = "/sign-in";
                  }
                }}
              >
                <Link className="flex items-center gap-4" href={item.url}>
                  <item.icon />
                  <span className="text-sm">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
