import { cn } from "@sglara/cn";
import type { PropsWithChildren } from "react";

interface CardProps extends PropsWithChildren {
  className?: string;
}

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded border border-muted bg-accent-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: CardProps) {
  return (
    <div className={cn("flex items-center gap-1.5 px-3 py-2", className)}>
      {children}
    </div>
  );
}

export function CardContent({ className, children }: CardProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col gap-4 rounded border-t border-muted bg-accent/45 p-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
