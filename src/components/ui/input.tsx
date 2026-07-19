import { Input as BaseInput } from "@base-ui/react/input";
import { cn } from "@sglara/cn";
import type { PropsWithChildren } from "react";

export function Input({ children, className, ...props }: BaseInput.Props) {
  return (
    <div
      className={cn(
        "w-full flex items-center h-8 rounded bg-input/20 border border-input transition-colors duration-200 ",
        "has-[[data-slot='input']:disabled]:opacity-50 has-[[data-slot='input']:disabled]:text-muted-foreground/50 has-[[data-slot=input][data-invalid]]:border-destructive/80 has-[[data-slot='input']:focus]:border-ring/80 has-[[data-slot='input']:focus]:ring-3 has-[[data-slot='input']:focus]:ring-ring/40 has-[[data-slot=input][data-invalid]:focus]:border-destructive has-[[data-slot=input][data-invalid]:focus]:ring-destructive/50",
        "has-[[data-slot=input-addon][data-side=left]]:**:data-[slot=input]:pl-1 has-[[data-slot=input-addon][data-side=right]]:**:data-[slot=input]:pr-1",
      )}
    >
      <BaseInput
        {...props}
        data-slot="input"
        className={cn(
          "w-full min-w-0 placeholder:text-muted-foreground/50 py-0.5 px-2 outline-none ",
          className,
        )}
      />
      {children}
    </div>
  );
}

interface InputAddonProps extends PropsWithChildren {
  side?: "left" | "right";
}

export function InputAddon({ side = "right", children }: InputAddonProps) {
  return (
    <div
      data-slot="input-addon"
      data-side={side}
      className={cn(
        "h-full flex items-center py-0.5",
        side === "left" ? "pl-1 order-first" : "pr-1",
      )}
    >
      {children}
    </div>
  );
}
