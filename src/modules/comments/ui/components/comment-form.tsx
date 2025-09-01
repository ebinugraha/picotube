import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_LIMIT } from "@/constant";
import { commentInsertSchema } from "@/db/schema";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface CommentFormProps {
  videoId: string;
  onSuccess?: () => void;
}

export const CommentForm = ({ videoId, onSuccess }: CommentFormProps) => {
  const { data, isPending } = authClient.useSession();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof commentInsertSchema>>({
    resolver: zodResolver(commentInsertSchema),
    defaultValues: {
      videoId,
      value: "",
    },
  });

  const create = useMutation(
    trpc.comments.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.comments.getMany.infiniteQueryOptions({
            videoId: videoId,
            limit: DEFAULT_LIMIT,
          })
        );
        form.reset();
        toast.success("comment added");
        onSuccess?.();
      },
    })
  );

  if (!data) {
    return <div>you must logged in</div>;
  }

  const handleSubmit = (value: z.infer<typeof commentInsertSchema>) => {
    create.mutateAsync(value);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex gap-4 group"
      >
        <Avatar className="h-8 w-8 rounded-full">
          <Image src={data.user.image!} height={40} width={40} alt="test" />
        </Avatar>
        <div className="w-full flex flex-1 flex-col">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Add a comments..."
                    className="resize-none bg-transparent overflow-hidden min-h-0"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="justify-end gap-2 mt-2 flex">
            <Button disabled={create.isPending}>Comment</Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
