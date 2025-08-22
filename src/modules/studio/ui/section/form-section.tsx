"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  CopyCheckIcon,
  CopyIcon,
  Globe2Icon,
  ImagePlus,
  LockIcon,
  MoreVertical,
  RotateCcwIcon,
  Sparkles,
  TrashIcon,
} from "lucide-react";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { videoUpdateSchema } from "@/db/schema";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_LIMIT } from "@/constant";
import { toast } from "sonner";
import { VideoPlayer } from "../components/video-player";
import Link from "next/link";
import { snakeCaseToTitle } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/types";
import { ThumbnailUploadModal } from "../components/thumbnail-upload-modal";

interface FormSectionProps {
  videoId: string;
}

export const FormSection = ({ videoId }: FormSectionProps) => {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <FormSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

export const FormSectionSuspense = ({ videoId }: FormSectionProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const { data: video } = useSuspenseQuery(
    trpc.studio.getOne.queryOptions({
      id: videoId,
    })
  );

  const { data: categories } = useSuspenseQuery(
    trpc.category.getMany.queryOptions()
  );

  const update = useMutation(
    trpc.videos.update.mutationOptions({
      onSuccess: () => {
        Promise.all([
          queryClient.invalidateQueries(
            trpc.studio.getMany.infiniteQueryOptions({
              limit: DEFAULT_LIMIT,
            })
          ),
          queryClient.invalidateQueries(
            trpc.studio.getOne.queryOptions({
              id: videoId,
            })
          ),
        ]);
        toast.success("Update completed");
      },
      onError: (error) => {
        toast.error("Something went wrong");
      },
    })
  );

  const deleteVideo = useMutation(
    trpc.videos.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.studio.getMany.infiniteQueryOptions({
            limit: DEFAULT_LIMIT,
          })
        );
        router.push(`/studio/`);
      },
      onError: (error) => {
        toast.error("Something went wrong");
      },
    })
  );

  const restoreVideo = useMutation(
    trpc.videos.restoreThumbnailUrl.mutationOptions({
      onSuccess: async () => {
        Promise.all([
          queryClient.invalidateQueries(
            trpc.studio.getMany.infiniteQueryOptions({
              limit: DEFAULT_LIMIT,
            })
          ),
          queryClient.invalidateQueries(
            trpc.studio.getOne.queryOptions({
              id: videoId,
            })
          ),
        ]);
        toast.success("Restore completed");
      },
      onError: (error) => {
        toast.error("Something went wrong");
      },
    })
  );

  const form = useForm<z.infer<typeof videoUpdateSchema>>({
    resolver: zodResolver(videoUpdateSchema),
    defaultValues: video,
  });

  const onSubmit = async (data: z.infer<typeof videoUpdateSchema>) => {
    await update.mutateAsync(data);
  };

  const fullUrl = `${
    process.env.VERCEL_URL || "http://localhost:3000"
  }/videos/${videoId}`;

  const onCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <>
      <ThumbnailUploadModal
        onOpenChange={setOpen}
        open={open}
        videoId={video.id}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Video details</h1>
              <p className="text-xs text-muted-foreground">
                Manage your video details
              </p>
            </div>
            <div className="flex items-center gap-x-2">
              <Button type="submit" disabled={false}>
                Save
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"} size={"icon"}>
                    <MoreVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="bottom">
                  <DropdownMenuItem
                    onClick={() => deleteVideo.mutateAsync({ id: video.id })}
                  >
                    <TrashIcon className="size-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="space-y-8 lg:col-span-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Add a title to your video"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ""}
                        rows={10}
                        className="resize-none pr-10 h-52"
                        placeholder="Add a description to your video"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="thumbnailUrl"
                render={() => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <div className="p-0.5 border rounded-sm overflow-hidden border-dashed border-neutral-400 relative h-[84px] w-[153px] group">
                        <Image
                          src={video.thumbnailUrl ?? THUMBNAIL_FALLBACK}
                          alt="Thumbnail"
                          fill
                          className="object-cover"
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              size={"icon"}
                              className="bg-black/50 hover:bg-black/50 absolute right-1 top-1 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 duration-300 size-7"
                            >
                              <MoreVertical />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" side="right">
                            <DropdownMenuItem onClick={() => setOpen(true)}>
                              <ImagePlus className="text-black mr-2 size-4" />
                              Change
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Sparkles className="text-black mr-2 size-4" />
                              AI-generated
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                restoreVideo.mutate({
                                  id: videoId,
                                })
                              }
                            >
                              <RotateCcwIcon className="text-black mr-2 size-4" />
                              Restore
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                        {/* <SelectItem value="something">Something</SelectItem> */}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-y-8 lg:col-span-2">
              <div className="flex flex-col gap-4 bg-[#f9f9f9] rounded-xl overflow-hidden h-fit">
                <div className="aspect-video overflow-hidden relative">
                  <VideoPlayer
                    playbackId={video.muxPlayBackId}
                    thumbnailUrl={video.thumbnailUrl}
                    onPlay={() => {}}
                  />
                </div>
                <div className="p-4 flex flex-col gap-y-6">
                  <div className="flex justify-between items-center gap-x-2">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-muted-foreground text-xs">
                        Video Link
                      </p>
                      <div className="flex items-center gap-x-2">
                        <Link href={`/videos/${video.id}`}>
                          <p className="line-clamp-1 text-blue-500">
                            {fullUrl}
                          </p>
                        </Link>
                        <Button
                          type="button"
                          variant={"ghost"}
                          size={"icon"}
                          className="shrink-0 cursor-pointer"
                          onClick={onCopy}
                          disabled={isCopied}
                        >
                          {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-y-1">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-muted-foreground text-xs">
                        Video status
                      </p>
                      <span className="text-sm">
                        {snakeCaseToTitle(video.muxStatus || "preparing")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-y-1">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-muted-foreground text-xs">
                        Subtitle status
                      </p>
                      <span className="text-sm">
                        {snakeCaseToTitle("no subtitle")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={"public"}>
                          <div className="flex gap-x-2 items-center">
                            <Globe2Icon />
                            Public
                          </div>
                        </SelectItem>
                        <SelectItem value={"private"}>
                          <div className="flex gap-x-2 items-center">
                            <LockIcon />
                            Private
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};
