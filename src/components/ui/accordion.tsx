import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { cn } from "@sglara/cn";
import { ChevronDown } from "lucide-react";

export function Accordion({ children, ...props }: BaseAccordion.Root.Props) {
  return <BaseAccordion.Root {...props}>{children}</BaseAccordion.Root>;
}

export function AccordionItem({
  className,
  children,
  ...props
}: BaseAccordion.Item.Props) {
  return (
    <BaseAccordion.Item
      {...props}
      className={cn(
        "not-first:border-t space-y-1.5 border-muted py-2",
        className,
      )}
    >
      {children}
    </BaseAccordion.Item>
  );
}

export function AccordionHeader({
  children,
  ...props
}: BaseAccordion.Header.Props) {
  return <BaseAccordion.Header {...props}>{children}</BaseAccordion.Header>;
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: BaseAccordion.Trigger.Props) {
  return (
    <BaseAccordion.Trigger
      {...props}
      className={cn(
        "group flex w-full items-center justify-between hover:cursor-pointer data-disabled:hover:cursor-default",
        className,
      )}
    >
      {children}
      <ChevronDown
        className="shrink-0 transition-transform duration-200 ease-[ease-out] group-data-panel-open:rotate-180 size-5.5"
        strokeWidth={1.25}
      />
    </BaseAccordion.Trigger>
  );
}

export function AccordionPanel({
  className,
  children,
  ...props
}: BaseAccordion.Panel.Props) {
  return (
    <BaseAccordion.Panel
      {...props}
      className={cn(
        "h-(--accordion-panel-height) overflow-hidden text-sm transition-[height] duration-150 ease-[ease-out] data-ending-style:h-0 data-starting-style:h-0",
        className,
      )}
    >
      {children}
    </BaseAccordion.Panel>
  );
}
