import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export const THUMBNAIL_FALLBACK = "/placeholder.svg";

export type VideoGetOneOutput =
  inferRouterOutputs<AppRouter>["videos"]["getOne"];
