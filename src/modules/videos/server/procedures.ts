import db from "@/db";
import { videos, videoUpdateSchema } from "@/db/schema";
import { mux } from "@/lib/mux";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import z from "zod";

export const videosRouter = createTRPCRouter({
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
