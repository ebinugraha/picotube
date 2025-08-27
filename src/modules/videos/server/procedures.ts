import db from "@/db";
import {
  subscriptions,
  user,
  videoReactions,
  videos,
  videoUpdateSchema,
  videoViews,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { mux } from "@/lib/mux";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns, inArray, isNotNull } from "drizzle-orm";
import { headers } from "next/headers";
import { UTApi } from "uploadthing/server";
import z from "zod";

export const videosRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const userAuth = await auth.api.getSession({
        headers: await headers(),
      });

      const userId = userAuth?.user.id;

      let userIdAuth;

      const [currentUser] = await db
        .select()
        .from(user)
        .where(inArray(user.id, userId ? [userId] : []));

      if (currentUser) {
        userIdAuth = currentUser.id;
      }

      const viewerReactions = db.$with("viewer_reactions").as(
        db
          .select({
            videoId: videoReactions.videoId,
            type: videoReactions.type,
          })
          .from(videoReactions)
          .where(inArray(videoReactions.userId, userIdAuth ? [userIdAuth] : []))
      );

      const viewerSubscription = db.$with("viewer_subscription").as(
        db
          .select()
          .from(subscriptions)
          .where(
            inArray(subscriptions.viewerId, userIdAuth ? [userIdAuth] : [])
          )
      );

      // console.log("hasil : ", viewerSubscription);

      const [existingVideo] = await db
        .with(viewerReactions, viewerSubscription)
        .select({
          ...getTableColumns(videos),
          user: {
            ...getTableColumns(user),
            subscriberCount: db.$count(
              subscriptions,
              eq(subscriptions.creatorId, user.id)
            ),
            viewerSubscribe: isNotNull(viewerSubscription.viewerId).mapWith(
              Boolean
            ),
          },
          viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
          likeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "like")
            )
          ),
          dislikeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "dislike")
            )
          ),
          viewerReaction: viewerReactions.type,
        })
        .from(videos)
        .innerJoin(user, eq(user.id, videos.userId))
        .leftJoin(viewerReactions, eq(viewerReactions.videoId, videos.id))
        .leftJoin(viewerSubscription, eq(viewerSubscription.creatorId, user.id))
        .where(eq(videos.id, input.id));

      if (!existingVideo) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return existingVideo;
    }),

  restoreThumbnailUrl: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.session.user;

      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      if (!input.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const [existingVideo] = await db
        .select()
        .from(videos)
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)));

      if (!existingVideo) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      if (existingVideo.thumbnailKey) {
        const utapi = new UTApi();

        await utapi.deleteFiles(existingVideo.thumbnailKey);
        await db
          .update(videos)
          .set({
            thumbnailUrl: null,
            thumbnailKey: null,
          })
          .where(and(eq(videos.id, input.id), eq(videos.userId, userId)));
      }

      const thumbnailUrlTemp = `https://image.mux.com/${existingVideo.muxPlayBackId}/thumbnail.jpg`;

      const utapi = new UTApi();
      const uploadedThumbnail = await utapi.uploadFilesFromUrl(
        thumbnailUrlTemp
      );

      if (!uploadedThumbnail.data) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      const { key: thumbnailKey, ufsUrl: thumbnailUrl } =
        await uploadedThumbnail.data;

      const [updatedVideo] = await db
        .update(videos)
        .set({ thumbnailUrl, thumbnailKey })
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
        .returning();

      return updatedVideo;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.session.user;

      if (!input.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const [deletedVideo] = await db
        .delete(videos)
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
        .returning();

      if (!deletedVideo) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      return deletedVideo;
    }),

  update: protectedProcedure
    .input(videoUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.session.user;

      if (!input.id) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const [updatedVideo] = await db
        .update(videos)
        .set({
          title: input.title,
          description: input.description,
          categoryId: input.categoryId,
          visibility: input.visibility,
          updatedAt: new Date(),
        })
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
        .returning();

      if (!updatedVideo) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.session.user;

    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        passthrough: userId,
        playback_policies: ["public"],
      },
      cors_origin: "*",
    });

    const [video] = await db
      .insert(videos)
      .values({
        userId,
        title: "untilted",
        muxStatus: "waiting",
        muxUploadId: upload.id,
      })
      .returning();
    return {
      video: video,
      url: upload.url,
    };
  }),
});
