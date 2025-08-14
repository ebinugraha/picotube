import { useTRPC } from "@/trpc/client";
import { caller, trpc } from "@/trpc/server";
import { useSuspenseQuery } from "@tanstack/react-query";

export default async function Home() {
  const greeting = await caller.hello({
    text: "world",
  });
  //    ^? { greeting: string }
  return <div>{greeting.greeting}</div>;
}
