import { Popover as BasePopover } from "@base-ui/react";
import { cn } from "@sglara/cn";
import { useEffect } from "react";
import type { PropsWithChildren } from "react";

export function Popover({ children, ...props }: BasePopover.Root.Props) {
  return <BasePopover.Root {...props}>{children}</BasePopover.Root>;
}

export function PopoverTrigger({
  className,
  children,
  ...props
}: BasePopover.Trigger.Props) {
  return (
    <BasePopover.Trigger
      {...props}
      className={cn("hover:cursor-pointer", className)}
    >
      {children}
    </BasePopover.Trigger>
  );
}

interface PopoverContentProps extends PropsWithChildren<BasePopover.Positioner.Props> {
  closeOnScroll?: (open: boolean) => void;
  portalContainer?: HTMLElement | null;
  sideOffset?: number;
  className?: string;
}

export function PopoverContent({
  closeOnScroll,
  children,
  className,
  portalContainer,
  ...props
}: PopoverContentProps) {
  useEffect(() => {
    if (!closeOnScroll) return;

    const handleScroll = () => closeOnScroll(false);
    document.addEventListener("scroll", handleScroll);

    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <BasePopover.Portal container={portalContainer}>
      <BasePopover.Positioner
        {...props}
        sideOffset={props.sideOffset ?? 8}
        positionMethod="fixed"
      >
        <BasePopover.Popup
          className={cn(
            "bg-accent-foreground rounded outline-none pointer-events-auto origin-[--transform-origin] w-full border border-accent px-2.5 py-2 min-w-(--anchor-width) shadow-lg transition-[opacity,transform] duration-150 data-ending-style:scale-98 data-ending-style:opacity-0 data-starting-style:scale-98 data-starting-style:opacity-0",
            className,
          )}
        >
          {children}
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
}
