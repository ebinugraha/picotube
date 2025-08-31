import Link from "next/link";
import { VideoGetOneOutput } from "../../types";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { SubscriptionButton } from "@/modules/subscription/ui/components/subscription-button";
import { useSubscription } from "@/modules/subscription/hooks/use-subscription";
interface VideoOwnerProps {
  user: VideoGetOneOutput["user"];
  videoId: string;
}

export const VideoOwner = ({ user, videoId }: VideoOwnerProps) => {
  const userId = authClient.useSession().data?.user;

  const { isPending, onClick } = useSubscription({
    userId: user.id,
    isSubscribed: user.viewerSubscribe,
    fromVideoId: videoId,
  });

  return (
    <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0">
      <Link href={`/users/${user.id}`}>
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-12 w-12 rounded-full">
            <Image src={user.image!} height={48} width={48} alt="test" />
          </Avatar>
          <div className="flex flex-col ">
            {user.name}
            <span className="text-sm text-muted-foreground  line-clamp-1">
              {user.subscriberCount} Subscriber
            </span>
          </div>
        </div>
      </Link>
      {!!userId ? (
        userId.id === user.id ? (
          <Button variant={"secondary"} className="rounded-full" asChild>
            <Link href={`/studio/videos/${videoId}`}>Edit Video</Link>
          </Button>
        ) : (
          <SubscriptionButton
            onClick={onClick}
            disabled={isPending}
            isSubscripbed={user.viewerSubscribe}
            className=""
          />
        )
      ) : (
        <SubscriptionButton
          onClick={onClick}
          disabled={isPending}
          isSubscripbed={user.viewerSubscribe}
          className=""
        />
      )}
    </div>
  );
};
