import { Button as BaseButton } from "@base-ui/react/button";
import { cn } from "@sglara/cn";

export interface ButtonProps extends BaseButton.Props {
  size?: "icon-sm" | "icon" | "sm" | "md" | "lg";
  variant?:
    | "default"
    | "accent"
    | "destructive"
    | "destructive-ghost"
    | "outline"
    | "secondary"
    | "ghost";
}

export const buttonClassName =
  "group/button inline-flex items-center gap-1.5 outline-none focus-visible:ring-2 disabled:pointer-events-none justify-center hover:cursor-pointer active:translate-y-px active:opacity-70 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 rounded leading-none whitespace-nowrap font-normal select-none focus-visible:outline-2 focus-visible:-outline-offset-1 disabled:hover:cursor-not-allowed";

export const buttonSizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  "icon-sm": "size-4",
  icon: "size-6 p-1",
  sm: "h-6 px-2",
  md: "h-8 px-3",
  lg: "h-10 px-4",
};

export const buttonVariants: Record<
  NonNullable<ButtonProps["variant"]>,
  string
> = {
  default: "bg-foreground text-background hover:bg-foreground/90",
  accent: "bg-accent text-foreground hover:bg-accent/90",
  destructive: "bg-destructive hover:bg-destructive/90 focus-visible:ring-ring",
  "destructive-ghost":
    "hover:bg-destructive/20 text-destructive focus-visible:ring-ring",
  outline:
    "border border-input bg-input/60 hover:bg-input/80 focus:ring-ring/40",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:outline-secondary",
  ghost: "hover:bg-accent/50 focus-visible:ring-ring/40",
};

export default function Button({
  children,
  className,
  size = "md",
  variant = "default",
  ...props
}: ButtonProps) {
  return (
    <BaseButton
      {...props}
      data-slot="button"
      className={cn(
        buttonClassName,
        buttonSizes[size],
        buttonVariants[variant],
        className,
      )}
    >
      {children}
    </BaseButton>
  );
}
