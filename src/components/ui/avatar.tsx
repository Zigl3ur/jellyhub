import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import { cn } from "@sglara/cn";

export function Avatar({
  className,
  children,
  ...props
}: BaseAvatar.Root.Props) {
  return (
    <BaseAvatar.Root
      {...props}
      className={cn(
        "inline-flex size-8 items-center justify-center border border-muted overflow-hidden rounded bg-accent-foreground align-middle text-sm leading-none font-normal text-foreground select-none",
        className,
      )}
    >
      {children}
    </BaseAvatar.Root>
  );
}

export function AvatarImg({ className, ...props }: BaseAvatar.Image.Props) {
  return (
    <BaseAvatar.Image
      {...props}
      className={cn("size-full object-cover", className)}
    />
  );
}

export function AvatarFallback({
  className,
  children,
  ...props
}: BaseAvatar.Fallback.Props) {
  return (
    <BaseAvatar.Fallback
      {...props}
      className={cn(
        "flex size-full items-center justify-center text-sm",
        className,
      )}
    >
      {children}
    </BaseAvatar.Fallback>
  );
}
