import { cn } from "@sglara/cn";
import { IconLoader2 } from "@tabler/icons-react";

export default function LoaderIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <IconLoader2
      {...props}
      className={cn("animate-spin size-4.5", className)}
    />
  );
}
