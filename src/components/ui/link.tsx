import { cn } from "@sglara/cn";
import { Link as RouterLink } from "@tanstack/react-router";
import type { LinkProps as RouterLinkProps } from "@tanstack/react-router";

interface LinkProps extends RouterLinkProps {
  className?: string;
}

export default function Link({ className, children, ...props }: LinkProps) {
  return (
    <RouterLink
      {...props}
      className={cn(
        "px-1.5 flex gap-1 items-center py-1 data-[status='active']:bg-primary rounded-lg transition-colors duration-200 data-[status='active']:text-accent-foreground not-data-[status='active']:hover:bg-accent",
        className,
      )}
    >
      {children}
    </RouterLink>
  );
}
