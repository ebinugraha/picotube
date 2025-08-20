import { FormSection } from "../section/form-section";

interface VideoViewProps {
  videoId: string;
}

export const VideoView = ({ videoId }: VideoViewProps) => {
  return (
    <div className="px-4 pt-2.5 max-w-7xl">
      <FormSection videoId={videoId} />
    </div>
  );
};
