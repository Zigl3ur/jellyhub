import { Menu as BaseMenu } from "@base-ui/react/menu";
import { cn } from "@sglara/cn";
import { buttonClassName, buttonVariants } from "./button";
import type { ButtonProps } from "./button";
import type { PropsWithChildren } from "react";

export function Menu({ children, ...props }: BaseMenu.Root.Props) {
  return <BaseMenu.Root {...props}>{children}</BaseMenu.Root>;
}

export function MenuTrigger({ children, ...props }: BaseMenu.Trigger.Props) {
  return <BaseMenu.Trigger {...props}>{children}</BaseMenu.Trigger>;
}

interface MenuContentProps extends PropsWithChildren {
  className?: string;
  positionerProps?: BaseMenu.Positioner.Props;
  popupProps?: BaseMenu.Popup.Props;
}

export function MenuContent({
  className,
  children,
  positionerProps,
  popupProps,
}: MenuContentProps) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner {...positionerProps}>
        <BaseMenu.Popup
          {...popupProps}
          className={cn(
            "bg-accent-foreground space-y-1 rounded outline-none pointer-events-auto origin-[--transform-origin] border border-muted p-1.5 min-w-(--anchor-width) shadow-lg transition-[opacity,transform] duration-150 data-ending-style:scale-98 data-ending-style:opacity-0 data-starting-style:scale-98 data-starting-style:opacity-0",
            className,
          )}
        >
          {children}
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

interface MenuItemProps
  extends BaseMenu.Item.Props, Pick<ButtonProps, "variant"> {}

export function MenuItem({
  children,
  className,
  variant = "ghost",
  ...props
}: MenuItemProps) {
  return (
    <BaseMenu.Item
      {...props}
      className={cn(
        buttonClassName,
        buttonVariants[variant],
        "h-7.5 px-1.5 py-1 w-full text-sm justify-start active:translate-none",
        className,
      )}
    >
      {children}
    </BaseMenu.Item>
  );
}

export function MenuSeparator({
  className,
  ...props
}: BaseMenu.Separator.Props) {
  return (
    <BaseMenu.Separator
      {...props}
      className={cn("h-px bg-muted w-full", className)}
    />
  );
}

export function MenuGroup({
  children,
  className,
  ...props
}: BaseMenu.Group.Props) {
  return (
    <BaseMenu.Group {...props} className={cn("flex flex-col gap-1", className)}>
      {children}
    </BaseMenu.Group>
  );
}

export function MenuGroupLabel({
  className,
  children,
  ...props
}: BaseMenu.GroupLabel.Props) {
  return (
    <BaseMenu.GroupLabel
      {...props}
      className={cn("opacity-70 px-1.5 py-1 text-sm", className)}
    >
      {children}
    </BaseMenu.GroupLabel>
  );
}
