import { cn } from "@sglara/cn";

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("bg-muted animate-pulse rounded", className)} />;
}
