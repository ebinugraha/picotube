import { DEFAULT_LIMIT } from "@/constant";
import { VideoView } from "@/modules/videos/ui/views/video-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

interface PageProps {
  params: Promise<{
    videoId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { videoId } = await params;

  Promise.all([
    prefetch(trpc.videos.getOne.queryOptions({ id: videoId })),
    prefetch(
      trpc.comments.getMany.infiniteQueryOptions({
        limit: DEFAULT_LIMIT,
        videoId,
      })
    ),
  ]);

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
};

export default Page;
