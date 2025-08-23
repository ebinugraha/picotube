import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SubscriptionButtonProps {
  onClick: () => void;
  disabled: boolean;
  isSubscripbed: boolean;
  className?: string;
  size?: "default" | "icon" | "lg" | "sm";
}

export const SubscriptionButton = ({
  onClick,
  disabled,
  isSubscripbed,
  className,
  size,
}: SubscriptionButtonProps) => {
  return (
    <Button
      size={size}
      variant={isSubscripbed ? "secondary" : "default"}
      className={cn("rounded-full", className)}
      onClick={onClick}
      disabled={disabled}
    >
      {isSubscripbed ? "Unsubscribe" : "Subscribe"}
    </Button>
  );
};
