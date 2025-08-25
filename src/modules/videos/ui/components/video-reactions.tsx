import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { VideoGetOneOutput } from "../../types";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface VideoReactionsProps {
  videoId: string;
  likes: number;
  dislikes: number;
  viewerReaction: VideoGetOneOutput["viewerReaction"];
}

export const VideoReactions = ({
  videoId,
  likes,
  dislikes,
  viewerReaction,
}: VideoReactionsProps) => {
  const session = authClient.useSession();

  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const like = useMutation(
    trpc.videoReactions.like.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.videos.getOne.queryOptions({
            id: videoId,
          })
        );
      },
      onError: (error) => {
        toast.info("Something went wrong");
      },
    })
  );

  const dislike = useMutation(
    trpc.videoReactions.dislike.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.videos.getOne.queryOptions({
            id: videoId,
          })
        );
      },
      onError: (error) => {
        toast.info("Something went wrong");
      },
    })
  );

  const handleLike = () => {
    if (!session) {
      router.push("/sign-in");
      return;
    }
    like.mutate({ videoId: videoId });
  };

  const handleDisike = () => {
    if (!session) {
      router.push("/sign-in");
      return;
    }
    dislike.mutate({ videoId: videoId });
  };

  return (
    <div className="flex items-center flex-none">
      <Button
        disabled={like.isPending || dislike.isPending}
        variant={"secondary"}
        onClick={handleLike}
        className="rounded-l-full rounded-r-none gap-2 pr-4"
      >
        <ThumbsUpIcon
          className={cn("size-5", viewerReaction === "like" && "fill-black")}
        />
        {likes}
      </Button>
      <Separator orientation="vertical" className="h-4" />
      <Button
        variant={"secondary"}
        disabled={like.isPending || dislike.isPending}
        onClick={handleDisike}
        className="rounded-r-full rounded-l-none gap-2 pl-4"
      >
        <ThumbsDownIcon
          className={cn("size-5", viewerReaction === "dislike" && "fill-black")}
        />
        {dislikes}
      </Button>
    </div>
  );
};
