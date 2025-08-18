import db from "@/db";
import { videos } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, desc, eq, lt, or } from "drizzle-orm";
import z from "zod";

export const videosRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.session.user;

    const [video] = await db
      .insert(videos)
      .values({
        userId,
        title: "untilted",
      })
      .returning();
    return {
      video: video,
    };
  }),
});
