"use client";

import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { ClapperboardIcon, LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const UserButton = () => {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  if (!data || !data.user || isPending) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  const onLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center justify-center rounded-full">
        <Avatar className="h-8 w-8 rounded-full">
          <Image src={data.user.image!} height={40} width={40} alt="test" />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" className="w-82">
        <DropdownMenuLabel>
          <div className="flex flex-row gap-2">
            <Avatar className="h-9 w-9 rounded-full">
              <Image src={data.user.image!} height={50} width={50} alt="test" />
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{data.user.name}</span>
              <span className="text-sm text-muted-foreground font-normal truncate">
                {data.user.email}
              </span>
              <Link
                href={`/users/${data.user.id}`}
                className="text-blue-500 mt-2"
              >
                View Profile
              </Link>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          asChild
          className="flex items-center cursor-pointer pl-4"
        >
          <Link href={"/studio"}>
            <ClapperboardIcon className="size-5" />
            <span className="ml-2 text-[16px]">Studio</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center cursor-pointer pl-4">
          <LogOut className="size-5" />
          <span className="ml-2 text-[16px]" onClick={onLogout}>
            Logout
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
