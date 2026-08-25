import { Select as BaseSelect } from "@base-ui/react/select";
import { cn } from "@sglara/cn";
import { Check, ChevronDown } from "lucide-react";

export function Select<T>({ children, ...props }: BaseSelect.Root.Props<T>) {
  return <BaseSelect.Root {...props}>{children}</BaseSelect.Root>;
}

export function SelectLabel({
  className,
  children,
  ...props
}: BaseSelect.Label.Props) {
  return (
    <BaseSelect.Label
      {...props}
      className={cn("opacity-75 text-sm mb-1", className)}
    >
      {children}
    </BaseSelect.Label>
  );
}

export function SelectTrigger({
  className,
  children,
  ...props
}: BaseSelect.Trigger.Props) {
  return (
    <BaseSelect.Trigger
      {...props}
      className={cn(
        "flex h-8 items-center justify-between gap-3 pl-2 pr-1 text-sm whitespace-nowrap transition-colors duration-200 border border-input bg-input/40 hover:bg-input/60 focus:ring-ring/40 rounded px-2 py-1",
        className,
      )}
    >
      {children}
      <BaseSelect.Icon className="data-popup-open:rotate-180 transition-transform duration-200">
        <ChevronDown className="size-4" strokeWidth={1.25} />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  );
}

export function SelectValue({ children, ...props }: BaseSelect.Value.Props) {
  return <BaseSelect.Value {...props}>{children}</BaseSelect.Value>;
}

export function SelectContent({
  children,
  className,
  sideOffset,
  ...props
}: BaseSelect.Positioner.Props) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner
        {...props}
        className="outline-hidden select-none z-60"
        sideOffset={sideOffset ?? 4}
      >
        <BaseSelect.Popup className="min-w-(--anchor-width) origin-(--transform-origin) border border-muted bg-accent-foreground outline-hidden transition-[scale,opacity] duration-200 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-[side=none]:translate-y-px data-[side=none]:min-w-[calc(var(--anchor-width)+1.7rem)] data-[side=none]:data-ending-style:transition-none data-starting-style:scale-[0.98] data-starting-style:opacity-0 data-[side=none]:data-starting-style:scale-100 data-[side=none]:data-starting-style:opacity-100 data-[side=none]:data-starting-style:transition-none rounded">
          <BaseSelect.List className="relative scroll-py-6 p-0.5 overflow-y-auto max-h-(--available-height)">
            {children}
          </BaseSelect.List>
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}

export function SelectItem({
  className,
  children,
  ...props
}: BaseSelect.Item.Props) {
  return (
    <BaseSelect.Item
      {...props}
      className="grid cursor-pointer grid-cols-[1rem_1fr] items-center gap-2 py-1 px-2 transition-colors duration-200 text-sm outline-hidden select-none rounded data-highlighted:bg-accent/40"
    >
      <BaseSelect.ItemIndicator className="col-start-1">
        <Check className="size-4" strokeWidth={1.25} />
      </BaseSelect.ItemIndicator>
      <BaseSelect.ItemText className={cn("col-start-2", className)}>
        {children}
      </BaseSelect.ItemText>
    </BaseSelect.Item>
  );
}
