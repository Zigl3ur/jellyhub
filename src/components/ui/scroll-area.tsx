import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area";
import { cn } from "@sglara/cn";

export default function ScrollArea({
  children,
  className,
  ...props
}: BaseScrollArea.Root.Props) {
  return (
    <BaseScrollArea.Root
      {...props}
      className={cn("overflow-hidden", className)}
    >
      <BaseScrollArea.Viewport
        className={
          "size-full mask-linear-[to_bottom,transparent_0,black_min(40px,var(--scroll-area-overflow-y-start)),black_calc(100%-min(40px,var(--scroll-area-overflow-y-end,40px))),transparent_100%] mask-no-repeat"
        }
      >
        <BaseScrollArea.Content className="pr-2 text-sm leading-5.5">
          {children}
        </BaseScrollArea.Content>
      </BaseScrollArea.Viewport>
      <BaseScrollArea.Scrollbar className="m-px flex w-1 justify-center opacity-0 transition-opacity pointer-events-none duration-200 data-hovering:opacity-100 data-hovering:pointer-events-auto data-scrolling:opacity-100 data-scrolling:duration-0 data-scrolling:pointer-events-auto">
        <BaseScrollArea.Thumb className="w-full bg-ring rounded hover:bg-ring/70 active:bg-ring/50 transition-colors duration-200" />
      </BaseScrollArea.Scrollbar>
    </BaseScrollArea.Root>
  );
}
