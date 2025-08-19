"use client";

import { useTRPC } from "@/trpc/client";
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

export const VideosSection = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <VideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
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
    <div>
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
                <TableCell className="pl-6 w-[510px]">{video.title}</TableCell>
                <TableCell>Visibility</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
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
