import { ResponsiveDialog } from "@/components/responsive-dialog";
import { UploadDropzone } from "@/lib/uploadthing";
import { useTRPC } from "@/trpc/client";
import { useQueryClient } from "@tanstack/react-query";

interface ThumbnailUploadModalProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ThumbnailUploadModal = ({
  onOpenChange,
  open,
  videoId,
}: ThumbnailUploadModalProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const onUploadComplete = async () => {
    await queryClient.invalidateQueries(
      trpc.studio.getMany.infiniteQueryOptions({
        limit: 5,
      })
    );
    await queryClient.invalidateQueries(
      trpc.studio.getOne.queryOptions({
        id: videoId,
      })
    );
  };

  return (
    <ResponsiveDialog
      title="Upload a thumbnail"
      open={open}
      onOpenChange={onOpenChange}
    >
      <UploadDropzone
        endpoint={"thumbnailUploader"}
        input={{ videoId }}
        onClientUploadComplete={onUploadComplete}
      />
    </ResponsiveDialog>
  );
};
