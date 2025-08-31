"use client";

import { CommentForm } from "@/modules/comments/ui/components/comment-form";
import { CommentItem } from "@/modules/comments/ui/components/comment-item";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface CommentsSectionProps {
  videoId: string;
}

export const CommentsSection = ({ videoId }: CommentsSectionProps) => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <CommentsSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

export const CommentsSectionSuspense = ({ videoId }: CommentsSectionProps) => {
  const trpc = useTRPC();

  const { data: comments } = useSuspenseQuery(
    trpc.comments.getMany.queryOptions({
      videoId,
    })
  );

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-6">
        <h1>{0} Comments</h1>
        <div>
          <CommentForm videoId={videoId} />
        </div>
        <div className="flex flex-col gap-4 mt-2">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
};
