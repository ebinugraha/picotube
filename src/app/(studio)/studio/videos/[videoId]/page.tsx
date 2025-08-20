import { VideoView } from "@/modules/studio/ui/views/video-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ videoId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { videoId } = await params;

  Promise.all([
    prefetch(trpc.studio.getOne.queryOptions({ id: videoId })),
    prefetch(trpc.category.getMany.queryOptions()),
  ]);

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
};

export default Page;
