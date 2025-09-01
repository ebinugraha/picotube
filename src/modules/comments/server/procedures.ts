import db from "@/db";
import { commentReactions, comments, user } from "@/db/schema";
import { auth } from "@/lib/auth";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  inArray,
  lt,
  or,
} from "drizzle-orm";
import { headers } from "next/headers";
import z from "zod";

export const commentRouter = createTRPCRouter({
  remove: protectedProcedure
    .input(
      z.object({
        videoId: z.string(),
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { videoId, id } = input;
      const { id: userId } = ctx.session.user;

      const [deleteComments] = await db
        .delete(comments)
        .where(
          and(
            eq(comments.videoId, videoId),
            eq(comments.userId, userId),
            eq(comments.id, id)
          )
        )
        .returning();

      if (!deleteComments) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return deleteComments;
    }),

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
    .input(
      z.object({
        videoId: z.string(),
        cursor: z
          .object({
            id: z.string().nanoid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input }) => {
      const { videoId, cursor, limit } = input;

      const currentUser = await auth.api.getSession({
        headers: await headers(),
      });

      const currentUserId = currentUser?.user.id;

      let userId;

      const [userActive] = await db
        .select()
        .from(user)
        .where(inArray(user.id, currentUserId ? [currentUserId] : []));

      if (userActive) {
        userId = userActive.id;
      }

      const viewerReactions = db.$with("viewer_reactions").as(
        db
          .select({
            commentId: commentReactions.commentId,
            type: commentReactions.type,
          })
          .from(commentReactions)
          .where(inArray(commentReactions.userId, userId ? [userId] : []))
      );

      const [totalData, data] = await Promise.all([
        db
          .select({
            count: count(),
          })
          .from(comments)
          .where(eq(comments.videoId, videoId)),
        await db
          .with(viewerReactions)
          .select({
            ...getTableColumns(comments),
            user: user,
            likeCount: db.$count(
              commentReactions,
              and(
                eq(commentReactions.type, "like"),
                eq(commentReactions.commentId, comments.id)
              )
            ),
            dislikeCount: db.$count(
              commentReactions,
              and(
                eq(commentReactions.type, "dislike"),
                eq(commentReactions.commentId, comments.id)
              )
            ),
            viewerReactions: viewerReactions.type,
          })
          .from(comments)
          .where(
            and(
              eq(comments.videoId, videoId),
              cursor
                ? or(
                    lt(comments.updatedAt, cursor.updatedAt),
                    and(
                      eq(comments.updatedAt, cursor.updatedAt),
                      lt(comments.id, cursor.id)
                    )
                  )
                : undefined
            )
          )
          .innerJoin(user, eq(comments.userId, user.id))
          .leftJoin(viewerReactions, eq(comments.id, viewerReactions.commentId))
          .orderBy(desc(comments.updatedAt), desc(comments.id))
          .limit(limit + 1),
      ]);

      const hasMore = data.length > limit;

      const items = hasMore ? data.slice(0, -1) : data;

      const lastItem = items[items.length - 1];

      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
          }
        : null;

      return {
        totalData: totalData[0].count,
        items,
        nextCursor,
      };
    }),
});
