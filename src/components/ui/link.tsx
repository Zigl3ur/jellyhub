import { cn } from "@sglara/cn";
import { Link as RouterLink } from "@tanstack/react-router";
import { SquareArrowOutUpRight } from "lucide-react";
import type { LinkProps as RouterLinkProps } from "@tanstack/react-router";
import type { AnchorHTMLAttributes } from "react";

interface LinkProps {
  className?: string;
  variant?: "default" | "outline" | "link" | "unstyled";
}

const variants: Record<NonNullable<LinkProps["variant"]>, string> = {
  default: "hover:underline text-blue-500",
  outline:
    "px-1.5 flex gap-1 items-center py-1 select-none data-[status='active']:bg-primary rounded-lg transition-colors duration-200 data-[status='active']:text-accent-foreground not-data-[status='active']:hover:bg-accent",
  link: "text-blue-500 hover:opacity-75 transition-opacity duration-200 inline-flex items-center gap-1 leading-none",
  unstyled: "",
};

export function Link({
  className,
  variant = "default",
  children,
  ...props
}: LinkProps & RouterLinkProps) {
  return (
    <RouterLink {...props} className={cn(variants[variant], className)}>
      {children}
    </RouterLink>
  );
}

export function ExternalLink({
  className,
  variant = "default",
  children,
  ...props
}: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      className={cn(variants[variant], className)}
      rel="noopener noreferrer"
    >
      <>
        {children}
        {variant === "link" && (
          <SquareArrowOutUpRight className="size-3.25 shrink-0" />
        )}
      </>
    </a>
  );
}
