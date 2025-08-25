"use client";

import { useTRPC } from "@/trpc/client";
import { format } from "date-fns";
import {
  useSuspenseInfiniteQuery,
  useSuspenseQueries,
} from "@tanstack/react-query";
import { videos } from "../../../../db/schema";
import { DEFAULT_LIMIT } from "@/constant";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { InfiniteScroll } from "@/components/infinite-scroll";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VideoThumbnail } from "@/modules/videos/ui/components/video-thumbnail";
import { snakeCaseToTitle } from "@/lib/utils";
import { Globe2Icon, LockIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const VideosSection = () => {
  return (
    <Suspense fallback={<VideosSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <VideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

export const VideosSectionSkeleton = () => {
  return (
    <>
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6 w-[510px]">Videos</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Comments</TableHead>
              <TableHead className="pr-6 text-right">Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="pl-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-20 w-36" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-3 w-[150px]" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell className="pr-2">
                  <Skeleton className="h-4 w-14 mr-auto" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-4 w-12 ml-auto" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-4 w-12 ml-auto" />
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <Skeleton className="h-4 w-8 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export const VideosSectionSuspense = () => {
  const trpc = useTRPC();

  const router = useRouter();

  const data = useSuspenseInfiniteQuery(
    trpc.studio.getMany.infiniteQueryOptions(
      {
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    )
  );

  return (
    <div className="border-y">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-6 w-[510px]">Videos</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Views</TableHead>
            <TableHead className="text-right">Comments</TableHead>
            <TableHead className="pr-6 text-right">Likes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <TableRow
                key={video.id}
                onClick={() => router.push(`/studio/videos/${video.id}`)}
              >
                <TableCell className="pl-6">
                  <div className="flex items-center gap-4">
                    <div className="relative aspect-video w-36 shrink-0">
                      <VideoThumbnail
                        imageUrl={video.thumbnailUrl}
                        previewUrl={video.previewUrl}
                        title={video.title}
                        duration={video.duration || 0}
                      />
                    </div>
                    <div className="flex flex-col overflow-hidden gap-y-1">
                      <span className="text-sm line-clamp-1">
                        {video.title}
                      </span>
                      <span className="text-muted-foreground line-clamp-1 text-xs truncate w-sm">
                        {video.description || "No description"}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {video.visibility === "private" ? (
                      <LockIcon className="size-3 mr-2" />
                    ) : (
                      <Globe2Icon className="size-3 mr-2" />
                    )}
                    {snakeCaseToTitle(video.visibility)}
                  </div>
                </TableCell>
                <TableCell>
                  {snakeCaseToTitle(video.muxStatus || "error")}
                </TableCell>
                <TableCell className="text-sm truncate">
                  {format(new Date(video.createdAt), "d MMM yyyy")}
                </TableCell>
                <TableCell className="text-right">Views</TableCell>
                <TableCell className="text-right">Comments</TableCell>
                <TableCell className="pr-6 text-right">Likes</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <InfiniteScroll
        isManual
        fetchNextPage={data.fetchNextPage}
        hasNextPage={data.hasNextPage}
        isFetchingNextPage={data.isFetchingNextPage}
      />
    </div>
  );
};
