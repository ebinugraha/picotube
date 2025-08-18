"use client";

import { useTRPC } from "@/trpc/client";
import {
  useSuspenseInfiniteQuery,
  useSuspenseQueries,
} from "@tanstack/react-query";
import { videos } from "../../../../db/schema";
import { DEFAULT_LIMIT } from "@/constant";

export const VideosSection = () => {
  const trpc = useTRPC();

  const { data } = useSuspenseInfiniteQuery(
    trpc.studio.getMany.infiniteQueryOptions(
      {
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    )
  );

  return <div>{JSON.stringify(data)}</div>;
};
