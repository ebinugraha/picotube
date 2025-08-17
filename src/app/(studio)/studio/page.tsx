import { HydrateClient } from "@/trpc/server";

export const dynamic = "force-dynamic";

const Page = async () => {
  return <HydrateClient>test</HydrateClient>;
};

export default Page;
