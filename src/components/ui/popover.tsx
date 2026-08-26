import { Popover as BasePopover } from "@base-ui/react";
import { cn } from "@sglara/cn";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { PopoverRootChangeEventDetails } from "@base-ui/react";
import type { PropsWithChildren, Ref } from "react";

interface PopoverContextProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  popoverContentRef: Ref<HTMLDivElement | null>;
}

const PopoverContext = createContext<PopoverContextProps | undefined>(
  undefined,
);

function usePopoverContext() {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error("usePopoverContext must be used withint a PopoverContext");
  }
  return context;
}

interface PopoverProps extends BasePopover.Root.Props {
  closeOnScroll?: boolean;
}

export function Popover({
  open,
  onOpenChange,
  closeOnScroll = false,
  children,
  ...props
}: PopoverProps) {
  const [uncrontrolledState, setUncontrolledState] = useState(false);
  const popoverContentRef = useRef<HTMLDivElement | null>(null);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : uncrontrolledState;

  const setOpen = useCallback(
    (state: boolean, eventDetails?: PopoverRootChangeEventDetails) => {
      if (!isControlled) setUncontrolledState(state);
      onOpenChange?.(state, eventDetails as PopoverRootChangeEventDetails);
    },
    [isControlled, onOpenChange],
  );

  useEffect(() => {
    if (!closeOnScroll || !isOpen) return;

    const handleScroll = (event: Event) => {
      console.log(event.target);
      if (!popoverContentRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("scroll", handleScroll, { capture: true });

    return () =>
      document.removeEventListener("scroll", handleScroll, { capture: true });
  }, [closeOnScroll, isOpen, setOpen]);

  return (
    <PopoverContext value={{ open: isOpen, setOpen, popoverContentRef }}>
      <BasePopover.Root {...props} open={isOpen} onOpenChange={setOpen}>
        {children}
      </BasePopover.Root>
    </PopoverContext>
  );
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

interface PopoverContentProps extends BasePopover.Positioner.Props {
  portalContainer?: HTMLElement | null;
}

export function PopoverContent({
  children,
  className,
  portalContainer,
  sideOffset,
  ...props
}: PopoverContentProps) {
  const { popoverContentRef } = usePopoverContext();

  return (
    <BasePopover.Portal container={portalContainer}>
      <BasePopover.Positioner
        {...props}
        sideOffset={sideOffset ?? 8}
        positionMethod="fixed"
      >
        <BasePopover.Popup
          ref={popoverContentRef}
          className={cn(
            "bg-accent-foreground rounded outline-none pointer-events-auto origin-[--transform-origin] w-full border border-muted px-2.5 py-2 min-w-(--anchor-width) shadow-lg transition-[opacity,transform] duration-150 data-ending-style:scale-98 data-ending-style:opacity-0 data-starting-style:scale-98 data-starting-style:opacity-0",
            className,
          )}
        >
          {children}
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
}
