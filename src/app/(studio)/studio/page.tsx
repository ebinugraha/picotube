import { DEFAULT_LIMIT } from "@/constant";
import { StudioView } from "@/modules/studio/ui/views/studio-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

const Page = async () => {
  await prefetch(
    trpc.studio.getMany.infiniteQueryOptions({
      limit: DEFAULT_LIMIT,
    })
  );

  return (
    <HydrateClient>
      <StudioView />
    </HydrateClient>
  );
};

export default Page;
