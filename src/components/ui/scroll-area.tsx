import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area";

export default function ScrollArea({
  children,
  className,
  ...props
}: BaseScrollArea.Content.Props) {
  return (
    <BaseScrollArea.Root className={className}>
      <BaseScrollArea.Viewport className="h-full">
        <BaseScrollArea.Content {...props} className="pr-2 text-sm leading-5.5">
          {children}
        </BaseScrollArea.Content>
      </BaseScrollArea.Viewport>
      <BaseScrollArea.Scrollbar className="m-px flex w-1 justify-center opacity-0 transition-opacity pointer-events-none duration-200 data-hovering:opacity-100 data-hovering:pointer-events-auto data-scrolling:opacity-100 data-scrolling:duration-0 data-scrolling:pointer-events-auto">
        <BaseScrollArea.Thumb className="w-full bg-ring rounded hover:bg-ring/70 active:bg-ring/50 transition-colors duration-200" />
      </BaseScrollArea.Scrollbar>
    </BaseScrollArea.Root>
  );
}
