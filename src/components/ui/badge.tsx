import { cn } from "@sglara/cn";
import type { PropsWithChildren } from "react";

interface BadgeProps extends PropsWithChildren {
  className?: string;
  variant?: "default" | "destructive";
}

const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "border border-input bg-background/10",
  destructive: "",
};

export default function Badge({
  variant = "default",
  className,
  children,
}: BadgeProps) {
  return (
    <div
      className={cn("rounded flex gap-1 items-center px-2 py-px text-sm", variants[variant], className)}
    >
      {children}
    </div>
  );
}
