import Link from "next/link";
import { CommentGetManyOutput } from "../../types";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

interface CommentItemProps {
  comment: CommentGetManyOutput[number];
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <div>
      <div className="flex gap-4">
        <Link href={`/users/${comment.userId}`}>
          <Avatar className="h-8 w-8 rounded-full">
            <Image
              src={comment.user.image!}
              height={40}
              width={40}
              alt="test"
            />
          </Avatar>
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/users/${comment.userId}`}>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-medium text-sm pb-0.5">
                {comment.user.name}
              </span>
              <span className="text-xs text-m">
                {formatDistanceToNow(comment.createdAt, {
                  addSuffix: true,
                })}
              </span>
            </div>
          </Link>
          <p className="text-sm">{comment.value}</p>
        </div>
      </div>
    </div>
  );
};
