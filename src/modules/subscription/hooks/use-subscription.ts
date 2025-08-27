"use client";

import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UseSubscriptionProps {
  userId: string;
  isSubscribed: boolean;
  fromVideoId?: string;
}

export const useSubscription = ({
  userId,
  isSubscribed,
  fromVideoId,
}: UseSubscriptionProps) => {
  const auth = authClient.useSession().data?.user;
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const subscribe = useMutation(
    trpc.subscription.create.mutationOptions({
      onSuccess: async () => {
        toast.success("Subscribed");
        if (fromVideoId) {
          await queryClient.invalidateQueries(
            trpc.videos.getOne.queryOptions({ id: fromVideoId })
          );
        }
      },
      onError: (error) => {
        toast.error("something went wrong");
        if (error.data?.code === "UNAUTHORIZED") {
          router.push("/sign-in");
        }
      },
    })
  );

  const unSubscribe = useMutation(
    trpc.subscription.remove.mutationOptions({
      onSuccess: async () => {
        toast.success("Unsubscribed");
        if (fromVideoId) {
          await queryClient.invalidateQueries(
            trpc.videos.getOne.queryOptions({ id: fromVideoId })
          );
        }
      },
      onError: (error) => {
        toast.error("something went wrong");
        if (error.data?.code === "UNAUTHORIZED") {
          router.push("/sign-in");
        }
      },
    })
  );

  const isPending = subscribe.isPending || unSubscribe.isPending;

  const onClick = () => {
    if (isSubscribed) {
      unSubscribe.mutate({ userId });
    } else {
      subscribe.mutate({ userId });
    }
  };

  return {
    isPending,
    onClick,
  };
};
