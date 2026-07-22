import { cn } from "@sglara/cn";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import type { PropsWithChildren } from "react";

interface BadgeProps extends PropsWithChildren<
  useRender.ComponentProps<"div">
> {
  className?: string;
  variant?: "default" | "destructive";
}

const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "border border-input bg-background/10",
  destructive: "",
};

export default function Badge({
  render,
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const element = useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      {
        className: cn(
          "rounded w-fit flex gap-1 items-center px-2 py-px text-sm",
          variants[variant],
          className,
        ),
      },
      props,
    ),
  });

  return element;
}
