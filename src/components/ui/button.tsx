import { Button as BaseButton } from "@base-ui/react/button";
import { cn } from "@sglara/cn";

const baseClassName =
  "inline-flex items-center outline-none focus-visible:ring-2 justify-center hover:cursor-pointer active:translate-y-px active:opacity-70 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 rounded leading-none whitespace-nowrap font-normal select-none focus-visible:outline-2 focus-visible:-outline-offset-1";

const sizes = {
  icon: "size-6 p-1",
  sm: "h-6 px-2",
  md: "h-8 px-3",
  lg: "h-10 px-4",
};

const variants = {
  default: "bg-foreground text-background hover:bg-foreground/90",
  destructive:
    "bg-destructive text-background hover:bg-destructive/90 focus-visible:outline-destructive",
  outline:
    "border border-input bg-input/60 hover:bg-input/80 focus:ring-ring/40",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:outline-secondary",
  ghost: "hover:bg-accent/50 focus-visible:ring-ring/40",
};

interface ButtonProps extends BaseButton.Props {
  size?: keyof typeof sizes;
  variant?: keyof typeof variants;
}

export default function Button({
  children,
  className,
  size = "md",
  variant = "default",
  ...props
}: ButtonProps) {
  return (
    <BaseButton
      data-slot="button"
      className={cn(baseClassName, sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </BaseButton>
  );
}
