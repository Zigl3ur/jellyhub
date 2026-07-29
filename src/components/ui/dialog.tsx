import { Dialog as BaseDialog } from "@base-ui/react";
import { cn } from "@sglara/cn";
import { X } from "lucide-react";
import Button from "./button";
import type { PropsWithChildren } from "react";

export function Dialog({ children, ...props }: BaseDialog.Root.Props) {
  return <BaseDialog.Root {...props}>{children}</BaseDialog.Root>;
}

export function DialogTrigger({
  children,
  ...props
}: BaseDialog.Trigger.Props) {
  return <BaseDialog.Trigger {...props}>{children}</BaseDialog.Trigger>;
}

export function DialogContent({
  className,
  children,
  ...props
}: BaseDialog.Popup.Props) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Viewport>
        <BaseDialog.Backdrop className="fixed inset-0 min-h-dvh bg-black/10 backdrop-blur-[2px] transition-[opacity,backdrop-filter] duration-200 data-ending-style:opacity-0 data-ending-style:backdrop-blur-none data-starting-style:opacity-0 data-starting-style:backdrop-blur-none supports-[-webkit-touch-callout:none]:absolute" />
        <BaseDialog.Popup
          {...props}
          className={cn(
            "bg-accent-foreground flex flex-col gap-2 border-muted fixed w-full sm:max-w-sm top-1/2 py-2 px-4 max-w-[calc(100%-2rem)] left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 overflow-hidden border rounded text-sm shadow-lg transition-all duration-200 data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0",
            className,
          )}
        >
          <BaseDialog.Close>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
            >
              <X />
            </Button>
          </BaseDialog.Close>
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Viewport>
    </BaseDialog.Portal>
  );
}

export function DialogTitle({
  className,
  children,
  ...props
}: BaseDialog.Title.Props) {
  return (
    <BaseDialog.Title
      {...props}
      className={cn("text-xl font-semibold", className)}
    >
      {children}
    </BaseDialog.Title>
  );
}
export function DialogDescription({
  className,
  children,
  ...props
}: BaseDialog.Description.Props) {
  return (
    <BaseDialog.Description
      {...props}
      className={cn("text-sm opacity-45", className)}
    >
      {children}
    </BaseDialog.Description>
  );
}

export function DialogHeader({ className, children }: DialogFooterProps) {
  return <div className={className}>{children}</div>;
}

interface DialogFooterProps extends PropsWithChildren {
  className?: string;
}

export function DialogFooter({ className, children }: DialogFooterProps) {
  return (
    <div
      className={cn(
        "border-t -mx-4 -mb-2 border-muted rounded-t px-4 py-2 bg-accent/45",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DialogClose({ children, ...props }: BaseDialog.Close.Props) {
  return <BaseDialog.Close {...props}>{children}</BaseDialog.Close>;
}
