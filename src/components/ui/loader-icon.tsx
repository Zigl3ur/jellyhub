import { IconLoader2 } from "@tabler/icons-react";

export default function LoaderIcon({
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return <IconLoader2 className="animate-spin size-4.5" {...props} />;
}
