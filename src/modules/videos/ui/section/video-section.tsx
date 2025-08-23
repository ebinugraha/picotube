"use client";

import { cn } from "@/lib/utils";
import { VideoPlayer } from "@/modules/studio/ui/components/video-player";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { VideoBanner } from "../components/video-banner";
import { VideoTopRow } from "../components/video-top-row";
import { authClient } from "@/lib/auth-client";

interface VideoSectionProps {
  videoId: string;
}

export const VideoSection = ({ videoId }: VideoSectionProps) => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <VideoSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

export const VideoSectionSuspense = ({ videoId }: VideoSectionProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const data = authClient.useSession().data?.user;

  const { data: video } = useSuspenseQuery(
    trpc.videos.getOne.queryOptions({
      id: videoId,
    })
  );

  const videosView = useMutation(
    trpc.videoViews.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.videos.getOne.queryOptions({
            id: videoId,
          })
        );
      },
    })
  );

  const handleView = () => {
    if (!data) {
      return;
    }
    videosView.mutateAsync({
      videoId,
    });
  };

  return (
    <>
      <div
        className={cn(
          "aspect-video bg-black rounded-xl overflow-hidden relative",
          video.muxStatus !== "ready" && "rounded-b-none"
        )}
      >
        <VideoPlayer
          autoPlay
          onPlay={handleView}
          playbackId={video.muxPlayBackId}
          thumbnailUrl={video.thumbnailUrl}
        />
      </div>
      <VideoBanner status={video.muxStatus} />
      <VideoTopRow video={video} />
    </>
  );
};
