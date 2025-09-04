import { DEFAULT_LIMIT } from "@/constant";
import { useTRPC } from "@/trpc/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CornerDownLeftIcon, LoaderIcon } from "lucide-react";
import { CommentItem } from "./comment-item";
import { Button } from "@/components/ui/button";

interface CommentRepliesProps {
  videoId: string;
  parentId: string;
}

export const CommentReplies = ({ videoId, parentId }: CommentRepliesProps) => {
  const trpc = useTRPC();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      trpc.comments.getMany.infiniteQueryOptions(
        {
          limit: DEFAULT_LIMIT,
          videoId,
          parentId: parentId,
        },
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
      )
    );

  return (
    <div className="pl-14">
      <div className="flex flex-col gap-4 mt-2">
        {isLoading && (
          <div className="flex items-center justify-center">
            <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {!isLoading &&
          data?.pages
            .flatMap((page) => page.items)
            .map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                variant="replies"
              />
            ))}
      </div>
      {hasNextPage && (
        <Button
          variant={"ghost"}
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mx-auto my-4"
        >
          <CornerDownLeftIcon />
          Show more replies {isFetchingNextPage && "Loading..."}
        </Button>
      )}
    </div>
  );
};
