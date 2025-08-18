import { SidebarHeader } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { UserAvatar } from "./user-avatar";
import { session } from "../../../../db/schema";
import { Skeleton } from "@/components/ui/skeleton";

export const StudioSidebarHeader = () => {
  const { data: user } = authClient.useSession();

  if (!user) {
    return (
      <SidebarHeader className="flex items-center justify-center pb-4">
        <Skeleton className="h-30 w-30 mt-2 rounded-full" />
        <Skeleton className="w-[70px] h-5" />
        <Skeleton className="w-[80px] h-4 " />
      </SidebarHeader>
    );
  }

  return (
    <SidebarHeader className="flex items-center justify-center pb-4">
      <Link href="/users/current">
        <UserAvatar
          className="h-30 w-30 mt-2 hover:opacity-80 transition-opacity"
          imageUrl={user?.user.image!}
          name={user?.user.name!}
        />
      </Link>
      <div className="flex flex-col items-center justify-center mt-2">
        <p className="text-sm font-medium">Your name</p>
        <p className="text-xs text-muted-foreground">{user.user.name}</p>
      </div>
    </SidebarHeader>
  );
};
