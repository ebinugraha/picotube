import Link from "next/link";
import { CommentGetManyOutput } from "../../types";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MessageSquare, MoreVertical, Trash2Icon } from "lucide-react";
import { DEFAULT_LIMIT } from "@/constant";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CommentItemProps {
  comment: CommentGetManyOutput[number];
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  const { data } = authClient.useSession();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const remove = useMutation(
    trpc.comments.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.comments.getMany.infiniteQueryOptions({
            limit: DEFAULT_LIMIT,
            videoId: comment.videoId,
          })
        );
      },
      onError: (error) => {
        toast.error("Something went wrong");

        if (error.data?.code === "UNAUTHORIZED") {
          router.push("/sign-in");
        }
      },
    })
  );

  return (
    <div>
      <div className="flex gap-4">
        <Link href={`/users/${comment.userId}`}>
          <Avatar className="h-8 w-8 rounded-full">
            <Image
              src={comment.user.image!}
              height={40}
              width={40}
              alt="test"
            />
          </Avatar>
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/users/${comment.userId}`}>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-medium text-sm pb-0.5">
                {comment.user.name}
              </span>
              <span className="text-xs text-m">
                {formatDistanceToNow(comment.createdAt, {
                  addSuffix: true,
                })}
              </span>
            </div>
          </Link>
          <p className="text-sm">{comment.value}</p>
        </div>
        {data?.user.id === comment.userId && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} size={"icon"}>
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <MessageSquare />
                Reply
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  remove.mutateAsync({
                    videoId: comment.videoId,
                    id: comment.id,
                  })
                }
              >
                <Trash2Icon />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};
