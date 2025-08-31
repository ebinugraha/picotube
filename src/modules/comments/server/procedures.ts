import db from "@/db";
import { commentInsertSchema, comments, user, videoViews } from "@/db/schema";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { and, desc, eq, getTableColumns } from "drizzle-orm";
import z from "zod";

export const commentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        videoId: z.string(),
        value: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { videoId, value } = input;
      const { id: userId } = ctx.session.user;

      const [createdVideoView] = await db
        .insert(comments)
        .values({ videoId, userId, value })
        .returning();

      return createdVideoView;
    }),

  getMany: baseProcedure
    .input(z.object({ videoId: z.string() }))
    .query(async ({ input }) => {
      const { videoId } = input;

      const data = await db
        .select({
          ...getTableColumns(comments),
          user: user,
        })
        .from(comments)
        .where(and(eq(comments.videoId, videoId)))
        .innerJoin(user, eq(comments.userId, user.id))
        .orderBy(desc(comments.createdAt));

      return data;
    }),
});
