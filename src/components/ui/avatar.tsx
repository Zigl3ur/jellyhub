import { Avatar } from "@base-ui/react/avatar";
import { cn } from "@sglara/cn";

export function AvatarRoot({
  className,
  children,
  ...props
}: Avatar.Root.Props) {
  return (
    <Avatar.Root
      {...props}
      className={cn(
        "inline-flex size-8 items-center justify-center border border-background overflow-hidden rounded bg-accent-foreground align-middle text-sm leading-none font-normal text-foreground select-none",
        className,
      )}
    >
      {children}
    </Avatar.Root>
  );
}

export function AvatarImg({ className, ...props }: Avatar.Image.Props) {
  return (
    <Avatar.Image
      {...props}
      className={cn("size-full object-cover", className)}
    />
  );
}

export function AvatarFallback({
  className,
  children,
  ...props
}: Avatar.Fallback.Props) {
  return (
    <Avatar.Fallback
      {...props}
      className={cn(
        "flex size-full items-center justify-center text-sm",
        className,
      )}
    >
      {children}
    </Avatar.Fallback>
  );
}
