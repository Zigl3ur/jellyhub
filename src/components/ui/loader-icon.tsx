import { cn } from "@sglara/cn";
import { LoaderCircle } from "lucide-react";

export default function LoaderIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <LoaderCircle
      {...props}
      className={cn("animate-spin size-4.5", className)}
    />
  );
}
